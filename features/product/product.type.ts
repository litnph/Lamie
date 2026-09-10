export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
}

export interface ProductLine {
  id: string;
  name: string;
}

export interface ProductAttributes {
  tags: string[];
  colors: string[];
  collections: string[];
  occasions: string[];
  styles: string[];
}

export interface FlowerProduct {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  category: ProductCategory;
  productLine: ProductLine | null;
  images: ProductImage[];
  attributes: ProductAttributes;
  similarProductIds: string[];
}

export interface CatalogMetadata {
  schemaVersion: '1.0' | '1.1';
  generatedAt: string;
  version: string;
  productCount: number;
  imageCount: number;
  priceDeviationPercent: number;
}

export interface CatalogErrorCopy {
  title: string;
  message: string;
}

export type CatalogState =
  | { status: 'loading'; products: FlowerProduct[]; metadata: null }
  | { status: 'ready'; products: FlowerProduct[]; metadata: CatalogMetadata }
  | { status: 'empty'; products: FlowerProduct[]; metadata: CatalogMetadata }
  | { status: 'error'; products: FlowerProduct[]; metadata: null; error: CatalogErrorCopy };
