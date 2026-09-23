# Hướng dẫn dữ liệu catalog Lamie

## Ranh giới production và demo

Nguồn catalog đang nằm trong `features/catalog/catalog.data.ts`:

- `PRODUCTION_PRODUCTS`: dữ liệu thật đã được Lamie duyệt; hiện để rỗng.
- `DEMO_PRODUCTS`: đúng 24 mẫu phục vụ thiết kế và kiểm thử; mọi item có `isDemo: true`.
- `getCatalogProducts(import.meta.env.DEV)`: chỉ ghép demo ở development. Production build chỉ nhận `PRODUCTION_PRODUCTS`.

Không đổi `isDemo` thành `false`, bỏ nhãn hoặc sao chép giá demo để biến dữ liệu thử thành dữ liệu thật.

## Schema sản phẩm

Mỗi item tuân theo `CatalogProduct` trong `features/catalog/catalog.types.ts`:

| Trường | Yêu cầu |
| --- | --- |
| `id`, `sku`, `slug`, `name` | Bắt buộc; `id` và `slug` duy nhất. `slug` chỉ dùng chữ thường ASCII, số và dấu gạch ngang. |
| `description` | Chỉ điền nội dung đã duyệt; có thể bỏ trống. |
| `line`, `form`, `status` | Dùng ID đã khai báo trong type/taxonomy. |
| `occasions`, `flowers`, `colors`, `palettes`, `styles`, `collections` | Mảng ID taxonomy; dùng mảng rỗng nếu chưa có dữ liệu, không tự suy đoán. |
| `price` | `{ mode: 'contact' }` hoặc `{ mode: 'fixed', amount }`. Giá production đã duyệt không dùng `isTest: true`. |
| `sortOrder`, `published`, `featured` | Quyết định thứ tự và khả năng hiển thị. |
| `isDemo` | Luôn `false` cho dữ liệu production đã duyệt. |
| `images` | Ít nhất một item `{ src, alt }`; alt phải mô tả ảnh, không nhồi từ khóa. |
| `searchAliases`, `customizations` | Chỉ thêm từ khóa/tùy chọn đã xác nhận. |
| `sizeLabel`, `dimensions` | Có thể bỏ trống nếu Lamie chưa cung cấp. |

`validateProducts()` chặn thiếu khóa chính, slug sai, trùng ID/slug, thiếu ảnh và giá cố định không hợp lệ. Validation không thay thế bước duyệt nội dung kinh doanh.

## Thêm một sản phẩm production

1. Chép ảnh đã duyệt vào thư mục con ổn định trong `public/`; dùng đường dẫn bắt đầu bằng `/`.
2. Kiểm tra taxonomy trong `features/catalog/catalog.taxonomy.ts`. Chỉ thêm lựa chọn mới khi Lamie xác nhận và cập nhật đồng thời type nếu đó là `line`, `form` hoặc `status`.
3. Thêm item vào `PRODUCTION_PRODUCTS` với `published: true`, `isDemo: false` và nội dung đã duyệt.
4. Chọn `price.mode: 'contact'` nếu chưa có giá công bố. Không tự tạo giá, giá cũ, giá gạch hoặc chính sách giao hàng.
5. Chạy toàn bộ kiểm tra:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

6. Chạy preview production và xác nhận sản phẩm xuất hiện đúng; demo không xuất hiện.

## Quy tắc tìm kiếm và lọc

- Search bỏ dấu tiếng Việt, chuẩn hóa `đ/d` và tìm trong tên, mã, taxonomy cùng alias.
- Các lựa chọn trong cùng một nhóm là OR; giữa các nhóm là AND.
- Khoảng giá chỉ áp dụng cho mẫu có giá số; mẫu `contact` không bị ép vào một khoảng giá giả.
- Filter/sort được serialize lên URL để có thể chia sẻ và dùng back/forward.

Khi đổi ID taxonomy hoặc slug sản phẩm, phải cân nhắc URL đã được chia sẻ trước đó.

## Checklist nội dung trước production

- Catalog thật và ảnh thật đã duyệt.
- Logo/font/hero/process assets chính thức.
- Mô tả thương hiệu và mô tả từng sản phẩm.
- Địa chỉ/map, giờ mở cửa và kênh liên hệ.
- Giá hoặc trạng thái “liên hệ báo giá”.
- Lead time, phạm vi/phí giao, thanh toán/hủy nếu Lamie muốn công bố.
- Domain, canonical, sitemap/robots và social preview.

Thiếu mục nào thì giữ trạng thái TBD hoặc copy trung tính; không lấp chỗ trống bằng dữ liệu giả.
