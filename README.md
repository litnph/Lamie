# Lamie storefront

Website giới thiệu và catalog tĩnh của Lamie, xây bằng React 19, TypeScript và Vite. Website giúp khách khám phá mẫu hoa rồi liên hệ Lamie qua kênh thật; không có đăng nhập, giỏ hàng, thanh toán hoặc form gửi giả.

## Route

- `/`: trang chủ.
- `/mau-hoa`: catalog, tìm kiếm/lọc/sắp xếp và đồng bộ trạng thái lên URL.
- `/mau-hoa/:slug`: chi tiết mẫu hoa.
- Mọi URL khác: trang 404 nội bộ.

Router dùng History API. Hosting production phải rewrite deep link về `index.html`; xem [docs/STATIC_HOSTING.md](docs/STATIC_HOSTING.md).

## Chạy local

Yêu cầu Node.js 22 hoặc một bản Node.js còn được hỗ trợ.

```bash
npm install
npm run dev
```

Vite mặc định mở tại `http://localhost:3000`. Chế độ development hiển thị đúng 24 mẫu demo và luôn gắn nhãn cảnh báo. Dữ liệu demo không được đưa vào production build.

## Dữ liệu và cấu hình

- Schema, dữ liệu production và demo: `features/catalog/catalog.data.ts` và `features/catalog/catalog.types.ts`.
- Taxonomy dùng chung cho UI/filter: `features/catalog/catalog.taxonomy.ts`.
- Hotline, địa chỉ và kênh social: `app/site-config.ts`.
- Analytics: `app/analytics.ts`; adapter hiện cố ý không gửi dữ liệu cho tới khi có công cụ, consent policy và cấu hình production được duyệt.
- Ảnh sản phẩm demo từ nguồn cũ nằm trong `public/fe-data`. Bộ ảnh concept tự tạo cho hero/story/category/placeholder nằm trong `public/images/editorial` và tiếp tục có chú thích chờ Lamie duyệt.

`PRODUCTION_PRODUCTS` hiện rỗng vì chưa có catalog thật đã duyệt. Không sao chép `DEMO_PRODUCTS` sang production. Quy trình thêm dữ liệu nằm trong [docs/DATA_GUIDE.md](docs/DATA_GUIDE.md).

## Kiểm tra chất lượng

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

QA hình ảnh trên Windows có Microsoft Edge:

```bash
npm run dev -- --host 127.0.0.1 --port 3000
npm run qa:visual
```

Script chụp Home/Catalog/Detail tại 1440, 1024, 768, 390 và 360 px; đồng thời kiểm tra overflow, lỗi console/HTTP, số dòng hero và focus restoration của dialog.

## Build và bàn giao

```bash
npm run build
npm run preview
```

Output nằm trong `dist/`. Trước khi phát hành cần:

- thay dữ liệu/ảnh demo bằng nội dung production đã duyệt;
- xác nhận logo/font/ảnh hero, địa chỉ, giờ mở cửa và mọi kênh liên hệ;
- xác nhận domain, canonical, sitemap/robots và cấu hình rewrite của host;
- smoke test trực tiếp `/`, `/mau-hoa`, một `/mau-hoa/:slug` và URL 404;
- chọn analytics cùng consent policy nếu thực sự cần.

Vite SPA chỉ thay `document.title` và description ở client. Social preview/OG riêng cho từng sản phẩm cần prerender, SSR hoặc pipeline HTML khác; hiện chưa được giả định là đã hỗ trợ.

## Tài liệu

- Product truth: [PRODUCT.md](PRODUCT.md)
- Design system: [DESIGN.md](DESIGN.md)
- Trạng thái triển khai: [CODEX_PROGRESS.md](CODEX_PROGRESS.md)
- Hướng dẫn dữ liệu: [docs/DATA_GUIDE.md](docs/DATA_GUIDE.md)
- Nguồn và prompt ảnh concept: [docs/IMAGE_ASSETS.md](docs/IMAGE_ASSETS.md)
- Hướng dẫn hosting: [docs/STATIC_HOSTING.md](docs/STATIC_HOSTING.md)

Không đặt API key hoặc secret trong repository này.
