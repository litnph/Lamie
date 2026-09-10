import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  CatalogValidationError,
  parseCatalogManifest,
  parseExportedCatalog,
  resolveStaticUrl,
} from '../features/product/catalog.schema.ts';
import { CatalogLoadError, loadProductCatalog } from '../features/product/catalog.repository.ts';
import { getConfiguredSimilarProducts, getSamePriceRangeProducts } from '../features/product/catalog.related.ts';
import {
  ALL_CATEGORIES,
  EMPTY_CATALOG_FILTERS,
  filterCatalogProducts,
  getCatalogFilterOptions,
  sanitizeCatalogFilters,
} from '../features/product/catalog.filters.ts';

const VERSION = 'a'.repeat(64);
const GENERATED_AT = '2026-08-17T08:00:00.000Z';

const manifest = (overrides = {}) => ({
  schemaVersion: '1.0',
  generatedAt: GENERATED_AT,
  catalog: {
    href: 'products.json',
    version: VERSION,
    productCount: 1,
  },
  imageCount: 1,
  ...overrides,
});

const product = (overrides = {}) => ({
  id: '101',
  sku: 'LAM-MD-101',
  slug: 'morning-dew',
  name: 'Morning Dew',
  description: 'A gentle white and green arrangement.',
  price: 450000,
  salePrice: null,
  category: { id: 'daily', name: 'Daily', slug: 'daily' },
  productLine: null,
  images: [
    {
      id: '101-main',
      url: 'images/products/morning-dew.svg',
      alt: 'White and green flower arrangement',
      sortOrder: 0,
    },
  ],
  attributes: {
    tags: ['fresh'],
    colors: ['white', 'green'],
    collections: ['Lamie daily'],
    occasions: ['home'],
    styles: ['minimal'],
  },
  similarProductIds: [],
  ...overrides,
});

const catalog = (products = [product()], overrides = {}) => ({
  schemaVersion: '1.0',
  generatedAt: GENERATED_AT,
  products,
  ...overrides,
});

const catalogVersion = (value) => createHash('sha256')
  .update(JSON.stringify(value))
  .digest('hex');

const jsonResponse = (value, status = 200) => new Response(JSON.stringify(value), {
  status,
  headers: { 'content-type': 'application/json' },
});

test('valid manifest and catalog parse the complete exporter contract', () => {
  const parsedManifest = parseCatalogManifest(manifest());
  const parsedCatalog = parseExportedCatalog(catalog());

  assert.equal(parsedManifest.catalog.version, VERSION);
  assert.equal(parsedCatalog.products[0].category.id, 'daily');
  assert.deepEqual(parsedCatalog.products[0].attributes.colors, ['white', 'green']);
});

test('an intentionally empty exported description remains a valid product', () => {
  const parsedCatalog = parseExportedCatalog(catalog([product({ description: '' })]));

  assert.equal(parsedCatalog.products[0].description, '');
});

test('schema 1.1 parses discovery settings while schema 1.0 keeps safe defaults', () => {
  const legacy = parseExportedCatalog(catalog());
  const current = parseExportedCatalog(catalog([
    product({ productLine: { id: 'signature', name: 'Signature' } }),
  ], {
    schemaVersion: '1.1',
    settings: { priceDeviationPercent: 17.5 },
  }));

  assert.equal(legacy.settings.priceDeviationPercent, 20);
  assert.equal(current.settings.priceDeviationPercent, 17.5);
  assert.equal(current.products[0].productLine.name, 'Signature');
});

test('empty catalog is valid when the export deliberately contains no products', async () => {
  const exportedCatalog = catalog([]);
  const version = catalogVersion(exportedCatalog);
  const requests = [];
  const fetcher = async (input) => {
    const url = new URL(String(input));
    requests.push(url);
    return url.pathname.endsWith('/manifest.json')
      ? jsonResponse(manifest({ catalog: { href: 'products.json', version, productCount: 0 }, imageCount: 0 }))
      : jsonResponse(exportedCatalog);
  };

  const result = await loadProductCatalog({
    fetcher,
    publicBaseUrl: '/store/',
    documentUrl: 'https://shop.lamie.test/store/',
  });

  assert.deepEqual(result.products, []);
  assert.equal(result.metadata.productCount, 0);
  assert.equal(requests.length, 2);
});

test('repository requests only same-origin generated files and versions catalog plus images', async () => {
  const exportedCatalog = catalog();
  const version = catalogVersion(exportedCatalog);
  const requests = [];
  const fetcher = async (input, init) => {
    const url = new URL(String(input));
    requests.push({ url, init });
    if (url.pathname.endsWith('/manifest.json')) {
      return jsonResponse(manifest({ catalog: { href: 'products.json', version, productCount: 1 } }));
    }
    if (url.pathname.endsWith('/products.json')) return jsonResponse(exportedCatalog);
    return new Response(null, { status: 404 });
  };

  const result = await loadProductCatalog({
    fetcher,
    publicBaseUrl: '/store/',
    documentUrl: 'https://shop.lamie.test/store/index.html',
  });

  assert.equal(requests.length, 2);
  assert.ok(requests.every(({ url }) => url.origin === 'https://shop.lamie.test'));
  assert.ok(requests.every(({ url }) => url.pathname.startsWith('/store/fe-data/')));
  assert.equal(requests[0].init.cache, 'no-store');
  assert.equal(requests[1].url.searchParams.get('v'), version);
  assert.equal(result.products[0].images[0].url, `https://shop.lamie.test/store/fe-data/images/products/morning-dew.svg?v=${version}`);
});

test('repository rejects a catalog whose bytes do not match the manifest checksum', async () => {
  const exportedCatalog = catalog();
  const fetcher = async (input) => String(input).includes('manifest.json')
    ? jsonResponse(manifest())
    : jsonResponse(exportedCatalog);

  await assert.rejects(
    loadProductCatalog({ fetcher, documentUrl: 'https://shop.lamie.test/' }),
    (error) => error instanceof CatalogLoadError
      && error.code === 'invalid-data'
      && /checksum/.test(error.message),
  );
});

test('invalid schema, counts, and unsafe paths fail closed', async (context) => {
  await context.test('wrong schema version', () => {
    assert.throws(
      () => parseCatalogManifest(manifest({ schemaVersion: '2.0' })),
      CatalogValidationError,
    );
  });

  await context.test('catalog path traversal', () => {
    assert.throws(
      () => parseCatalogManifest(manifest({ catalog: { href: '../products.json', version: VERSION, productCount: 1 } })),
      /traversal/,
    );
  });

  await context.test('absolute product image URL', () => {
    assert.throws(
      () => parseExportedCatalog(catalog([product({ images: [{ id: 'bad', url: 'https://api.lamie.test/image.jpg', alt: '', sortOrder: 0 }] })])),
      /relative URL path/,
    );
  });

  await context.test('encoded image traversal', () => {
    assert.throws(
      () => parseExportedCatalog(catalog([product({ images: [{ id: 'bad', url: 'images/products/%252e%252e/secret.jpg', alt: '', sortOrder: 0 }] })])),
      /traversal/,
    );
  });

  await context.test('manifest count mismatch', async () => {
    const exportedCatalog = catalog();
    const version = catalogVersion(exportedCatalog);
    const fetcher = async (input) => String(input).includes('manifest.json')
      ? jsonResponse(manifest({ catalog: { href: 'products.json', version, productCount: 2 } }))
      : jsonResponse(exportedCatalog);
    await assert.rejects(
      loadProductCatalog({ fetcher, documentUrl: 'https://shop.lamie.test/' }),
      (error) => error instanceof CatalogLoadError && error.code === 'invalid-data',
    );
  });
});

test('URL resolver enforces the generated directory boundary', () => {
  const resolved = resolveStaticUrl(
    'images/products/morning-dew.svg',
    'https://shop.lamie.test/fe-data/products.json',
    'https://shop.lamie.test/fe-data/',
  );
  assert.equal(resolved.href, 'https://shop.lamie.test/fe-data/images/products/morning-dew.svg');
  assert.throws(
    () => resolveStaticUrl('../private.json', 'https://shop.lamie.test/fe-data/products.json', 'https://shop.lamie.test/fe-data/'),
    CatalogValidationError,
  );
});

test('active catalog source contains no API_Lamie or backend base URL', async () => {
  const source = await readFile(new URL('../features/product/catalog.repository.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /API_Lamie|VITE_API|localhost:\d+\/api|\/api\/products/i);
  assert.match(source, /fe-data\/manifest\.json/);
});

test('storefront filters are derived from exported taxonomy and remove duplicates', () => {
  const products = [
    product(),
    product({
      id: '102',
      sku: 'LAM-ROSE-102',
      slug: 'vintage-rose',
      name: 'Vintage Rose',
      category: { id: 'special', name: 'Special', slug: 'special' },
      attributes: {
        tags: [], colors: ['pink'], collections: [],
        occasions: ['Home', 'Anniversary'], styles: [],
      },
    }),
  ];

  const options = getCatalogFilterOptions(products);

  assert.deepEqual(options.categories.map(({ id }) => id), ['daily', 'special']);
  assert.deepEqual(options.occasions, ['Anniversary', 'home']);
});

test('storefront search is accent-insensitive and combines category with multiple occasions', () => {
  const products = [
    product({
      name: 'Sương sớm',
      category: { id: 'bouquet', name: 'Hoa bó', slug: 'hoa-bo' },
      attributes: {
        tags: ['tươi'], colors: ['trắng'], collections: [],
        occasions: ['Sinh nhật', 'Chúc mừng'], styles: [],
      },
    }),
    product({
      id: '102', sku: 'LAM-OPEN-102', slug: 'khai-truong', name: 'Khai trương',
      category: { id: 'stand', name: 'Kệ hoa mini', slug: 'ke-hoa-mini' },
      attributes: {
        tags: [], colors: ['hồng'], collections: [], occasions: ['Chúc mừng'], styles: [],
      },
    }),
  ];

  assert.deepEqual(
    filterCatalogProducts(products, {
      query: 'suong',
      categoryId: 'bouquet',
      occasions: ['Sinh nhật', 'Chúc mừng'],
    }).map(({ id }) => id),
    ['101'],
  );
  assert.deepEqual(filterCatalogProducts(products, EMPTY_CATALOG_FILTERS), products);
});

test('stale generated taxonomy selections are removed without discarding search text', () => {
  const options = getCatalogFilterOptions([product()]);
  const sanitized = sanitizeCatalogFilters({
    query: 'rose',
    categoryId: 'removed-category',
    occasions: ['home', 'Removed occasion'],
  }, options);

  assert.equal(sanitized.query, 'rose');
  assert.equal(sanitized.categoryId, ALL_CATEGORIES);
  assert.deepEqual(sanitized.occasions, ['home']);
});

test('all storefront filter groups use OR within a group and AND across groups', () => {
  const products = [
    product({ id: '101', productLine: { id: 'signature', name: 'Signature' } }),
    product({
      id: '102', sku: 'ROSE', slug: 'rose', name: 'Rose', price: 900000,
      category: { id: 'rose', name: 'Rose', slug: 'rose' },
      productLine: { id: 'event', name: 'Event' },
      attributes: { tags: ['romantic'], colors: ['red'], collections: ['Valentine'], occasions: ['Love'], styles: [] },
    }),
  ];
  const result = filterCatalogProducts(products, {
    query: 'valentine',
    flowerTypeIds: ['daily', 'rose'],
    occasionNames: ['Love'],
    productLineIds: ['event'],
    colorNames: ['red', 'pink'],
    collectionNames: ['Valentine'],
    tagNames: ['romantic'],
    minPrice: 800000,
    maxPrice: 1000000,
  });
  assert.deepEqual(result.map(({ id }) => id), ['102']);
});

test('related product rules keep configured similarity separate and calculate inclusive price bounds', () => {
  const current = product({ id: '100', price: 500000, similarProductIds: ['103'] });
  const low = product({ id: '101', sku: 'LOW', slug: 'low', price: 400000 });
  const high = product({ id: '102', sku: 'HIGH', slug: 'high', price: 600000 });
  const configured = product({ id: '103', sku: 'CONFIGURED', slug: 'configured', price: 900000 });
  const catalogProducts = [current, low, high, configured];

  assert.deepEqual(getConfiguredSimilarProducts(catalogProducts, current).map(({ id }) => id), ['103']);
  assert.deepEqual(getSamePriceRangeProducts(catalogProducts, current, 20).map(({ id }) => id), ['101', '102']);
  assert.ok(!getSamePriceRangeProducts(catalogProducts, current, 20).some(({ id }) => id === current.id));
});
