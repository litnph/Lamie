# CODEX Progress — Lamie

## Mục tiêu và nguồn sự thật

Website tĩnh Lamie đã được triển khai theo:

- `C:\Users\Ngoph\Downloads\PROMPT_CODEX_IMPLEMENT_LAMIE.md`
- `C:\Users\Ngoph\Downloads\BA_UIUX_LAMIE_GIAI_DOAN_DINH_HUONG.md`
- `PRODUCT.md`
- Source trong `D:\Git\Lamie\FE_Lamie`

Không deploy, merge, push, tạo backend/API/admin hoặc công bố demo như dữ liệu thật.

## Trạng thái hiện tại

Phạm vi implementation trong master prompt đã hoàn tất và ở trạng thái ổn định. Impeccable finish reviewer đã chốt `SHIP`. Không còn hạng mục code đang dở.

## Đã hoàn thành

- Storefront React/Vite có route `/`, `/mau-hoa`, `/mau-hoa/:slug` và 404; History API hỗ trợ deep link, back/forward và URL filter state.
- Home, Catalog và Detail responsive theo hướng Botanical Paper Editorial; Lora + Be Vietnam Pro; motion GSAP chọn lọc trên desktop và reduced-motion fallback.
- Search tiếng Việt không dấu/`đ-d`, synonym có kiểm soát, AND mọi token còn lại; filter OR trong nhóm/AND giữa nhóm, khoảng giá, báo giá, sort và load-more.
- Catalog có sidebar desktop, filter sheet tablet/mobile, chip active, quick view desktop, loading/empty/error truthfulness.
- Detail có gallery/lightbox, trạng thái/giá, chia sẻ, thuộc tính, mẫu tương tự, contact chooser và mobile contact dock không che heading/focus.
- Contact chooser dùng hotline/Zalo/Facebook/Instagram/TikTok thật; không có fake submit, fake auth/cart/chat hoặc checkout.
- 24 mẫu demo tách khỏi `PRODUCTION_PRODUCTS`; chỉ nạp khi `import.meta.env.DEV`, có nhãn `isDemo`/`isTest`. Production hiện hiển thị empty state trung thực.
- Metadata tiếng Việt, favicon, heading/landmark, skip link, focus trap/restoration, target size và responsive safeguards.
- Tài liệu bàn giao: `README.md`, `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, `docs/DATA_GUIDE.md`, `docs/STATIC_HOSTING.md`.
- Tạo mới 5 ảnh concept đồng bộ Botanical Paper Editorial bằng built-in `imagegen`: hero, story, hai category tile và product placeholder. Ảnh đã tối ưu WebP 128–177 kB, tích hợp vào UI và ghi provenance/prompt tại `docs/IMAGE_ASSETS.md`; không dùng làm ảnh sản phẩm thật.
- Ảnh QA được giữ local trong `.impeccable/review/` và đã ignore khỏi Git; file untracked của user `docs/MO_TA_FE_HIEN_TAI.md` không bị sửa/ghi đè.

## Đang làm

- Không có.

## Việc còn lại trước production

Các mục sau cần dữ liệu/quyết định từ Lamie, không phải code bị bỏ dở:

1. Lamie duyệt hoặc yêu cầu chỉnh bộ ảnh concept trong `public/images/editorial`; sau đó điền catalog production và ảnh sản phẩm thật vào `PRODUCTION_PRODUCTS` theo `docs/DATA_GUIDE.md`.
2. Duyệt logo/font/ảnh hero, nội dung thương hiệu, địa chỉ/map, giờ mở cửa, lead time, phí giao và chính sách nếu muốn công bố.
3. Chọn domain/hosting, thêm rewrite riêng của nhà cung cấp, canonical/sitemap/robots và smoke test sau deploy.
4. Chọn prerender/SSR nếu cần OG/social preview riêng cho từng sản phẩm.
5. Chọn analytics cùng consent policy nếu thực sự cần; adapter hiện tiếp tục tắt.

## File đã thay đổi/tạo

- App/shell: `.gitignore`, `App.tsx`, `index.tsx`, `index.html`, `styles.css`, `app/*`, `public/favicon.svg`.
- Storefront: `components/storefront/*`, `pages/storefront/*`, `utils/storefront-formatters.ts`.
- Catalog: `features/catalog/*`.
- Tooling/tests: `package.json`, `package-lock.json`, `tests/design-system.test.mjs`, `tests/storefront-catalog.test.mjs`, `scripts/visual-check.mjs`, `scripts/production-smoke.mjs`, `scripts/optimize-image.mjs`.
- Asset: `public/images/editorial/*.webp` (5 file concept/placeholder đã tối ưu).
- Tài liệu: `README.md`, `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, `docs/DATA_GUIDE.md`, `docs/IMAGE_ASSETS.md`, `docs/STATIC_HOSTING.md`, `CODEX_PROGRESS.md`.

## Kiểm tra cuối và kết quả

- `npm run lint`: pass.
- `npm run typecheck`: pass.
- `npm test`: pass 33/33, gồm kiểm tra đủ 5 ảnh concept, kích thước dưới 250 kB và đúng wiring/fallback.
- `npm run build`: pass; CSS 37.05 kB (gzip 8.50 kB), Home/GSAP 127.90 kB (gzip 49.84 kB), main 220.58 kB (gzip 69.29 kB).
- `npm run qa:visual`: full suite trước đó pass 5/5 breakpoint; sau khi thêm ảnh, targeted Home 1440/390 pass, lazy images được warm trước screenshot, không overflow/console/page/HTTP error và hero giữ 2/3 dòng.
- `npm run qa:production`: pass trực tiếp `/`, `/mau-hoa`, demo slug không tồn tại trong production và route 404; không có demo marker/card, overflow hoặc first-party HTTP error.
- Impeccable detector: một warning `transition: height`; đã bỏ layout transition, không chạy detector lần hai theo quy trình.
- Impeccable finish review: ban đầu `HOLD_FOR_FIXES` với 3 Major; đã sửa cả 3 và reviewer xác minh lại `SHIP`.
- `.impeccable/design.json`: JSON hợp lệ, schemaVersion 2, 13 color metadata và 7 component snippets; `DESIGN.md` có đúng 8 canonical sections.
- `npm audit --omit=dev --json`: 0 vulnerability production. Full audit còn 6 advisory trong build/dev toolchain (1 low, 1 moderate, 4 high); không chạy `audit fix` tự động để tránh nâng dependency ngoài phạm vi.
- `git diff --check`: pass; chỉ có cảnh báo quy ước LF/CRLF của Git trên Windows.

## Blocker / TBD

- Không có blocker kỹ thuật trong phạm vi đã giao.
- Bộ ảnh concept mới cần Lamie duyệt thẩm mỹ trước khi bỏ caption chờ duyệt hoặc công bố production.
- Thiếu dữ liệu/asset/policy/domain production đã duyệt như liệt kê ở trên.
- Vite SPA chưa cung cấp per-product OG HTML cho crawler không chạy JavaScript.

## Điểm tiếp tục chính xác

Nếu Lamie muốn chỉnh ảnh concept, dùng prompt/provenance trong `docs/IMAGE_ASSETS.md` và thay bằng tên file version mới, không ghi đè mù quáng. Nếu Lamie cung cấp content production, bắt đầu tại `docs/DATA_GUIDE.md`: thêm item thật vào `PRODUCTION_PRODUCTS`, thay asset chờ duyệt, rồi chạy lint/typecheck/test/build/production smoke. Nếu chọn hosting, áp dụng rewrite theo `docs/STATIC_HOSTING.md`.
