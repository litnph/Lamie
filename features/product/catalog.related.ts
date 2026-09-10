import type { FlowerProduct } from './product.type.ts';

export const effectiveProductPrice = (product: FlowerProduct): number =>
  product.salePrice ?? product.price;

export const getConfiguredSimilarProducts = (
  products: FlowerProduct[],
  currentProduct: FlowerProduct,
  limit = 4,
): FlowerProduct[] => {
  const byId = new Map(products.map((product) => [product.id, product]));
  return currentProduct.similarProductIds
    .filter((id) => id !== currentProduct.id)
    .map((id) => byId.get(id))
    .filter((product): product is FlowerProduct => Boolean(product))
    .slice(0, limit);
};

export const getSamePriceRangeProducts = (
  products: FlowerProduct[],
  currentProduct: FlowerProduct,
  deviationPercent: number,
  limit = 4,
): FlowerProduct[] => {
  const currentPrice = effectiveProductPrice(currentProduct);
  const deviation = deviationPercent / 100;
  const lowerBound = currentPrice * (1 - deviation);
  const upperBound = currentPrice * (1 + deviation);
  return products
    .filter((product) => product.id !== currentProduct.id)
    .filter((product) => {
      const price = effectiveProductPrice(product);
      return price >= lowerBound && price <= upperBound;
    })
    .sort((left, right) => Math.abs(effectiveProductPrice(left) - currentPrice)
      - Math.abs(effectiveProductPrice(right) - currentPrice))
    .slice(0, limit);
};
