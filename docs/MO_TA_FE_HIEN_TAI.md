# Tài liệu mô tả Frontend Lamie hiện tại

> Phạm vi: thư mục `FE_Lamie`  
> Thời điểm rà soát: 19/09/2026  
> Loại tài liệu: mô tả hiện trạng (as-is), dựa trên source code và dữ liệu đang có trong workspace

## 1. Tổng quan

`FE_Lamie` là website bán hoa hướng tới khách hàng của Lamie. Ứng dụng được xây dựng dưới dạng Single Page Application (SPA) bằng React, TypeScript và Vite.

Frontend hiện tập trung vào các nhóm trải nghiệm chính:

- Giới thiệu thương hiệu Lamie trên trang chủ.
- Hiển thị danh mục hoa từ bản export dữ liệu tĩnh.
- Tìm kiếm, lọc và xem chi tiết sản phẩm.
- Mô phỏng đăng nhập và khu vực thành viên.
- Mô phỏng khung chat hỗ trợ.

Điều hướng hiện không dùng React Router và không tạo URL riêng cho từng màn hình. Toàn bộ việc chuyển trang được quản lý bằng state `view` trong `App.tsx`. Vì vậy, khi tải lại trình duyệt, ứng dụng luôn quay về trang chủ; người dùng cũng chưa thể sao chép đường dẫn trực tiếp đến một sản phẩm hoặc một màn hình cụ thể.

## 2. Nền tảng kỹ thuật

| Hạng mục | Hiện trạng |
| --- | --- |
| UI framework | React 19 |
| Ngôn ngữ | TypeScript 5.8 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS được nạp từ CDN trong `index.html`, kết hợp CSS custom properties |
| Font | Playfair Display, Cormorant Garamond, Zen Old Mincho từ Google Fonts |
| Router | Chưa sử dụng; điều hướng bằng React state |
| Quản lý state | React hooks cục bộ (`useState`, `useMemo`, `useEffect`, `useCallback`) |
| Dữ liệu sản phẩm | Static export cùng origin tại `/fe-data` |
| Xác thực | Mô phỏng bằng `localStorage` |
| Kiểm thử | Node test runner; hiện có 24 test pass |
| Cổng dev mặc định | `3000`, lắng nghe trên `0.0.0.0` |

Ứng dụng lazy-load năm màn hình chính: Home, Shop, Product Detail, Login và Member. Trong lúc tải chunk, giao diện hiển thị trạng thái “Lamie is preparing flowers...”.

## 3. Sơ đồ điều hướng hiện tại

```text
App
├── Home
│   ├── Shop
│   └── Product Detail
├── Shop
│   └── Product Detail
├── Login
│   └── Member
└── Member
    └── Logout → Home
```

Các view đang được khai báo chính thức:

| View | Cách truy cập | Ghi chú |
| --- | --- | --- |
| `home` | Logo hoặc menu Home | View mặc định |
| `shop` | Menu Shop, biểu tượng túi hoặc CTA trên Home | Danh sách sản phẩm |
| `product` | Chọn một Product Card | Phụ thuộc `selectedProductId` trong memory |
| `login` | Nút Sign in hoặc menu tài khoản trên mobile | Dùng layout tối giản, không có header/footer/chat |
| `member` | Đăng nhập mô phỏng hoặc mở My account | Có kiểm tra token ở `localStorage` |

File `pages/admin.page.tsx` có tồn tại nhưng không được import vào `App.tsx`, không nằm trong `ViewState` hiện hành và không có luồng điều hướng đến trang này. Đây là code chưa được kết nối vào storefront hiện tại.

## 4. Khung giao diện dùng chung

### 4.1 Header

Header cố định ở đầu trang, nền sáng bán trong suốt và có hiệu ứng blur. Thành phần gồm:

- Logo Lamie, bấm để về Home.
- Menu desktop gồm Home và Shop.
- Biểu tượng túi hàng, hiện badge cố định là `2`; bấm vào sẽ mở Shop chứ chưa mở giỏ hàng.
- Nút Sign in/My account tùy trạng thái đăng nhập.
- Nút hamburger trên mobile.

Menu mobile mở dạng drawer từ bên phải, có overlay, khóa scroll nền, hỗ trợ đóng bằng phím Escape và giữ focus trong dialog.

### 4.2 Footer

Footer hiển thị:

- Mô tả ngắn về thương hiệu.
- Hotline `0906 445 004`.
- Instagram/TikTok `@tiemhoalamie`.
- Phạm vi giao hàng TP.HCM.
- Địa chỉ MT Eastmark City, phường Long Trường, TP. Thủ Đức.
- Giờ mở cửa 08:00–21:00 hằng ngày.
- Các mục About Us, Collections, Workshop, Blog và mạng xã hội.

Các mục trong footer hiện là nội dung hiển thị, chưa được nối đến trang hoặc URL tương ứng.

### 4.3 Chat hỗ trợ

ChatBox là nút nổi ở góc dưới bên phải trên tất cả màn hình trừ Login.

- Khi mở, hệ thống hiển thị lời chào mặc định.
- Người dùng có thể nhập và gửi tin nhắn.
- Sau khoảng 800 ms, bot phản hồi bằng mẫu xác nhận đã nhận nội dung.
- Chưa có WebSocket, API chat, lưu lịch sử hoặc nhân viên hỗ trợ thật.

## 5. Mô tả từng màn hình

### 5.1 Trang chủ

Trang chủ là landing page một trang dài, gồm sáu khối nội dung theo thứ tự:

1. **Hero**
   - Tên thương hiệu và định vị phong cách tối giản, hiện đại, vintage.
   - CTA “Xem cửa hàng/Shop now” chuyển sang Shop.
   - CTA “Về Lamie/About Lamie” hiện chưa gắn hành động cuộn hoặc điều hướng.
   - Ảnh hero đang lấy từ Picsum.

2. **Câu chuyện Lamie**
   - Giới thiệu hoa như một ngôn ngữ của sự quan tâm.
   - Ảnh minh họa lấy từ một URL bên ngoài (`public.readdy.ai`).

3. **Bộ sưu tập**
   - Hiển thị bốn sản phẩm đầu tiên của catalog.
   - Có skeleton khi tải, panel lỗi, trạng thái catalog rỗng và nút thử lại.
   - “Xem tất cả” chuyển sang Shop; chọn sản phẩm chuyển sang Product Detail.

4. **Thư viện**
   - Bố cục ảnh dạng marquee chạy ngang liên tục.
   - Ảnh hiện lấy từ Picsum, chưa lấy từ dữ liệu quản trị của Lamie.

5. **Lý do lựa chọn Lamie**
   - Hoa tươi mới mỗi ngày.
   - Phong cách tối giản hiện đại.
   - Giao hoa nhanh toàn TP.HCM.

6. **Liên hệ**
   - Form gồm họ tên, số điện thoại và lời nhắn.
   - Submit hiện chỉ chặn hành vi reload mặc định; chưa gửi hoặc lưu dữ liệu.

Trang chủ có bộ chuyển ngôn ngữ Việt/Anh và thanh điều hướng nhanh theo section ở cạnh phải trên desktop. `IntersectionObserver` được dùng để đánh dấu section đang hiển thị. Việc đổi ngôn ngữ chỉ áp dụng cho nội dung trang chủ; Header, Footer, Shop, Product Detail, Login và Member vẫn chủ yếu bằng tiếng Anh.

### 5.2 Trang cửa hàng

Shop hiển thị toàn bộ catalog cùng hệ thống lọc.

Các tiêu chí đang hỗ trợ:

- Tìm kiếm theo tên, bộ sưu tập, dịp và tag; tìm kiếm không phân biệt dấu tiếng Việt.
- Loại hoa, thực chất lấy từ `product.category`.
- Dịp sử dụng.
- Dòng sản phẩm.
- Màu sắc.
- Bộ sưu tập.
- Tag.
- Khoảng giá tối thiểu/tối đa.

Trong cùng một nhóm lọc, sản phẩm chỉ cần khớp một giá trị; giữa các nhóm, sản phẩm phải đồng thời thỏa tất cả nhóm đang chọn. Giá lọc dùng `salePrice` nếu có, nếu không dùng `price`.

Giao diện desktop đặt filter dạng sidebar sticky. Trên mobile, filter mở thành bottom sheet có overlay, khóa scroll, đóng bằng Escape và giữ focus. Các bộ lọc đang áp dụng được hiển thị thành chip có thể xóa riêng, kèm thao tác “Clear all”.

Shop có đầy đủ bốn trạng thái catalog: loading, error, empty và ready. Khi không có sản phẩm khớp filter, trang hiển thị empty state riêng và nút reset filter.

### 5.3 Trang chi tiết sản phẩm

Trang chi tiết lấy sản phẩm theo `productId` đang giữ trong state của App.

Nội dung chính gồm:

- Nút quay lại Shop.
- Gallery ảnh kiểu xếp lớp.
- Chọn ảnh bằng nút chỉ báo.
- Mở lightbox khi bấm ảnh chính.
- Lightbox hỗ trợ Escape, phím mũi tên trái/phải, nút chuyển ảnh và focus trap.
- Danh mục, dòng sản phẩm, tên, giá bán, giá gốc gạch ngang nếu có khuyến mãi.
- Mô tả sản phẩm; có copy dự phòng khi mô tả rỗng.
- Bộ tăng/giảm số lượng, giá trị nhỏ nhất là 1.
- Nút Add to cart.
- Ghi chú hoa tươi và giao trong ngày tùy xác nhận.
- Tối đa bốn sản phẩm tương tự được cấu hình trong catalog.
- Tối đa bốn sản phẩm gần giá, theo tỷ lệ chênh lệch từ cấu hình catalog.

Nút Add to cart và số lượng hiện chỉ có UI, chưa tạo giỏ hàng. Nếu sản phẩm không còn tồn tại trong catalog, trang hiển thị trạng thái “không còn khả dụng” và cho quay lại Shop.

### 5.4 Trang đăng nhập

Login dùng layout riêng, không hiển thị Header, Footer và ChatBox.

- Form gồm email và mật khẩu.
- Bất kỳ email và mật khẩu không rỗng nào cũng được chấp nhận.
- Khi submit, frontend ghi `lamie_token` bằng timestamp vào `localStorage` rồi mở Member.
- “Forgot?” và “Register” chưa có chức năng.
- “Return to Shop” thực tế đưa người dùng về Home.

Đây là xác thực mô phỏng ở client, không phải cơ chế đăng nhập an toàn và chưa gọi backend.

### 5.5 Khu vực thành viên

Member hiện là dashboard mô phỏng với dữ liệu hard-code:

- Avatar từ `i.pravatar.cc`.
- Tên thành viên “Sophie Lenoir”, thành viên từ năm 2023.
- Chỉ số tổng đơn hàng, wishlist và điểm thưởng.
- Hai đơn hàng mẫu với trạng thái Delivered/Processing.
- Dạng card trên màn hình nhỏ và dạng bảng trên desktop lớn.
- Có sẵn UI cho loading, error và danh sách đơn rỗng.

Sidebar có Dashboard, My Orders, Addresses, Wishlist và Account Details, nhưng các nút này chưa chuyển nội dung. Nút View order cũng chưa có hành động. Logout xóa `lamie_token`, cập nhật trạng thái đăng nhập và về Home.

### 5.6 Trang Admin chưa hoạt động trong luồng hiện tại

`pages/admin.page.tsx` có giao diện bảng inventory đơn giản: ảnh, tên, danh mục, giá, nút Edit và Logout. Tuy nhiên:

- Không có route/view để truy cập.
- Nút Edit chưa có handler.
- Không có form thêm/sửa/xóa sản phẩm.
- Không phải trang quản trị đang hoạt động của storefront.

## 6. Dữ liệu catalog

### 6.1 Cơ chế tải dữ liệu

Trình duyệt không gọi trực tiếp `API_Lamie` để lấy sản phẩm. Dữ liệu được đọc từ static export cùng domain:

```text
public/fe-data/
├── manifest.json
├── products.json
└── images/products/
```

Luồng tải:

1. Tải `fe-data/manifest.json` với `cache: no-store`.
2. Kiểm tra schema và đường dẫn trong manifest.
3. Tải file catalog được manifest chỉ định, kèm query version.
4. Tính SHA-256 của catalog và so sánh với checksum trong manifest.
5. Parse và kiểm tra schema của `products.json`.
6. Đối chiếu schema version, thời gian tạo, số sản phẩm và số ảnh giữa hai file.
7. Resolve URL ảnh bên trong thư mục `fe-data`, thêm version để cache-busting.
8. Chỉ sau khi toàn bộ dữ liệu hợp lệ mới cập nhật UI.

Repository từ chối đường dẫn tuyệt đối, path traversal và dữ liệu không đúng contract. Nếu ảnh sản phẩm không tải được hoặc sản phẩm không có ảnh, component chuyển sang `/images/product-fallback.svg`.

### 6.2 Snapshot dữ liệu đang có

Theo `public/fe-data/manifest.json` tại thời điểm rà soát:

| Thuộc tính | Giá trị |
| --- | --- |
| Schema | `1.1` |
| Thời điểm export | `2026-09-05T05:30:06.513825+00:00` |
| Số sản phẩm | 16 |
| Số ảnh | 23 |
| Ngưỡng gợi ý gần giá | ±20% |
| Danh mục | Giỏ hoa, Hoa bó, Kệ hoa mini |
| Dòng sản phẩm | Hoa tươi, Hoa sáp |
| Khoảng giá hiệu lực | 1 ₫ – 1.000.000 ₫ |

Dữ liệu export hiện còn bản ghi phục vụ kiểm thử hoặc dữ liệu chưa hoàn thiện, ví dụ tên bắt đầu bằng `TEST-BATCH`, sản phẩm tên `A`, một số sản phẩm giá `1 ₫`, và một sản phẩm không có ảnh. Frontend vẫn hiển thị các bản ghi này vì chúng hợp lệ theo schema.

## 7. Design system và trải nghiệm hiển thị

Phong cách tổng thể là editorial/vintage nhẹ, sử dụng nền giấy kem, tông mocha, xanh thân lá và điểm nhấn rose.

Design tokens được định nghĩa trực tiếp trong `index.html`, gồm:

- Màu nền, bề mặt, chữ, border, action, trạng thái success/warning/danger.
- Font display và body.
- Hệ thống cỡ chữ bằng `clamp()`.
- Spacing, radius, shadow, container width.
- Duration và easing cho animation.

Các primitive đang được dùng gồm Button, Card, PageContainer, SectionWrapper, TextField, TextAreaField và FadeIn. Layout responsive chủ yếu theo các breakpoint Tailwind; lưới sản phẩm thay đổi từ một cột lên hai, ba hoặc bốn cột tùy màn hình.

Ứng dụng có một số hỗ trợ accessibility đáng chú ý:

- Skip link đến nội dung chính.
- Landmark `header`, `nav`, `main`, `footer`.
- `aria-label`, `aria-current`, `aria-live`, trạng thái loading và error.
- Focus trap và trả focus cho menu/filter/lightbox.
- Kích thước vùng bấm phổ biến tối thiểu khoảng 44 px.
- Tôn trọng `prefers-reduced-motion`.
- Product image có alt và fallback.

## 8. Phân loại mức độ hoàn thiện chức năng

| Chức năng | Trạng thái | Ghi chú |
| --- | --- | --- |
| Hiển thị trang chủ | Hoạt động | Nội dung song ngữ trong phạm vi Home |
| Tải catalog static | Hoạt động | Có checksum và validation |
| Danh sách sản phẩm | Hoạt động | Có loading/error/empty state |
| Tìm kiếm và lọc | Hoạt động | Xử lý hoàn toàn ở client |
| Chi tiết sản phẩm | Hoạt động | Gallery, lightbox, related products |
| Điều hướng trực tiếp bằng URL | Chưa có | Điều hướng bằng state |
| Giỏ hàng | Chưa có | Badge `2` là cố định; Add to cart chưa xử lý |
| Checkout/thanh toán | Chưa có | Không có màn hình hoặc tích hợp |
| Form liên hệ | Chưa kết nối | Không gửi dữ liệu |
| Chat | Mô phỏng | Phản hồi tự động ở client |
| Đăng nhập | Mô phỏng | Chấp nhận mọi input không rỗng |
| Member dashboard | Mô phỏng | Profile, metrics và đơn hàng hard-code |
| Quản trị trong FE này | Không hoạt động | Chỉ còn file trang chưa được nối |
| Footer links/social links | Chưa kết nối | Chỉ là nội dung hiển thị |

## 9. Phụ thuộc tài nguyên bên ngoài

Frontend hiện phụ thuộc internet cho một số tài nguyên không thuộc catalog:

- Tailwind CSS CDN.
- Google Fonts.
- Ảnh hero và gallery từ Picsum.
- Ảnh giới thiệu từ `public.readdy.ai`.
- Avatar thành viên từ `i.pravatar.cc`.

Nếu các dịch vụ này không truy cập được, catalog nội bộ vẫn có thể tải nhưng font hoặc một số ảnh marketing/avatar sẽ không hiển thị đúng như thiết kế.

## 10. Các điểm kỹ thuật cần lưu ý

- Không có URL routing, deep link, lịch sử Back/Forward theo view hoặc trang 404.
- Ngôn ngữ chưa nhất quán toàn ứng dụng; chỉ Home có chuyển Việt/Anh.
- Trạng thái đăng nhập chỉ dựa trên sự tồn tại của `lamie_token` trong `localStorage`.
- Chưa có cart state, order flow, API liên hệ, API chat hoặc API member.
- `admin.page.tsx` là code không thể truy cập từ app hiện tại.
- `components/ui/Base.tsx` và `components/ui/Layout.tsx` là bộ UI/layout cũ, không thuộc shell đang chạy.
- Có nhiều khai báo type cũ/trùng nhau trong `types.ts`, `types/index.ts` và type hiện hành trong `features/product/product.type.ts`.
- Tailwind chạy qua CDN và cấu hình inline trong HTML, chưa được tích hợp vào pipeline build như một dependency npm.
- Dữ liệu catalog hiện còn record test và giá placeholder; cần làm sạch từ nguồn export trước khi phát hành cho khách hàng.
- Metadata HTML hiện đặt `lang="en"` ban đầu; Home sẽ cập nhật thuộc tính này khi component chạy.

## 11. Cấu trúc source chính

```text
FE_Lamie/
├── App.tsx                         # Điều phối view, catalog và auth state
├── index.tsx                       # Mount React app
├── index.html                      # Design tokens, Tailwind CDN, fonts
├── pages/                          # Home, Shop, Product, Login, Member, Admin cũ
├── sections/home/                  # Các section của landing page
├── components/
│   ├── common/                     # Button, icon
│   ├── layout/                     # Header, footer, mobile menu, account sidebar
│   └── ui/                         # Primitive UI và container
├── features/
│   ├── product/                    # Catalog, filter, gallery và product components
│   └── chat/                       # ChatBox và mock service
├── public/
│   ├── fe-data/                    # Static catalog export
│   └── images/product-fallback.svg
├── tests/                          # Test catalog và design system
└── docs/                           # Tài liệu dự án
```

## 12. Trạng thái kiểm tra tại thời điểm lập tài liệu

Các lệnh đã được chạy trực tiếp trên source hiện tại:

| Lệnh | Kết quả |
| --- | --- |
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm test` | Pass 24/24 tests |
| `npm run build` | Pass, Vite build thành công 66 modules |

Build production tạo các chunk riêng cho Home, Shop, Product Detail, Login và Member. Kết quả trên xác nhận source hiện tại có thể biên dịch; không đồng nghĩa các chức năng mô phỏng như giỏ hàng, xác thực, liên hệ và member đã được tích hợp backend.
