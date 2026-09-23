export type ProductLineId = 'hoa-tuoi' | 'hoa-sap-lua';
export type ProductFormId = 'bo-hoa' | 'ke-hoa' | 'ke-mini' | 'gio-hoa' | 'hop-hoa' | 'binh-hoa' | 'lang-hoa';
export type ProductStatus = 'dang-nhan-dat' | 'dat-truoc' | 'theo-mua' | 'tam-ngung';

export interface ProductImage {
  src: string;
  alt: string;
}

export type ProductPrice =
  | { mode: 'fixed'; amount: number; originalAmount?: number; isTest?: boolean }
  | { mode: 'contact' };

export interface CatalogProduct {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description?: string;
  line: ProductLineId;
  form: ProductFormId;
  occasions: string[];
  flowers: string[];
  colors: string[];
  palettes: string[];
  styles: string[];
  collections: string[];
  sizeLabel?: string;
  dimensions?: string;
  price: ProductPrice;
  status: ProductStatus;
  sortOrder: number;
  published: boolean;
  isDemo: boolean;
  featured: boolean;
  images: ProductImage[];
  searchAliases: string[];
  customizations: string[];
}

export interface CatalogFilters {
  query: string;
  occasions: string[];
  lines: string[];
  forms: string[];
  flowers: string[];
  colors: string[];
  palettes: string[];
  styles: string[];
  collections: string[];
  statuses: string[];
  quoteOnly: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  sort: CatalogSort;
}

export type CatalogSort = 'curated' | 'price-asc' | 'price-desc' | 'name';
