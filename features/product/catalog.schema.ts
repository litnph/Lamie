const SCHEMA_VERSIONS = ['1.0', '1.1'] as const;
type SchemaVersion = (typeof SCHEMA_VERSIONS)[number];
const SHA256_PATTERN = /^[a-f0-9]{64}$/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type JsonObject = Record<string, unknown>;

export interface CatalogManifest {
  schemaVersion: SchemaVersion;
  generatedAt: string;
  catalog: {
    href: string;
    version: string;
    productCount: number;
  };
  imageCount: number;
}

export interface ExportedProductImage {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
}

export interface ExportedProduct {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  productLine: { id: string; name: string } | null;
  images: ExportedProductImage[];
  attributes: {
    tags: string[];
    colors: string[];
    collections: string[];
    occasions: string[];
    styles: string[];
  };
  similarProductIds: string[];
}

export interface ExportedCatalog {
  schemaVersion: SchemaVersion;
  generatedAt: string;
  settings: { priceDeviationPercent: number };
  products: ExportedProduct[];
}

export class CatalogValidationError extends Error {
  readonly path: string;

  constructor(path: string, message: string) {
    super(`${path}: ${message}`);
    this.name = 'CatalogValidationError';
    this.path = path;
  }
}

const fail = (path: string, message: string): never => {
  throw new CatalogValidationError(path, message);
};

const objectAt = (value: unknown, path: string): JsonObject => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return fail(path, 'expected an object');
  }
  return value as JsonObject;
};

const arrayAt = (value: unknown, path: string): unknown[] => {
  if (!Array.isArray(value)) return fail(path, 'expected an array');
  return value;
};

const stringAt = (value: unknown, path: string, allowEmpty = false): string => {
  if (typeof value !== 'string' || (!allowEmpty && value.trim().length === 0)) {
    return fail(path, allowEmpty ? 'expected a string' : 'expected a non-empty string');
  }
  return value;
};

const numberAt = (value: unknown, path: string): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return fail(path, 'expected a finite non-negative number');
  }
  return value;
};

const schemaVersionAt = (value: unknown, path: string): SchemaVersion => {
  if (typeof value !== 'string' || !SCHEMA_VERSIONS.includes(value as SchemaVersion)) {
    return fail(path, `expected one of ${SCHEMA_VERSIONS.join(', ')}`);
  }
  return value as SchemaVersion;
};

const integerAt = (value: unknown, path: string): number => {
  const result = numberAt(value, path);
  if (!Number.isInteger(result)) return fail(path, 'expected an integer');
  return result;
};

const nullableNumberAt = (value: unknown, path: string): number | null => {
  if (value === null) return null;
  return numberAt(value, path);
};

const isoDateAt = (value: unknown, path: string): string => {
  const result = stringAt(value, path);
  if (!/^\d{4}-\d{2}-\d{2}T/.test(result) || Number.isNaN(Date.parse(result))) {
    return fail(path, 'expected an ISO-8601 timestamp');
  }
  return result;
};

const slugAt = (value: unknown, path: string): string => {
  const result = stringAt(value, path);
  if (!SLUG_PATTERN.test(result)) return fail(path, 'expected a lowercase URL slug');
  return result;
};

const stringListAt = (value: unknown, path: string): string[] => {
  const values = arrayAt(value, path).map((item, index) => stringAt(item, `${path}[${index}]`));
  return Array.from(new Set(values));
};

const decodePath = (value: string, path: string): string => {
  try {
    let decoded = value;
    for (let index = 0; index < 2; index += 1) decoded = decodeURIComponent(decoded);
    return decoded;
  } catch {
    return fail(path, 'contains invalid URL encoding');
  }
};

export const safeRelativePathAt = (value: unknown, path: string): string => {
  const result = stringAt(value, path);
  const decoded = decodePath(result, path);
  if (
    result !== result.trim()
    || result.startsWith('/')
    || result.startsWith('\\')
    || result.includes('\\')
    || /[\u0000-\u001f\u007f]/.test(result)
    || /[?#]/.test(result)
    || decoded.includes('\\')
    || decoded.includes(':')
  ) {
    return fail(path, 'must be a clean relative URL path');
  }

  const segments = decoded.split('/');
  if (segments.some((segment) => !segment || segment === '.' || segment === '..')) {
    return fail(path, 'must not contain empty or traversal segments');
  }
  return result;
};

export const resolveStaticUrl = (
  relativePath: string,
  documentUrl: string,
  allowedDirectoryUrl: string,
): URL => {
  safeRelativePathAt(relativePath, 'relativePath');
  const document = new URL(documentUrl);
  const allowedDirectory = new URL(allowedDirectoryUrl);
  const resolved = new URL(relativePath, document);
  const allowedPath = allowedDirectory.pathname.endsWith('/')
    ? allowedDirectory.pathname
    : `${allowedDirectory.pathname}/`;

  if (resolved.origin !== allowedDirectory.origin || !resolved.pathname.startsWith(allowedPath)) {
    return fail('relativePath', 'resolves outside the generated FE data directory');
  }
  return resolved;
};

export const parseCatalogManifest = (value: unknown): CatalogManifest => {
  const root = objectAt(value, 'manifest');
  const schemaVersion = schemaVersionAt(root.schemaVersion, 'manifest.schemaVersion');

  const catalog = objectAt(root.catalog, 'manifest.catalog');
  const version = stringAt(catalog.version, 'manifest.catalog.version');
  if (!SHA256_PATTERN.test(version)) {
    return fail('manifest.catalog.version', 'expected a SHA-256 hex digest');
  }

  return {
    schemaVersion,
    generatedAt: isoDateAt(root.generatedAt, 'manifest.generatedAt'),
    catalog: {
      href: safeRelativePathAt(catalog.href, 'manifest.catalog.href'),
      version,
      productCount: integerAt(catalog.productCount, 'manifest.catalog.productCount'),
    },
    imageCount: integerAt(root.imageCount, 'manifest.imageCount'),
  };
};

const parseImage = (value: unknown, path: string): ExportedProductImage => {
  const image = objectAt(value, path);
  const url = safeRelativePathAt(image.url, `${path}.url`);
  if (!url.startsWith('images/products/')) {
    return fail(`${path}.url`, 'must be inside images/products');
  }
  return {
    id: stringAt(image.id, `${path}.id`),
    url,
    alt: stringAt(image.alt, `${path}.alt`, true),
    sortOrder: integerAt(image.sortOrder, `${path}.sortOrder`),
  };
};

const parseProduct = (value: unknown, path: string): ExportedProduct => {
  const product = objectAt(value, path);
  const category = objectAt(product.category, `${path}.category`);
  const attributes = objectAt(product.attributes, `${path}.attributes`);
  const images = arrayAt(product.images, `${path}.images`).map((image, index) =>
    parseImage(image, `${path}.images[${index}]`),
  );
  const productLine = product.productLine == null
    ? null
    : objectAt(product.productLine, `${path}.productLine`);

  const imageIds = new Set<string>();
  for (const image of images) {
    if (imageIds.has(image.id)) return fail(`${path}.images`, `duplicate image id ${image.id}`);
    imageIds.add(image.id);
  }

  return {
    id: stringAt(product.id, `${path}.id`),
    sku: stringAt(product.sku, `${path}.sku`),
    slug: slugAt(product.slug, `${path}.slug`),
    name: stringAt(product.name, `${path}.name`),
    description: stringAt(product.description, `${path}.description`, true),
    price: numberAt(product.price, `${path}.price`),
    salePrice: nullableNumberAt(product.salePrice, `${path}.salePrice`),
    category: {
      id: stringAt(category.id, `${path}.category.id`),
      name: stringAt(category.name, `${path}.category.name`),
      slug: slugAt(category.slug, `${path}.category.slug`),
    },
    productLine: productLine ? {
      id: stringAt(productLine.id, `${path}.productLine.id`),
      name: stringAt(productLine.name, `${path}.productLine.name`),
    } : null,
    images,
    attributes: {
      tags: stringListAt(attributes.tags, `${path}.attributes.tags`),
      colors: stringListAt(attributes.colors, `${path}.attributes.colors`),
      collections: stringListAt(attributes.collections, `${path}.attributes.collections`),
      occasions: stringListAt(attributes.occasions, `${path}.attributes.occasions`),
      styles: stringListAt(attributes.styles, `${path}.attributes.styles`),
    },
    similarProductIds: product.similarProductIds === undefined
      ? []
      : stringListAt(product.similarProductIds, `${path}.similarProductIds`),
  };
};

export const parseExportedCatalog = (value: unknown): ExportedCatalog => {
  const root = objectAt(value, 'catalog');
  const schemaVersion = schemaVersionAt(root.schemaVersion, 'catalog.schemaVersion');
  const settings = root.settings === undefined
    ? { priceDeviationPercent: 20 }
    : objectAt(root.settings, 'catalog.settings');
  const priceDeviationPercent = numberAt(
    settings.priceDeviationPercent,
    'catalog.settings.priceDeviationPercent',
  );
  if (priceDeviationPercent > 100) {
    return fail('catalog.settings.priceDeviationPercent', 'must not exceed 100');
  }

  const products = arrayAt(root.products, 'catalog.products').map((product, index) =>
    parseProduct(product, `catalog.products[${index}]`),
  );
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const product of products) {
    if (ids.has(product.id)) return fail('catalog.products', `duplicate product id ${product.id}`);
    if (slugs.has(product.slug)) return fail('catalog.products', `duplicate product slug ${product.slug}`);
    ids.add(product.id);
    slugs.add(product.slug);
  }
  for (const product of products) {
    if (product.similarProductIds.includes(product.id)) {
      return fail('catalog.products', `product ${product.id} cannot reference itself`);
    }
    const missingId = product.similarProductIds.find((id) => !ids.has(id));
    if (missingId) return fail('catalog.products', `unknown similar product id ${missingId}`);
  }

  return {
    schemaVersion,
    generatedAt: isoDateAt(root.generatedAt, 'catalog.generatedAt'),
    settings: { priceDeviationPercent },
    products,
  };
};
