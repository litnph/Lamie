# Hosting tĩnh và deep-link routing

## Build

```bash
npm ci
npm run build
```

Publish thư mục `dist/`. Không deploy từ source và không đưa `.env`, secret hoặc API key vào static bundle.

## Rewrite bắt buộc

Ứng dụng dùng History API. Host phải phục vụ file thật khi tồn tại và trả `index.html` cho route ứng dụng như `/mau-hoa` hoặc `/mau-hoa/mau-01`.

Ví dụ Nginx:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Ví dụ Netlify trong file `_redirects`:

```text
/* /index.html 200
```

Ví dụ Vercel trong `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Chỉ thêm file cấu hình của nhà cung cấp sau khi Lamie chọn host; repository hiện không tự giả định nền tảng deploy.

## Smoke test sau khi publish

Mở trực tiếp bằng cửa sổ mới, không chỉ điều hướng từ trang chủ:

- `/`
- `/mau-hoa`
- một `/mau-hoa/:slug` production hợp lệ
- một slug không tồn tại và một route bất kỳ để kiểm tra 404 nội bộ

Sau đó kiểm tra refresh, back/forward, URL filter, ảnh, font, dialog liên hệ, menu mobile và không có request 404/console error.

## SEO và social preview

`index.html` cung cấp metadata chung; title/description theo route được cập nhật bằng JavaScript. Crawler không chạy JavaScript hoặc trình tạo social preview có thể chỉ thấy metadata chung. Nếu cần OG/canonical riêng cho từng sản phẩm, chọn một trong các hướng sau trước khi phát hành:

- prerender HTML theo catalog tại build time;
- chuyển sang SSR/static site generation;
- dùng edge/server middleware tạo HTML metadata theo route.

Không khai báo per-product SEO là hoàn tất khi chưa có một trong các cơ chế trên. Domain production cũng cần được xác nhận trước khi tạo canonical, sitemap và robots.
