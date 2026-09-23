import type { CatalogProduct, ProductStatus } from '../features/catalog/catalog.types';

export const formatCurrency = (value: number): string => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
}).format(value);

export const formatProductPrice = (product: CatalogProduct): string =>
  product.price.mode === 'fixed' ? formatCurrency(product.price.amount) : 'Liên hệ báo giá';

export const statusLabel = (status: ProductStatus): string => ({
  'dang-nhan-dat': 'Đang nhận đặt',
  'dat-truoc': 'Đặt trước',
  'theo-mua': 'Theo mùa',
  'tam-ngung': 'Tạm ngưng',
})[status];
