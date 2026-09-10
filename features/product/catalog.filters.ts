import type { FlowerProduct, ProductCategory, ProductLine } from './product.type.ts';

/** Legacy 1.0 filter sentinel retained for state compatibility during storefront rollout. */
export const ALL_CATEGORIES = 'all';

export interface CatalogFilters {
  query: string;
  flowerTypeIds: string[];
  occasionNames: string[];
  productLineIds: string[];
  colorNames: string[];
  collectionNames: string[];
  tagNames: string[];
  minPrice: number | null;
  maxPrice: number | null;
  categoryId?: string;
  occasions?: string[];
}

export interface CatalogFilterOptions {
  flowerTypes: ProductCategory[];
  occasions: string[];
  productLines: ProductLine[];
  colors: string[];
  collections: string[];
  tags: string[];
  priceExtent: { min: number; max: number } | null;
  categories: ProductCategory[];
}

export const EMPTY_CATALOG_FILTERS: CatalogFilters = {
  query: '',
  flowerTypeIds: [],
  occasionNames: [],
  productLineIds: [],
  colorNames: [],
  collectionNames: [],
  tagNames: [],
  minPrice: null,
  maxPrice: null,
};

export const normalizeCatalogSearch = (value: string): string => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .replace(/Đ/g, 'D')
  .toLocaleLowerCase('vi')
  .trim();

const uniqueLabels = (values: string[]): string[] => {
  const labels = new Map<string, string>();
  values.forEach((value) => {
    const label = value.trim();
    if (!label) return;
    const key = normalizeCatalogSearch(label);
    if (!labels.has(key)) labels.set(key, label);
  });
  return Array.from(labels.values()).sort((left, right) => left.localeCompare(right, 'vi'));
};

const uniqueById = <T extends { id: string; name: string }>(values: T[]): T[] => {
  const items = new Map<string, T>();
  values.forEach((value) => {
    const id = value.id.trim();
    const name = value.name.trim();
    if (id && name && !items.has(id)) items.set(id, { ...value, id, name });
  });
  return Array.from(items.values()).sort((left, right) => left.name.localeCompare(right.name, 'vi'));
};

export const getCatalogFilterOptions = (products: FlowerProduct[]): CatalogFilterOptions => {
  const prices = products
    .map((product) => product.salePrice ?? product.price)
    .filter((price) => Number.isFinite(price) && price >= 0);
  const flowerTypes = uniqueById(products.map((product) => product.category));
  return {
    flowerTypes,
    categories: flowerTypes,
    occasions: uniqueLabels(products.flatMap((product) => product.attributes.occasions)),
    productLines: uniqueById(products.flatMap((product) => product.productLine ? [product.productLine] : [])),
    colors: uniqueLabels(products.flatMap((product) => product.attributes.colors)),
    collections: uniqueLabels(products.flatMap((product) => product.attributes.collections)),
    tags: uniqueLabels(products.flatMap((product) => product.attributes.tags)),
    priceExtent: prices.length ? { min: Math.min(...prices), max: Math.max(...prices) } : null,
  };
};

const sanitizeIds = (values: string[], availableIds: Set<string>): string[] =>
  Array.from(new Set(values.map((value) => value.trim()).filter((value) => availableIds.has(value))));

const sanitizeLabels = (values: string[], available: string[]): string[] => {
  const labels = new Map(available.map((label) => [normalizeCatalogSearch(label), label]));
  return Array.from(new Set(values
    .map((value) => labels.get(normalizeCatalogSearch(value)))
    .filter((value): value is string => Boolean(value))));
};

const sanitizePrice = (value: number | null): number | null =>
  value !== null && Number.isFinite(value) && value >= 0 ? value : null;

export const sanitizeCatalogFilters = (
  filters: CatalogFilters,
  options: CatalogFilterOptions,
): CatalogFilters => {
  const legacyCategory = filters.categoryId && filters.categoryId !== ALL_CATEGORIES
    ? [filters.categoryId]
    : [];
  const result: CatalogFilters = {
    query: filters.query,
    flowerTypeIds: sanitizeIds(filters.flowerTypeIds ?? legacyCategory, new Set(options.flowerTypes.map(({ id }) => id))),
    occasionNames: sanitizeLabels(filters.occasionNames ?? filters.occasions ?? [], options.occasions),
    productLineIds: sanitizeIds(filters.productLineIds ?? [], new Set(options.productLines.map(({ id }) => id))),
    colorNames: sanitizeLabels(filters.colorNames ?? [], options.colors),
    collectionNames: sanitizeLabels(filters.collectionNames ?? [], options.collections),
    tagNames: sanitizeLabels(filters.tagNames ?? [], options.tags),
    minPrice: sanitizePrice(filters.minPrice ?? null),
    maxPrice: sanitizePrice(filters.maxPrice ?? null),
  };
  if ('categoryId' in filters || 'occasions' in filters) {
    result.categoryId = result.flowerTypeIds[0] ?? ALL_CATEGORIES;
    result.occasions = result.occasionNames;
  }
  return result;
};

const matchesAnyLabel = (selected: string[], productValues: string[]): boolean => {
  if (!selected.length) return true;
  const values = new Set(productValues.map(normalizeCatalogSearch));
  return selected.some((item) => values.has(normalizeCatalogSearch(item)));
};

export const filterCatalogProducts = (
  products: FlowerProduct[],
  filters: CatalogFilters,
): FlowerProduct[] => {
  const query = normalizeCatalogSearch(filters.query);
  const flowerTypeIds = new Set(filters.flowerTypeIds
    ?? (filters.categoryId && filters.categoryId !== ALL_CATEGORIES ? [filters.categoryId] : []));
  const productLineIds = new Set(filters.productLineIds ?? []);

  return products.filter((product) => {
    const searchableText = normalizeCatalogSearch([
      product.name,
      ...product.attributes.collections,
      ...product.attributes.occasions,
      ...product.attributes.tags,
    ].join(' '));
    const effectivePrice = product.salePrice ?? product.price;

    return (!query || searchableText.includes(query))
      && (!flowerTypeIds.size || flowerTypeIds.has(product.category.id))
      && (!productLineIds.size || (product.productLine && productLineIds.has(product.productLine.id)))
      && matchesAnyLabel(filters.occasionNames ?? filters.occasions ?? [], product.attributes.occasions)
      && matchesAnyLabel(filters.colorNames ?? [], product.attributes.colors)
      && matchesAnyLabel(filters.collectionNames ?? [], product.attributes.collections)
      && matchesAnyLabel(filters.tagNames ?? [], product.attributes.tags)
      && (filters.minPrice == null || effectivePrice >= filters.minPrice)
      && (filters.maxPrice == null || effectivePrice <= filters.maxPrice);
  });
};

export const catalogActiveFilterCount = (filters: CatalogFilters): number => [
  filters.query.trim().length > 0,
  ...(filters.flowerTypeIds ?? []).map(() => true),
  ...(filters.occasionNames ?? []).map(() => true),
  ...(filters.productLineIds ?? []).map(() => true),
  ...(filters.colorNames ?? []).map(() => true),
  ...(filters.collectionNames ?? []).map(() => true),
  ...(filters.tagNames ?? []).map(() => true),
  filters.minPrice !== null || filters.maxPrice !== null,
].filter(Boolean).length;
