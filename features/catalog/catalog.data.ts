import type { CatalogProduct, ProductFormId, ProductLineId, ProductStatus } from './catalog.types';

const SOURCE_IMAGES = [
  '/fe-data/images/products/1002-1002-387637fc170c.jpg',
  '/fe-data/images/products/1002-1003-26f98bc0c5e3.jpg',
  '/fe-data/images/products/1002-1004-0ecfa76d092c.jpg',
  '/fe-data/images/products/1002-1005-0ae9f3a1fcc3.jpg',
  '/fe-data/images/products/1003-1006-870e7a29a121.jpg',
  '/fe-data/images/products/1003-1007-a7671fdce815.jpg',
  '/fe-data/images/products/2001-2001-3a852524cac8.jpg',
  '/fe-data/images/products/2002-2002-8b19395d6a81.jpg',
  '/fe-data/images/products/2002-2003-f9f436e4d65f.jpg',
  '/fe-data/images/products/2002-2004-515edc5d95ff.jpg',
  '/fe-data/images/products/2003-2006-0ab4ea1caa1f.jpg',
  '/fe-data/images/products/2004-2007-9a270c8e07b1.jpg',
  '/fe-data/images/products/3003-3006-adc190c462ba.jpg',
  '/fe-data/images/products/3004-3008-b1103ea6e526.jpg',
] as const;

interface DemoSeed {
  name: string;
  line: ProductLineId;
  form: ProductFormId;
  occasions: string[];
  flowers: string[];
  colors: string[];
  palettes: string[];
  styles: string[];
  collection: string;
  price: number | null;
  status: ProductStatus;
}

const DEMO_SEEDS: DemoSeed[] = [
  { name: 'Dịu hồng', line: 'hoa-tuoi', form: 'gio-hoa', occasions: ['Sinh nhật', 'Chúc mừng'], flowers: ['Hoa hồng'], colors: ['Hồng'], palettes: ['Pastel'], styles: ['Tự nhiên'], collection: 'Mùa dịu dàng', price: 550000, status: 'dang-nhan-dat' },
  { name: 'Nắng trên hiên', line: 'hoa-tuoi', form: 'bo-hoa', occasions: ['Tốt nghiệp', 'Sinh nhật'], flowers: ['Hướng dương'], colors: ['Vàng'], palettes: ['Phối nhiều màu'], styles: ['Garden'], collection: 'Sắc nắng', price: 420000, status: 'dat-truoc' },
  { name: 'Sương lam', line: 'hoa-tuoi', form: 'bo-hoa', occasions: ['Kỷ niệm', 'Tình yêu'], flowers: ['Hoa lam tinh'], colors: ['Xanh dương', 'Trắng/Kem'], palettes: ['Pastel'], styles: ['Tối giản'], collection: 'Khoảnh khắc xanh', price: 380000, status: 'theo-mua' },
  { name: 'Vườn hồng nhỏ', line: 'hoa-tuoi', form: 'hop-hoa', occasions: ['Sinh nhật', 'Kỷ niệm'], flowers: ['Hoa hồng'], colors: ['Đỏ'], palettes: ['Phối nhiều màu'], styles: ['Garden'], collection: 'Mùa dịu dàng', price: 640000, status: 'dang-nhan-dat' },
  { name: 'Lời chúc mới', line: 'hoa-tuoi', form: 'ke-mini', occasions: ['Khai trương', 'Chúc mừng'], flowers: ['Hoa hồng', 'Hoa lan'], colors: ['Hồng', 'Trắng/Kem'], palettes: ['Pastel'], styles: ['Sang trọng'], collection: 'Mùa dịu dàng', price: null, status: 'dat-truoc' },
  { name: 'Mây kem', line: 'hoa-sap-lua', form: 'bo-hoa', occasions: ['Sinh nhật', 'Tốt nghiệp'], flowers: ['Hoa hồng', 'Hoa baby'], colors: ['Trắng/Kem'], palettes: ['Pastel'], styles: ['Hàn Quốc'], collection: 'Mùa dịu dàng', price: 490000, status: 'dang-nhan-dat' },
  { name: 'Chạm tím', line: 'hoa-tuoi', form: 'binh-hoa', occasions: ['Thăm hỏi', 'Kỷ niệm'], flowers: ['Cẩm tú cầu'], colors: ['Tím'], palettes: ['Pastel'], styles: ['Tự nhiên'], collection: 'Khoảnh khắc xanh', price: null, status: 'theo-mua' },
  { name: 'Hỷ sắc', line: 'hoa-tuoi', form: 'lang-hoa', occasions: ['Cưới', 'Chúc mừng'], flowers: ['Hoa hồng', 'Hoa lan'], colors: ['Đỏ', 'Hồng'], palettes: ['Phối nhiều màu'], styles: ['Sang trọng'], collection: 'Sắc nắng', price: 980000, status: 'dat-truoc' },
  { name: 'Mở lối', line: 'hoa-tuoi', form: 'ke-hoa', occasions: ['Khai trương'], flowers: ['Hoa lan', 'Hướng dương'], colors: ['Vàng', 'Cam'], palettes: ['Phối nhiều màu'], styles: ['Sang trọng'], collection: 'Sắc nắng', price: null, status: 'dat-truoc' },
  { name: 'Thư tình', line: 'hoa-sap-lua', form: 'hop-hoa', occasions: ['Tình yêu', 'Cầu hôn'], flowers: ['Hoa hồng'], colors: ['Đỏ'], palettes: [], styles: ['Tối giản'], collection: 'Mùa dịu dàng', price: 720000, status: 'dang-nhan-dat' },
  { name: 'Bình yên', line: 'hoa-tuoi', form: 'bo-hoa', occasions: ['Thăm hỏi'], flowers: ['Cẩm tú cầu', 'Hoa baby'], colors: ['Xanh lá', 'Trắng/Kem'], palettes: ['Pastel'], styles: ['Tự nhiên'], collection: 'Khoảnh khắc xanh', price: 460000, status: 'dang-nhan-dat' },
  { name: 'Ngày rực rỡ', line: 'hoa-tuoi', form: 'gio-hoa', occasions: ['Tốt nghiệp', 'Chúc mừng'], flowers: ['Hướng dương', 'Hoa hồng'], colors: ['Vàng', 'Cam'], palettes: ['Phối nhiều màu'], styles: ['Garden'], collection: 'Sắc nắng', price: 680000, status: 'dang-nhan-dat' },
  { name: 'Ánh ban mai', line: 'hoa-tuoi', form: 'binh-hoa', occasions: ['Sinh nhật', 'Thăm hỏi'], flowers: ['Tulip'], colors: ['Hồng', 'Trắng/Kem'], palettes: ['Pastel'], styles: ['Tối giản'], collection: 'Mùa dịu dàng', price: 590000, status: 'theo-mua' },
  { name: 'Nơ lụa', line: 'hoa-sap-lua', form: 'bo-hoa', occasions: ['Tốt nghiệp', 'Kỷ niệm'], flowers: ['Hoa hồng'], colors: ['Hồng'], palettes: ['Pastel'], styles: ['Hàn Quốc'], collection: 'Mùa dịu dàng', price: 520000, status: 'dang-nhan-dat' },
  { name: 'Mầm xanh', line: 'hoa-tuoi', form: 'ke-mini', occasions: ['Khai trương', 'Chúc mừng'], flowers: ['Hoa lan'], colors: ['Xanh lá', 'Trắng/Kem'], palettes: ['Pastel'], styles: ['Tối giản'], collection: 'Khoảnh khắc xanh', price: null, status: 'dat-truoc' },
  { name: 'Hồng trà', line: 'hoa-tuoi', form: 'bo-hoa', occasions: ['Sinh nhật', 'Tình yêu'], flowers: ['Hoa hồng'], colors: ['Hồng', 'Cam'], palettes: ['Phối nhiều màu'], styles: ['Vintage'], collection: 'Mùa dịu dàng', price: 430000, status: 'dang-nhan-dat' },
  { name: 'Lời thương', line: 'hoa-tuoi', form: 'gio-hoa', occasions: ['Tình yêu', 'Kỷ niệm'], flowers: ['Hoa hồng', 'Hoa baby'], colors: ['Đỏ', 'Trắng/Kem'], palettes: ['Phối nhiều màu'], styles: ['Garden'], collection: 'Mùa dịu dàng', price: 760000, status: 'dang-nhan-dat' },
  { name: 'Khởi sắc', line: 'hoa-tuoi', form: 'ke-hoa', occasions: ['Khai trương'], flowers: ['Hoa lan', 'Hoa hồng'], colors: ['Đỏ', 'Vàng'], palettes: ['Phối nhiều màu'], styles: ['Sang trọng'], collection: 'Sắc nắng', price: 1200000, status: 'dat-truoc' },
  { name: 'Sao xanh', line: 'hoa-tuoi', form: 'bo-hoa', occasions: ['Tốt nghiệp', 'Sinh nhật'], flowers: ['Hoa lam tinh'], colors: ['Xanh dương', 'Trắng/Kem'], palettes: ['Pastel'], styles: ['Hàn Quốc'], collection: 'Khoảnh khắc xanh', price: 390000, status: 'theo-mua' },
  { name: 'Nhịp cưới', line: 'hoa-sap-lua', form: 'lang-hoa', occasions: ['Cưới', 'Chúc mừng'], flowers: ['Hoa hồng'], colors: ['Trắng/Kem', 'Hồng'], palettes: ['Pastel'], styles: ['Sang trọng'], collection: 'Mùa dịu dàng', price: null, status: 'dat-truoc' },
  { name: 'Tím chiều', line: 'hoa-tuoi', form: 'hop-hoa', occasions: ['Cầu hôn', 'Kỷ niệm'], flowers: ['Cẩm tú cầu', 'Hoa hồng'], colors: ['Tím', 'Hồng'], palettes: ['Pastel'], styles: ['Garden'], collection: 'Khoảnh khắc xanh', price: 820000, status: 'tam-ngung' },
  { name: 'Nắng mới', line: 'hoa-sap-lua', form: 'gio-hoa', occasions: ['Sinh nhật', 'Chúc mừng'], flowers: ['Hướng dương'], colors: ['Vàng'], palettes: ['Phối nhiều màu'], styles: ['Tự nhiên'], collection: 'Sắc nắng', price: 610000, status: 'dang-nhan-dat' },
  { name: 'Nụ cười', line: 'hoa-tuoi', form: 'bo-hoa', occasions: ['Sinh nhật', 'Thăm hỏi'], flowers: ['Tulip', 'Hoa baby'], colors: ['Hồng', 'Trắng/Kem'], palettes: ['Pastel'], styles: ['Hàn Quốc'], collection: 'Mùa dịu dàng', price: null, status: 'theo-mua' },
  { name: 'Khép mùa', line: 'hoa-tuoi', form: 'binh-hoa', occasions: ['Kỷ niệm'], flowers: ['Mẫu đơn'], colors: ['Hồng', 'Trắng/Kem'], palettes: ['Pastel'], styles: ['Vintage'], collection: 'Mùa dịu dàng', price: 890000, status: 'tam-ngung' },
];

export const DEMO_PRODUCTS: CatalogProduct[] = DEMO_SEEDS.map((seed, index) => ({
  id: `demo-${String(index + 1).padStart(2, '0')}`,
  sku: `DEMO-${String(index + 1).padStart(3, '0')}`,
  slug: `mau-demo-${String(index + 1).padStart(2, '0')}`,
  name: seed.name,
  description: 'Mô tả này chỉ dùng để kiểm thử bố cục. Lamie sẽ bổ sung mô tả thật trước khi công bố.',
  line: seed.line,
  form: seed.form,
  occasions: seed.occasions,
  flowers: seed.flowers,
  colors: seed.colors,
  palettes: seed.palettes,
  styles: seed.styles,
  collections: [seed.collection],
  sizeLabel: index % 3 === 0 ? 'Kích thước cần xác nhận' : undefined,
  price: seed.price === null ? { mode: 'contact' } : { mode: 'fixed', amount: seed.price, isTest: true },
  status: seed.status,
  sortOrder: index + 1,
  published: true,
  isDemo: true,
  featured: index < 6,
  images: [{
    src: SOURCE_IMAGES[index % SOURCE_IMAGES.length],
    alt: `Ảnh nguồn Lamie dùng cho bố cục demo ${seed.name}`,
  }],
  searchAliases: seed.flowers.includes('Hoa lam tinh') ? ['hoa sao xanh', 'sao xanh', 'lam tinh'] : [],
  customizations: index % 2 === 0 ? ['Màu sắc', 'Nội dung thiệp'] : ['Nội dung thiệp'],
}));

export const PRODUCTION_PRODUCTS: CatalogProduct[] = [];

const PRODUCT_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const validateProducts = (products: CatalogProduct[]): CatalogProduct[] => {
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const [index, product] of products.entries()) {
    if (!product.id || !product.sku || !product.name) throw new Error(`products[${index}] thiếu id, sku hoặc name`);
    if (!PRODUCT_SLUG.test(product.slug)) throw new Error(`products[${index}].slug không hợp lệ`);
    if (ids.has(product.id) || slugs.has(product.slug)) throw new Error(`products[${index}] bị trùng id hoặc slug`);
    if (!product.images.length) throw new Error(`products[${index}] cần ít nhất một ảnh hoặc placeholder`);
    if (product.price.mode === 'fixed' && (!Number.isFinite(product.price.amount) || product.price.amount < 0)) {
      throw new Error(`products[${index}].price không hợp lệ`);
    }
    ids.add(product.id);
    slugs.add(product.slug);
  }
  return products;
};

export const getCatalogProducts = (includeDemo: boolean): CatalogProduct[] => validateProducts([
  ...PRODUCTION_PRODUCTS,
  ...(includeDemo ? DEMO_PRODUCTS : []),
]).filter((product) => product.published && (includeDemo || !product.isDemo));
