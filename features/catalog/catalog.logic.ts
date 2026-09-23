import { TAXONOMY, labelFor } from './catalog.taxonomy.ts';
import type { CatalogFilters, CatalogProduct, CatalogSort } from './catalog.types';

export const EMPTY_FILTERS: CatalogFilters = {
  query: '',
  occasions: [],
  lines: [],
  forms: [],
  flowers: [],
  colors: [],
  palettes: [],
  styles: [],
  collections: [],
  statuses: [],
  quoteOnly: false,
  minPrice: null,
  maxPrice: null,
  sort: 'curated',
};

export const normalizeVietnamese = (value: string): string => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[đĐ]/g, 'd')
  .toLocaleLowerCase('vi')
  .replace(/[^a-z0-9\s-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const SYNONYM_GROUPS = [
  ['box', 'hop'],
  ['bouquet', 'bo'],
  ['cu nhan', 'tot nghiep'],
  ['lam tinh', 'hoa sao xanh', 'sao xanh'],
  ['tang le', 'chia buon'],
  ['khai truong', 'mung khai truong'],
];

const searchableText = (product: CatalogProduct): string => normalizeVietnamese([
  product.name,
  product.sku,
  labelFor('lines', product.line),
  labelFor('forms', product.form),
  ...product.occasions,
  ...product.flowers,
  ...product.colors,
  ...product.palettes,
  ...product.styles,
  ...product.collections,
  ...product.searchAliases,
].join(' '));

const containsWholeTerm = (value: string, term: string): boolean =>
  ` ${value} `.includes(` ${term} `);

const removeWholeTerm = (value: string, term: string): string =>
  normalizeVietnamese(` ${value} `.replaceAll(` ${term} `, ' '));

const matchesQuery = (product: CatalogProduct, rawQuery: string): boolean => {
  const query = normalizeVietnamese(rawQuery);
  if (!query) return true;
  const haystack = searchableText(product);
  if (haystack.includes(query)) return true;

  let remainingQuery = query;
  for (const group of SYNONYM_GROUPS) {
    const queryTerm = [...group]
      .sort((left, right) => right.length - left.length)
      .find((term) => containsWholeTerm(remainingQuery, term));
    if (!queryTerm) continue;
    if (!group.some((term) => containsWholeTerm(haystack, term))) return false;
    remainingQuery = removeWholeTerm(remainingQuery, queryTerm);
  }

  const haystackTokens = new Set(haystack.split(' '));
  return remainingQuery.split(' ').filter(Boolean).every((token) => haystackTokens.has(token));
};

const matchesAny = (selected: string[], values: string[]): boolean =>
  selected.length === 0 || selected.some((selection) => values.includes(selection));

const effectivePrice = (product: CatalogProduct): number | null =>
  product.price.mode === 'fixed' ? product.price.amount : null;

const statusRank = (product: CatalogProduct): number => product.status === 'tam-ngung' ? 1 : 0;

export const filterAndSortProducts = (products: CatalogProduct[], filters: CatalogFilters): CatalogProduct[] => {
  const filtered = products.filter((product) => {
    const price = effectivePrice(product);
    return matchesQuery(product, filters.query)
      && matchesAny(filters.occasions, product.occasions)
      && matchesAny(filters.lines, [product.line])
      && matchesAny(filters.forms, [product.form])
      && matchesAny(filters.flowers, product.flowers)
      && matchesAny(filters.colors, product.colors)
      && matchesAny(filters.palettes, product.palettes)
      && matchesAny(filters.styles, product.styles)
      && matchesAny(filters.collections, product.collections)
      && matchesAny(filters.statuses, [product.status])
      && (!filters.quoteOnly || product.price.mode === 'contact')
      && (filters.minPrice === null || (price !== null && price >= filters.minPrice))
      && (filters.maxPrice === null || (price !== null && price <= filters.maxPrice));
  });

  return filtered.sort((left, right) => {
    const paused = statusRank(left) - statusRank(right);
    if (paused !== 0) return paused;
    if (filters.sort === 'name') return left.name.localeCompare(right.name, 'vi');
    if (filters.sort === 'price-asc' || filters.sort === 'price-desc') {
      const leftPrice = effectivePrice(left) ?? Number.POSITIVE_INFINITY;
      const rightPrice = effectivePrice(right) ?? Number.POSITIVE_INFINITY;
      return filters.sort === 'price-asc' ? leftPrice - rightPrice : rightPrice - leftPrice;
    }
    return left.sortOrder - right.sortOrder;
  });
};

const CSV_GROUPS = ['occasions', 'lines', 'forms', 'flowers', 'colors', 'palettes', 'styles', 'collections', 'statuses'] as const;
const PARAM_NAMES: Record<(typeof CSV_GROUPS)[number], string> = {
  occasions: 'dip', lines: 'dong', forms: 'kieu', flowers: 'hoa', colors: 'mau',
  palettes: 'bang-mau', styles: 'phong-cach', collections: 'bo-suu-tap', statuses: 'trang-thai',
};

const allowed = {
  occasions: [...TAXONOMY.occasions],
  lines: TAXONOMY.lines.map(({ id }) => id),
  forms: TAXONOMY.forms.map(({ id }) => id),
  flowers: [...TAXONOMY.flowers],
  colors: [...TAXONOMY.colors],
  palettes: [...TAXONOMY.palettes],
  styles: [...TAXONOMY.styles],
  collections: [...TAXONOMY.collections],
  statuses: TAXONOMY.statuses.map(({ id }) => id),
};

const cleanNumber = (value: string | null): number | null => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

export const parseCatalogSearch = (search: string): CatalogFilters => {
  const params = new URLSearchParams(search);
  const next: CatalogFilters = { ...EMPTY_FILTERS };
  next.query = params.get('q')?.slice(0, 120) ?? '';
  for (const group of CSV_GROUPS) {
    next[group] = (params.get(PARAM_NAMES[group])?.split(',') ?? []).filter((value) => allowed[group].includes(value as never));
  }
  next.quoteOnly = params.get('bao-gia') === '1';
  next.minPrice = cleanNumber(params.get('min'));
  next.maxPrice = cleanNumber(params.get('max'));
  const sort = params.get('sap-xep') as CatalogSort | null;
  next.sort = sort && ['curated', 'price-asc', 'price-desc', 'name'].includes(sort) ? sort : 'curated';
  return next;
};

export const serializeCatalogFilters = (filters: CatalogFilters): string => {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set('q', filters.query.trim());
  for (const group of CSV_GROUPS) if (filters[group].length) params.set(PARAM_NAMES[group], filters[group].join(','));
  if (filters.quoteOnly) params.set('bao-gia', '1');
  if (filters.minPrice !== null) params.set('min', String(filters.minPrice));
  if (filters.maxPrice !== null) params.set('max', String(filters.maxPrice));
  if (filters.sort !== 'curated') params.set('sap-xep', filters.sort);
  return params.toString();
};

export const activeFilterCount = (filters: CatalogFilters): number =>
  Number(Boolean(filters.query.trim()))
  + CSV_GROUPS.reduce((total, group) => total + filters[group].length, 0)
  + Number(filters.quoteOnly)
  + Number(filters.minPrice !== null || filters.maxPrice !== null);

export const relatedProducts = (products: CatalogProduct[], current: CatalogProduct, limit = 4): CatalogProduct[] =>
  products
    .filter((product) => product.id !== current.id)
    .map((product) => ({
      product,
      score: Number(product.line === current.line) * 4
        + Number(product.form === current.form) * 3
        + product.occasions.filter((value) => current.occasions.includes(value)).length * 2
        + product.styles.filter((value) => current.styles.includes(value)).length,
    }))
    .sort((a, b) => b.score - a.score || a.product.sortOrder - b.product.sortOrder)
    .slice(0, limit)
    .map(({ product }) => product);
