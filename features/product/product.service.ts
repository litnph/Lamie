import { loadProductCatalog } from './catalog.repository.ts';

export const ProductService = {
  getCatalog: loadProductCatalog,
};
