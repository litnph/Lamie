import assert from 'node:assert/strict';
import test from 'node:test';
import { DEMO_PRODUCTS, getCatalogProducts, PRODUCTION_PRODUCTS, validateProducts } from '../features/catalog/catalog.data.ts';
import { EMPTY_FILTERS, filterAndSortProducts, normalizeVietnamese, parseCatalogSearch, serializeCatalogFilters } from '../features/catalog/catalog.logic.ts';
import { parseRoute } from '../app/router.ts';

test('development contains exactly 24 clearly isolated demo records', () => {
  assert.equal(DEMO_PRODUCTS.length, 24);
  assert.ok(DEMO_PRODUCTS.every((product) => product.isDemo && product.published));
  assert.ok(DEMO_PRODUCTS.every((product) => product.price.mode === 'contact' || product.price.isTest === true));
  assert.equal(getCatalogProducts(true).length, 24);
  assert.deepEqual(getCatalogProducts(false), PRODUCTION_PRODUCTS);
});

test('schema validation rejects duplicate slugs and malformed fixed prices', () => {
  assert.throws(() => validateProducts([DEMO_PRODUCTS[0], { ...DEMO_PRODUCTS[1], slug: DEMO_PRODUCTS[0].slug }]), /trùng/);
  assert.throws(() => validateProducts([{ ...DEMO_PRODUCTS[0], price: { mode: 'fixed', amount: -1 } }]), /price/);
});

test('Vietnamese search is case, accent and đ/d insensitive with controlled synonyms', () => {
  assert.equal(normalizeVietnamese(' Đỏ  Dịu Dàng '), 'do diu dang');
  assert.ok(filterAndSortProducts(DEMO_PRODUCTS, { ...EMPTY_FILTERS, query: 'sao xanh' }).some((product) => product.flowers.includes('Hoa lam tinh')));
  assert.ok(filterAndSortProducts(DEMO_PRODUCTS, { ...EMPTY_FILTERS, query: 'cu nhan' }).every((product) => product.occasions.includes('Tốt nghiệp')));
  assert.ok(filterAndSortProducts(DEMO_PRODUCTS, { ...EMPTY_FILTERS, query: 'hoa hong do' }).every((product) => product.flowers.includes('Hoa hồng') && product.colors.includes('Đỏ')));
});

test('compound search keeps non-synonym terms as required conditions', () => {
  const result = filterAndSortProducts(DEMO_PRODUCTS, { ...EMPTY_FILTERS, query: 'bouquet tulip' });
  assert.ok(result.length > 0);
  assert.ok(result.every((product) => product.form === 'bo-hoa' && product.flowers.includes('Tulip')));
});

test('filters use OR inside a group and AND across groups', () => {
  const result = filterAndSortProducts(DEMO_PRODUCTS, {
    ...EMPTY_FILTERS,
    occasions: ['Tình yêu', 'Kỷ niệm'],
    lines: ['hoa-tuoi'],
    colors: ['Đỏ', 'Tím'],
  });
  assert.ok(result.length > 0);
  assert.ok(result.every((product) => product.line === 'hoa-tuoi'));
  assert.ok(result.every((product) => product.occasions.some((value) => ['Tình yêu', 'Kỷ niệm'].includes(value))));
  assert.ok(result.every((product) => product.colors.some((value) => ['Đỏ', 'Tím'].includes(value))));
});

test('contact-price products stay outside numeric budget ranges', () => {
  const result = filterAndSortProducts(DEMO_PRODUCTS, { ...EMPTY_FILTERS, minPrice: 0, maxPrice: 2000000 });
  assert.ok(result.every((product) => product.price.mode === 'fixed'));
  assert.ok(filterAndSortProducts(DEMO_PRODUCTS, { ...EMPTY_FILTERS, quoteOnly: true }).every((product) => product.price.mode === 'contact'));
});

test('catalog URL state round-trips and drops unknown taxonomy values', () => {
  const filters = {
    ...EMPTY_FILTERS,
    query: 'hoa hồng',
    occasions: ['Sinh nhật'],
    lines: ['hoa-tuoi'],
    colors: ['Đỏ'],
    quoteOnly: true,
    sort: 'name',
  };
  const serialized = serializeCatalogFilters(filters);
  assert.deepEqual(parseCatalogSearch(`?${serialized}`), filters);
  assert.deepEqual(parseCatalogSearch('?dip=Khong-ton-tai&dong=fake').occasions, []);
});

test('approved paths resolve to Home, Catalog, Detail and 404', () => {
  assert.deepEqual(parseRoute('/'), { name: 'home' });
  assert.deepEqual(parseRoute('/mau-hoa'), { name: 'catalog' });
  assert.deepEqual(parseRoute('/mau-hoa/mau-demo-01'), { name: 'product', slug: 'mau-demo-01' });
  assert.deepEqual(parseRoute('/login'), { name: 'not-found' });
});
