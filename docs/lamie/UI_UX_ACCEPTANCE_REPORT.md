# Báo cáo kiểm thử UI/UX và nghiệm thu website Lamie

> Ngày audit: 23/09/2026  
> Phạm vi: source/working tree hiện tại tại commit `9e13861`, nhánh `codex`  
> Loại lượt làm việc: kiểm thử và nghiệm thu; không sửa application source  
> Kết quả tổng: **76/100 — chưa sẵn sàng nghiệm thu UI/UX hoặc publish**

## 1. Executive verdict

Website **gần hoàn thiện về development**, các route và luồng showroom cốt lõi đã chạy được, demo được tách khỏi production đúng chủ đích, và lint/typecheck/test/build đều pass. Tuy nhiên sản phẩm **chưa đủ điều kiện nghiệm thu UI/UX** vì còn hai lỗi accessibility/interaction P1: text resize 200% làm mất control ngoài viewport và contact dialog mở từ quick view tạo hai modal cùng accessible name.

Website **chưa sẵn sàng publish** vì `PRODUCTION_PRODUCTS` đang rỗng, bộ ảnh/copy/wordmark vẫn ghi rõ chờ duyệt, chưa có domain/hosting rewrite thật, và SEO release artifacts chưa tồn tại. Đây chủ yếu là content/business/infra gap, không phải bằng chứng application đang đưa demo ra production.

- Tổng điểm: **76/100**.
- P0: **0**.
- P1: **3** — 2 lỗi kỹ thuật, 1 blocker dữ liệu/content.
- P2: **10**.
- P3: **2**.
- Verdict tổng hợp: **Development hoàn thiện có điều kiện; UI/UX, content/business và production chưa sẵn sàng.**

## 2. Phạm vi và môi trường kiểm thử

### 2.1 Nguồn sự thật đã đọc

- `C:\Users\Ngoph\Downloads\PROMPT_AUDIT_UIUX_NGHIEM_THU_LAMIE.md` — file audit không tồn tại dưới `docs/lamie`, nên dùng đúng bản được người dùng cung cấp trong Downloads.
- `C:\Users\Ngoph\Downloads\BA_UIUX_LAMIE_GIAI_DOAN_DINH_HUONG.md`.
- `C:\Users\Ngoph\Downloads\PROMPT_CODEX_IMPLEMENT_LAMIE.md`.
- `CODEX_PROGRESS.md`, `README.md`, `PRODUCT.md`, `DESIGN.md`, `docs/MO_TA_FE_HIEN_TAI.md`, `docs/DATA_GUIDE.md`, `docs/IMAGE_ASSETS.md`, `docs/STATIC_HOSTING.md`.
- Source hiện hành cho App/router/config, Home, Catalog, Product Detail, Contact dialog, 404, catalog data/logic/taxonomy, CSS, test và QA scripts.
- `gpt-taste/SKILL.md` và `impeccable/SKILL.md`; với Impeccable đã đọc thêm `reference/audit.md` và chạy `impeccable context` một lần.

Ảnh concept gốc `1(1).png` và `1(2).png` không tồn tại trong repository hoặc Downloads tại thời điểm audit. Visual được đối chiếu bằng mô tả concept trong BA/UI/UX và năm asset WebP hiện có tại `public/images/editorial/`. Đây là giới hạn bằng chứng, không được diễn giải là đã so khớp pixel với ảnh concept gốc.

### 2.2 Môi trường

| Hạng mục | Giá trị |
| --- | --- |
| Git root | `D:\Git\Lamie\FE_Lamie` |
| Commit nền | `9e13861` |
| Branch | `codex` |
| Working tree | Dirty; toàn bộ thay đổi implementation hiện tại được giữ nguyên |
| Stack | React 19.2.3, TypeScript 5.8, Vite 6.4.2, GSAP 3.15 |
| Package manager | npm, lockfile hiện có |
| Browser | Microsoft Edge/Chromium 153, headless qua `playwright-core` |
| Dev URL | `http://127.0.0.1:3000` |
| Production preview | `http://127.0.0.1:4173` |
| Viewport | 1440×1000, 1024×900, 768×1024, 390×844, 360×800 |
| Motion | Cả `no-preference` và `prefers-reduced-motion: reduce` |

Browser test là browser thật ở chế độ headless, không phải chỉ đọc source. Screenshot chính:

- [Home 1440](../../.impeccable/review/desktop.png)
- [Catalog 1024](../../.impeccable/review/laptop-1024-catalog.png)
- [Catalog 768](../../.impeccable/review/tablet-768-catalog.png)
- [Home 390](../../.impeccable/review/mobile.png)
- [Detail 360](../../.impeccable/review/mobile-360-detail.png)
- [Detail 768](../../.impeccable/audit-2026-09-23/detail-768.png)
- [Detail 360 ở đầu trang](../../.impeccable/audit-2026-09-23/mobile-detail-top.png)
- [Catalog 390 khi text resize 200%](../../.impeccable/audit-2026-09-23/catalog-390-text-200.png)

QA artifacts và script đo nằm trong `.impeccable/audit-2026-09-23/`; thư mục này đang ở trạng thái untracked và không phải application source.

## 3. Kết quả build/lint/typecheck/test

| Command | Kết quả thực tế | Bằng chứng chính |
| --- | --- | --- |
| `npm run lint` | **Pass**, exit 0 | `tsc --noEmit --noUnusedLocals --noUnusedParameters` |
| `npm run typecheck` | **Pass**, exit 0 | `tsc --noEmit` |
| `npm test` | **Pass 33/33**, exit 0 | 28 top-level subtest, 33 test, 0 fail/skip |
| `npm run build` | **Pass**, exit 0 | Vite 6.4.2, 55 modules, build 819 ms |
| `git diff --check` | **Pass**, exit 0 | Chỉ có warning LF/CRLF trên Windows |
| `npm run qa:production` | **Pass**, exit 0 | Home, production empty catalog, missing demo product và 404 đều không có lỗi |
| `npm audit --omit=dev --json` | **Pass** | 0 runtime vulnerability |
| `npm audit --json` | **Có advisory** | 6 dev/build advisory: 1 low, 1 moderate, 4 high |

Build output chính:

- CSS: 37.05 kB, gzip 8.50 kB.
- Home/GSAP chunk: 127.90 kB, gzip 49.84 kB.
- Main chunk: 220.58 kB, gzip 69.29 kB.
- Catalog: 9.74 kB, gzip 3.30 kB.
- Product Detail: 7.49 kB, gzip 2.79 kB.

`npm run qa:visual` chạy đủ 5 case và trả exit 1 vì rule kiểm tra `visibility` thấy sticky CTA còn `visible` ngay trong 260 ms transition sau khi script tự cuộn xuống rồi quay về đầu trang. Kiểm tra độc lập cho thấy ở thời điểm đó CTA có `opacity: 0`, `pointer-events: none`, đã translate ra ngoài viewport; sau 350 ms chuyển sang `visibility: hidden`. Đây là **false positive của assertion**, không phải CTA che tiêu đề. Không sửa script hoặc source trong lượt audit.

## 4. Bảng điểm 0–100

| Nhóm | Trọng số | Điểm | Lý do ngắn |
| --- | ---: | ---: | --- |
| Nghiệp vụ và core user flows | 20 | 18 | A–D hoạt động; E/F có sai lệch accessibility/interaction |
| Catalog, search, filter và detail | 20 | 16 | Filter/URL/load-more tốt; lỗi `bó/bouquet`, thiếu suggestion, mobile card chưa toàn vùng bấm |
| UI/visual và nhận diện Lamie | 15 | 13 | Hướng Botanical Editorial rõ; 3D/final process và asset thật chưa hoàn tất |
| Usability và interaction | 10 | 8 | Information scent tốt; nested modal gây sai accessible name |
| Responsive/mobile | 10 | 8 | Không overflow ở kích thước mặc định; sai breakpoint 1440/768 và text resize thất bại |
| Accessibility | 10 | 6 | Semantic/focus/reduced motion tốt; hai lỗi P1 chưa cho phép kết luận AA |
| Performance/motion | 10 | 5 | CLS ~0.21; mobile lab LCP 3.096 s; chưa có responsive images/3D gate hoàn chỉnh |
| SEO và data integrity | 5 | 2 | Demo exclusion rất tốt; canonical/OG/sitemap/robots và production data chưa có |
| **Tổng** | **100** | **76** | **Gần đạt nhưng còn P1 và blocker publish** |

## 5. Bốn verdict bắt buộc

### 5.1 Development completeness — **Sẵn sàng có điều kiện**

Điều kiện trực tiếp:

1. Sửa nested quick-view/contact dialog và unique dialog IDs.
2. Sửa reflow/text resize 200%.
3. Đưa search synonym `bó/bouquet` về cùng tập kết quả và bổ sung cơ chế suggestion/relevance đã duyệt.
4. Chỉnh responsive contract: 4 cột ở 1440, detail stack ở 768, toàn card mobile mở detail.
5. Xử lý CLS của lazy route shell và image-loading strategy.

### 5.2 UI/UX readiness — **Chưa sẵn sàng**

Điều kiện trực tiếp:

1. Không còn hai lỗi P1 accessibility.
2. Hoàn tất mobile card target và breakpoint đã duyệt.
3. Khắc phục modal stacking trong luồng quick view → contact.
4. Duyệt asset/copy/wordmark để đánh giá visual cuối cùng bằng nội dung thật.

### 5.3 Content/business readiness — **Chưa sẵn sàng**

Blocker trực tiếp:

1. `PRODUCTION_PRODUCTS` đang rỗng; chưa có tối thiểu 8–12 sản phẩm thật đại diện.
2. Hero/story/category assets và wordmark đều đang ghi chờ Lamie duyệt.
3. Hero/story copy vẫn được đánh dấu là draft/chưa phải tuyên bố chính thức.
4. Domain/map chi tiết và gói nội dung production chưa được cung cấp.
5. Lead time, phí giao và policy chỉ được phép giữ wording tư vấn hiện tại cho tới khi Lamie cung cấp dữ liệu thật.

### 5.4 Production readiness — **Chưa sẵn sàng**

Blocker trực tiếp:

1. Còn P1 kỹ thuật và P1 content/data.
2. Production build chỉ có empty catalog; không có product detail thật để publish.
3. Chưa có canonical, OG/social preview, sitemap, robots hoặc domain production.
4. Rewrite chỉ mới có tài liệu mẫu, chưa kiểm thử trên hosting thật.
5. Performance lab chưa đạt target CLS/LCP; full toolchain audit còn 6 advisory.

## 6. Requirement traceability matrix

| Yêu cầu | Bằng chứng | Trạng thái | Issue |
| --- | --- | --- | --- |
| Route `/`, `/mau-hoa`, `/mau-hoa/:slug`, 404 | Matrix 15 route/viewport; production smoke 4 route | Đạt | — |
| Deep link, reload, back/forward | URL hai dịp giữ nguyên sau reload; back/forward trả đúng URL/chips | Đạt | — |
| Header/navigation/mobile menu | Tab order; menu mở bằng Enter, Escape đóng, focus trả trigger | Đạt | — |
| Thông tin Lamie | Hotline, handle, địa chỉ, giờ khớp BA/UI/UX và `site-config.ts` | Đạt | — |
| Announcement chỉ hiện khi có nội dung xác minh | Không có announcement trên DOM/screenshot | Đạt | — |
| Hero + hai CTA | Home 1440/390; hero 2 dòng desktop, 3 dòng mobile | Đạt | — |
| Khám phá theo dịp | Flow A đi từ Sinh nhật đến URL `?dip=Sinh nhật` | Đạt | — |
| Khám phá theo ngân sách không bịa mốc | Home dẫn consultation; numeric budget chỉ ghi rõ demo | Đạt | — |
| Một section “Mẫu hoa Lamie” | Home DOM/source và screenshot | Đạt | — |
| Quy trình 7 bước | DOM có 7 bước, reduced motion không ẩn bước | Đạt một phần | AUD-MOTION-01 |
| Story/cam kết trung thực | Chỉ ba cam kết được phép; draft có nhãn | Đạt một phần | AUD-CONTENT-01 |
| Gallery/review/FAQ chỉ khi có content thật | Không render gallery/review/FAQ giả | Đạt | — |
| Catalog sidebar từ 1024 | 1024 có sidebar; dưới 1024 dùng sheet | Đạt | — |
| Grid 4/3/2/2 | Đo 1440=3, 1024=3, 768=2, 390/360=2 | Đạt một phần | AUD-RESP-01 |
| Search dấu/không dấu/hoa-thường/đ-d | `Dịu hồng`=`diu hong`=`DIU HONG`; `đỏ`=`do` | Đạt | — |
| Tìm tên và mã | `DEMO-001` trả đúng một mẫu; tên tìm được | Đạt | — |
| `hoa hồng đỏ` | Trả 5 mẫu có Hoa hồng + Đỏ | Đạt | — |
| `lam tinh`/`hoa lam tinh`/`sao xanh`/`hoa sao xanh` | Mỗi query trả cùng 2 mẫu | Đạt | — |
| `box`/`hộp` | Mỗi query trả cùng 3 mẫu | Đạt | — |
| `bouquet`/`bó` | 8 so với 11 kết quả | Chưa đạt | AUD-SEARCH-01 |
| `cử nhân`/`tốt nghiệp` | Mỗi query trả cùng 5 mẫu | Đạt | — |
| Search suggestion + relevance | Không có listbox/datalist; source không có scoring | Chưa đạt | AUD-SEARCH-02 |
| OR trong nhóm, AND giữa nhóm | OR hai dịp=13; AND dịp+dòng=2; unit test pass | Đạt | — |
| Active chips/xóa từng/xóa tất cả | 2 chip → xóa một còn 1; clear về 24 mẫu | Đạt | — |
| Quote không lọt numeric budget | Quote-only=6; quote+numeric=0; numeric có 0 card quote | Đạt | — |
| URL state reload/copy | URL/chip/count giữ nguyên sau reload | Đạt | — |
| Result count và load-more | Ban đầu 12, sau load-more 24, count=24 | Đạt | — |
| Sort mặc định; tạm ngưng cuối | Hai item cuối sau load đủ là `Tạm ngưng` | Đạt | — |
| Card desktop/tablet | Ảnh, tên, mã, giá/trạng thái, dịp; quick view hiện | Đạt | — |
| Toàn card mobile mở detail | Click body không đổi URL; click ảnh đổi sang detail | Chưa đạt | AUD-MOBILE-01 |
| Quick view có đường tới detail | Quick view có “Xem chi tiết” và hoạt động | Đạt một phần | AUD-A11Y-02 |
| Detail fixed/contact/seasonal/paused | Đã mở 4 slug; giá/status/CTA đúng ngữ cảnh | Đạt | — |
| Delivery wording theo dòng | Hoa tươi đúng wording; Hoa sáp & lụa trong source đúng toàn quốc | Đạt | — |
| Tạm ngưng chuyển sang tư vấn tương tự | `mau-demo-21` có CTA “Nhờ tư vấn mẫu tương tự” | Đạt | — |
| Gallery nhiều ảnh | Mọi demo fixture chỉ có 1 ảnh | Không thể kiểm tra | DATA-GAP |
| Gallery keyboard/lightbox | Enter mở; Escape đóng; focus trả nút ảnh | Đạt trong fixture 1 ảnh | — |
| Fallback ảnh | Chặn request ảnh → WebP placeholder + alt/label “Ảnh đang cập nhật” | Đạt | — |
| Contact chooser 5 kênh ngang nhau | 5 button; popup Edge tạo đúng URL; endpoint HTTP 200 | Đạt | — |
| Contact summary/copy/privacy | Clipboard chứa đủ 5 trường; copy nói rõ chưa gửi; analytics tắt | Đạt | — |
| Không fake submit/cart/login/chat/review/stats | Active tree và production DOM không có các chức năng giả | Đạt | — |
| Demo không lọt production | Production smoke: 0 demo marker/card, demo detail thành missing state | Đạt | — |
| Semantic/H1/landmark/label/alt | 1 H1/route; không unnamed control/field; không thiếu alt trong 4 route | Đạt | — |
| Dialog Escape/trap/restore | Menu/filter/contact/lightbox/quick view pass riêng lẻ | Đạt một phần | AUD-A11Y-02 |
| Text resize 200% | 6 control/link bị clipped tại Catalog 390 | Chưa đạt | AUD-A11Y-01 |
| Reduced motion | 7 bước hiện đủ; 0 running animation; contact vẫn hoạt động | Đạt | AUD-POLISH-02 |
| Default responsive overflow | 15/15 main route×viewport có `scrollWidth=clientWidth` | Đạt | — |
| LCP/INP/CLS target | Lab: LCP 3.096 s mobile, CLS ~0.21; không có p75 field data | Chưa đạt | AUD-PERF-01, AUD-PERF-02 |
| Responsive images/lazy loading/dimensions | Có dimensions/lazy; không `srcset/sizes`; 4 card đầu eager | Đạt một phần | AUD-PERF-02 |
| Title/description/semantic SEO | Title/description cập nhật client-side; headings tốt | Đạt một phần | AUD-SEO-01 |
| Canonical/OG/sitemap/robots | Không tồn tại trong source/dist | Chưa đạt | AUD-SEO-01 |
| Data/config tập trung, `published`/`isDemo` | Type/config/data rõ; production không ghép demo | Đạt | — |
| Dữ liệu/ảnh/copy production thật | Production array rỗng; asset/copy chờ duyệt | Chưa đạt | AUD-DATA-01, AUD-CONTENT-01 |

## 7. Kết quả user flow A–F

| Flow | Kết quả | Bằng chứng |
| --- | --- | --- |
| A — Khám phá thương hiệu rồi chọn mẫu | **Đạt** | Home → card Sinh nhật → `?dip=Sinh nhật` → `mau-demo-01` → contact dialog có 5 kênh |
| B — Vào catalog tìm theo nhu cầu | **Đạt** | Search `hoa hong do`=5; thêm giá+dòng+kiểu tạo empty state trung thực; clear về 24; mở được detail |
| C — Mở link detail được chia sẻ | **Đạt** | Mở trực tiếp fixed/contact/seasonal/paused; contact mở; focus trả CTA; breadcrumb về `/mau-hoa` |
| D — Chưa biết chọn gì | **Đạt** | CTA hero → 5 kênh; nhập ngày/ngân sách/khu vực/thiệp/note; clipboard đúng; không báo gửi giả |
| E — Mobile | **Đạt một phần** | 390: search → sheet → 2 filter → expected/result đều 7 → ảnh mở detail → sticky CTA đúng; body card không mở detail |
| F — Keyboard và reduced motion | **Đạt một phần** | Tab order hợp lý; menu/filter/lightbox/quick/contact riêng lẻ restore focus; reduced motion dùng được; nested modal và text resize chưa đạt |

## 8. Ma trận route × viewport

Quy ước: `Đạt` nghĩa là route thực sự được mở trong Edge, có 1 H1, footer, không ảnh hỏng, không horizontal overflow mặc định và không console/page error. `Một phần` nêu sai khác riêng.

| Route | 1440 | 1024 | 768 | 390 | 360 |
| --- | --- | --- | --- | --- | --- |
| Home `/` | Đạt | Đạt | Đạt | Đạt | Đạt |
| Catalog `/mau-hoa` | **Một phần:** 3 cột thay vì 4 | Đạt: 3 cột/sidebar | Đạt: 2 cột/sheet | **Một phần:** body card không clickable; text resize lỗi | **Một phần:** body card không clickable |
| Detail `/mau-hoa/mau-demo-01` | Đạt | Đạt | **Một phần:** vẫn split 346.5/320 px thay vì stack | Đạt | Đạt; CTA đầu trang hidden, sau heading visible |

Các route bổ sung đã kiểm tra:

- `/mau-hoa/mau-demo-05`: contact-price detail.
- `/mau-hoa/mau-demo-03`: seasonal detail.
- `/mau-hoa/mau-demo-21`: paused detail.
- `/mau-hoa/khong-ton-tai`: missing product state.
- `/duong-dan-khong-ton-tai`: 404 nội bộ.
- Production `/mau-hoa`: honest empty state, không demo.

## 9. Nhận xét TasteSkill

### 9.1 Điều làm Lamie nổi bật

- Creative direction “Botanical Paper Editorial” thể hiện rõ bằng nền giấy kem, mocha/sage/dusty rose, ảnh editorial và overlap giấy tiết chế.
- Hero đạt hard rule: 2 dòng ở 1440, 3 dòng ở 390; container rộng, CTA rõ, không có badge/stamp trang trí vô nghĩa.
- Home giữ đúng mạch Attention → Interest → Desire → Action: hero, bento dịp, lựa chọn dòng hoa, process story, contact/footer.
- Bento dịp kín 12 cột: hàng đầu 7+5, hàng sau 4+4+4; không có ô rỗng.
- Catalog phẳng, ảnh dẫn dắt, không card-in-card; CTA và button contrast tốt.
- Motion GSAP tập trung ở hero/process, không scroll hijack, audio, cursor trail hoặc bounce.

### 9.2 Điều chưa hoàn thiện hoặc thiếu “gu”

- Ảnh demo cũ có chữ/banner chụp tại shop và crop không đồng đều, làm phần catalog kém đồng bộ hơn hệ editorial mới. Đây là giới hạn dữ liệu demo, không nên sửa bằng cách biến asset concept thành sản phẩm thật.
- Typography metadata quá nhỏ ở nhiều nơi (`0.55–0.82rem`), khiến catalog trông “thiết kế để chụp screenshot” hơn là để đọc thoải mái.
- Process story mới dừng ở ribbon/CSS sheets; chưa có florist imagery theo từng bước hoặc final bloom/3D signature đã duyệt.
- Mobile process vẫn là 7 card dài, chưa được biên tập thành 4 chặng như BA/UI/UX.

### 9.3 Điều đẹp nhưng gây hại usability/performance/accessibility

- Route lazy fallback để footer xuất hiện sớm tạo layout shift ~0.21 dù visual footer đẹp.
- Khoảng cách cinematic và 7 process card làm Home 360 dài khoảng 11,133 px; vẫn dùng được nhưng tăng chi phí cuộn.
- `overflow-x: clip` giữ screenshot “sạch” nhưng che control khi text resize thay vì tạo reflow đúng.

## 10. Nhận xét Impeccable

### 10.1 Implementation Integrity Verdict

**Pass có điều kiện:** implementation thể hiện một hệ Lamie riêng, nhất quán với PRODUCT/DESIGN, không phải template đổi tên. Data truth, demo boundary, contact wording và empty states được xử lý có chủ đích. Detector không phát hiện blocker cơ học; output tập trung vào advisory về type size, màu literal và radius ngoài sidecar. Manual verification xác nhận phần lớn color literal là tonal overlay có chủ đích, nhưng type scale drift là nhận xét hợp lệ.

### 10.2 Audit Health Score theo Impeccable

| # | Dimension | Score | Key finding |
| --- | --- | ---: | --- |
| 1 | Accessibility | 2/4 | Text resize và nested modal/accessible name |
| 2 | Performance | 2/4 | CLS ~0.21, mobile lab LCP 3.096 s, thiếu responsive images |
| 3 | Responsive Design | 3/4 | Default viewport tốt; sai 1440/768 và toàn card mobile |
| 4 | Theming | 3/4 | Token nền tốt; nhiều literal tonal/type step chưa được document |
| 5 | Implementation Integrity | 3/4 | Product-specific, truthful; còn một số contract chưa khép kín |
| **Tổng** |  | **13/20 — Acceptable** | **Cần một vòng hardening có mục tiêu** |

### 10.3 UX findings

- Trong 5–10 giây, người dùng hiểu đây là tiệm hoa, có thể khám phá mẫu hoặc nhờ tư vấn.
- Information scent tốt: dịp, dòng, kiểu, search, status, delivery và CTA dùng câu chữ tự nhiên.
- Filter có độ sâu lớn nhưng progressive disclosure qua `details` hợp lý; count/chip/clear giúp giảm cognitive load.
- Detail cho thấy giá/status/giao/confirmation rõ; paused state không giả vờ đặt được.
- Empty/404/fallback đều có recovery path.
- Điểm gây do dự chính là nested modal từ quick view, mobile card target không nhất quán và search `bó` trả thêm box false positives.

## 11. Accessibility findings

### 11.1 Positive findings đã kiểm thử

- Mỗi route có đúng một H1; heading sequence không nhảy cấp bất hợp lý.
- Có header/nav/main/footer, skip link, focus visible và `lang="vi"`.
- Không có input/select/textarea thiếu label trong các route kiểm tra.
- Không có button/link không có accessible name.
- Không có ảnh thiếu `alt`; thumbnail trang trí có `alt=""` phù hợp.
- Contrast mẫu đo thực tế đều đạt AA cho chữ thường: ink/paper 12.00:1; mocha-soft/paper 5.01:1; body-secondary/paper 6.86:1; preview text/dark 10.83:1; footer 13.62:1; status warning/danger/success đều trên 6:1.
- Menu, filter sheet, contact dialog, quick view và lightbox riêng lẻ đóng bằng Escape và trả focus đúng trigger.
- Reduced motion: media query active; marquee thành wrap tĩnh; 7/7 process step vẫn hiện; contact vẫn dùng được.
- Viewport meta không khóa zoom.

### 11.2 Automatic/manual limitations

Không tuyên bố đạt WCAG 2.2 AA. Không có axe/screen reader được cài sẵn và lượt audit cấm cài dependency. Kết quả trên là static/DOM checks và keyboard testing trong Edge; không thay thế NVDA/VoiceOver/TalkBack.

### 11.3 Failures

- Text resize 200% làm menu button, search, sort và footer link vượt mép phải trong khi app dùng `overflow-x: clip`; xem AUD-A11Y-01.
- Contact dialog mở từ quick view cùng tồn tại với quick-view dialog; cả hai dùng `aria-labelledby="dialog-title"`, khiến contact được resolve thành “Xem nhanh mẫu hoa”; xem AUD-A11Y-02.
- Target title link trên product card có chiều cao 16 px, nhưng có image link lớn cùng chức năng. Không ghi thành lỗi WCAG độc lập do equivalent-target exception; yêu cầu UX “toàn card mobile” vẫn chưa đạt.

## 12. Performance, motion, SEO và data findings

### 12.1 Performance lab

Đo trên production preview, cache disabled, một lần chạy mỗi scenario. Đây không phải dữ liệu p75 thực tế.

| Scenario | LCP | CLS | Max EventTiming | Max long task | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1440, không throttle | 676 ms | 0.2124 | 96 ms | 0 ms | 626,583 B |
| 390, Slow 4G 1.6 Mbps/150 ms, CPU 4× | 3,096 ms | 0.2102 | 72 ms | 146 ms | 626,514 B |

- LCP desktop candidate cuối là hero WebP.
- CLS lớn nhất 0.212 đến từ footer ban đầu nằm trong viewport khi `Suspense` chỉ render `PageLoader`, sau đó bị đẩy khỏi viewport khi Home chunk mount.
- `Max EventTiming` không phải field INP và không được dùng để tuyên bố đạt INP p75.
- Năm editorial WebP có kích thước 128–177 kB và có dimensions; story/product ngoài màn hình có lazy loading.
- Không có `srcset`/`sizes`. Catalog đánh dấu bốn card đầu `eager` ở mọi viewport. Bốn ảnh demo đầu có tổng khoảng 4.48 MB; toàn bộ 23 ảnh demo khoảng 19.79 MB. Demo không đi production, nhưng strategy code vẫn cần hardening trước catalog thật.

### 12.2 Motion

- Không có scroll hijack/audio/cursor trail/bounce.
- GSAP chỉ chạy từ 1024 px và khi `no-preference`; touch/reduced mode không chạy parallax/pin.
- Reduced mode dùng global `0.01ms !important`; nội dung không mất nhưng cách này cũng triệt tiêu feedback transition có ích.
- Marquee không có explicit offscreen pause; browser có thể tự throttle nhưng source không chứng minh guardrail này.
- Final 3D/bouquet integration hook không tồn tại; mobile chưa group 4 chặng.

### 12.3 SEO

- Đạt: `lang=vi`, title/description route-level bằng JS, semantic H1, favicon, deep-link preview trả HTTP 200.
- Chưa đạt: không canonical, Open Graph/Twitter metadata, sitemap, robots hoặc product HTML prerender.
- Không có structured data giả; demo không vào production. Đây là lựa chọn an toàn.
- Hosting rewrite mới là tài liệu mẫu; chưa thể xác nhận với host thật vì domain/provider chưa có.

### 12.4 Data integrity

- `PRODUCTION_PRODUCTS=[]`; demo chỉ ghép khi `import.meta.env.DEV`.
- 24 demo item có `isDemo`, price test có nhãn, production smoke xác nhận 0 demo card/marker.
- Taxonomy/config tập trung; `published` và validation được tôn trọng.
- Production thiếu data thật nhưng app dùng honest empty state, không biến demo thành production.

## 13. Danh sách issue P0 → P3

### P0 — Blocker

Không phát hiện P0. App build/chạy được, không mất dữ liệu, route và conversion chính không sập.

### P1 — High

#### AUD-A11Y-01 — Text resize 200% làm mất control ngoài viewport

- **Loại:** Technical — Accessibility/Responsive.
- **Route/viewport:** `/mau-hoa`, 390×844, root text size 200%.
- **Tái hiện:** mở Catalog → tăng text size lên 200% → quan sát menu, search, sort và footer.
- **Hiện tại:** 6 interactive element vượt mép phải; `.app-shell` dùng `overflow-x: clip`, nên phần vượt bị che và không có đường cuộn ngang để phục hồi.
- **Mong đợi:** reflow không mất nội dung/chức năng ở 200%.
- **Bằng chứng:** `catalog-390-text-200.png`; supplemental output; `styles.css:98`.
- **Requirement:** WCAG 1.4.4, NFR-02, audit §12.
- **Khuyến nghị:** `$impeccable adapt` — bỏ width/min-width gây clip, cho tools/footer reflow; chỉ dùng overflow guard sau khi layout tự co đúng.

#### AUD-A11Y-02 — Quick view mở chồng contact dialog với accessible name sai

- **Loại:** Technical — Accessibility/Interaction.
- **Route/viewport:** `/mau-hoa`, 1024/1440.
- **Tái hiện:** mở “Xem nhanh” → bấm “Liên hệ mẫu này”.
- **Hiện tại:** có hai `role=dialog aria-modal=true`; cả hai dùng `aria-labelledby="dialog-title"`; accessible name của contact resolve thành “Xem nhanh mẫu hoa”. Escape đóng cả hai do hai listener cùng hoạt động.
- **Mong đợi:** chỉ modal trên cùng active, ID duy nhất, accessible name đúng; hoặc đóng quick view trước khi mở contact.
- **Bằng chứng:** supplemental output `nestedDialogs`; `components/storefront/Dialog.tsx:63–65`; `pages/storefront/CatalogPage.tsx:242–258`.
- **Requirement:** WCAG 1.3.1/4.1.2, FR-17, audit §12.
- **Khuyến nghị:** `$impeccable harden` — unique `useId`, quản lý modal stack, đóng quick view trước contact và xác minh focus restore.

#### AUD-DATA-01 — Không có catalog production thật

- **Loại:** Content/Business dependency — không phải code defect.
- **Route:** production `/mau-hoa` và mọi production detail.
- **Tái hiện:** `npm run build` → preview → mở `/mau-hoa`.
- **Hiện tại:** honest empty state; `PRODUCTION_PRODUCTS=[]`; demo detail không tồn tại trong production.
- **Mong đợi:** tối thiểu 8–12 sản phẩm thật đại diện đã duyệt trước nghiệm thu nội dung/publish.
- **Bằng chứng:** production smoke pass empty state; `features/catalog/catalog.data.ts:90`.
- **Requirement:** BA content gate, master §7, production readiness minimum.
- **Khuyến nghị:** Lamie cung cấp data/ảnh thật theo `docs/DATA_GUIDE.md`; không sao chép demo.

### P2 — Medium

#### AUD-SEARCH-01 — `bouquet` và `bó` không tương đương

- **Route:** `/mau-hoa`, mọi viewport.
- **Tái hiện:** tìm `bouquet`, ghi count; tìm `bó`, ghi count.
- **Hiện tại:** 8 so với 11. Query `bó` chuẩn hóa thành `bo` và được short-circuit bởi substring `haystack.includes(query)`, nên match thêm `box`/chuỗi chứa `bo`.
- **Mong đợi:** hai synonym trả cùng tập Bó hoa.
- **Bằng chứng:** browser output; `features/catalog/catalog.logic.ts:63`.
- **Requirement:** Search test bắt buộc `box/hộp`, `bouquet/bó`.
- **Khuyến nghị:** kiểm tra whole token/phrase trước substring cho token ngắn; thêm regression test tập kết quả.

#### AUD-SEARCH-02 — Thiếu suggestion và relevance ranking đã duyệt

- **Route:** `/mau-hoa`.
- **Tái hiện:** nhập tên/mã/từ taxonomy.
- **Hiện tại:** count cập nhật tức thời nhưng không có listbox/datalist suggestion; filter giữ curated sort thay vì score name/code trước. `Dịu hồng` trả 12 item vì token phân tán, dù item exact đứng đầu do sortOrder tình cờ.
- **Mong đợi:** suggestion giới hạn và thứ tự exact name/code → hoa → taxonomy.
- **Bằng chứng:** DOM 0 listbox/datalist; source Catalog/logic không có suggestion/scoring.
- **Requirement:** master §8.1, BA §13.1.
- **Khuyến nghị:** bổ sung suggestion accessible và deterministic search score.

#### AUD-RESP-01 — Breakpoint không khớp contract 1440/768

- **Route:** Catalog 1440; Detail 768.
- **Tái hiện:** mở Catalog 1440 và đo grid; mở detail 768 và đo `.detail-layout`.
- **Hiện tại:** Catalog 1440 có 3 cột thay vì 4; detail 768 vẫn split `346.5px 320px` thay vì stack.
- **Mong đợi:** 4/3/2/2; tablet detail stack.
- **Bằng chứng:** route matrix; `styles.css:401`, `styles.css:493`, `detail-768.png`.
- **Requirement:** master §8.3, BA wireframe §18.
- **Khuyến nghị:** `$impeccable adapt` — tách breakpoint 1200/1024/768 đúng contract.

#### AUD-MOBILE-01 — Toàn product card mobile chưa mở detail

- **Route/viewport:** `/mau-hoa`, 390/360.
- **Tái hiện:** chạm vùng body/giá/trống của card, sau đó chạm ảnh.
- **Hiện tại:** body click giữ URL catalog; ảnh/title mới mở detail.
- **Mong đợi:** toàn card là target mở detail trên mobile, không có nested interactive conflict.
- **Bằng chứng:** Flow E `beforeBodyClick=afterBodyClick`; image click đổi sang detail; `ProductCard.tsx:21`.
- **Requirement:** master §9.2, Flow E, BA §18.2.
- **Khuyến nghị:** `$impeccable adapt` — dùng stretched link hoặc một primary link bao vùng an toàn.

#### AUD-PERF-01 — CLS vượt budget do Suspense/footer shell

- **Route:** production `/`.
- **Tái hiện:** cold load production preview và quan sát PerformanceObserver.
- **Hiện tại:** CLS 0.2124 desktop và 0.2102 mobile; shift lớn 0.212 tại ~494 ms do footer ban đầu ở viewport rồi bị đẩy đi khi Home mount.
- **Mong đợi:** CLS ≤0.1; shell không flash footer trước route content.
- **Bằng chứng:** performance output; `App.tsx:63–69`.
- **Requirement:** NFR-04, audit §14.
- **Khuyến nghị:** `$impeccable optimize` — route-sized fallback/min-height hoặc đặt footer cùng Suspense boundary phù hợp.

#### AUD-PERF-02 — Mobile lab LCP và product image strategy chưa đạt

- **Route:** production Home; development Catalog.
- **Tái hiện:** cold load 390 Slow 4G/CPU4×; kiểm tra request/markup catalog.
- **Hiện tại:** LCP 3.096 s; không có `srcset/sizes`; 4 card đầu eager ở mọi viewport; bốn ảnh demo đầu ~4.48 MB.
- **Mong đợi:** LCP mục tiêu ≤2.5 s và responsive image strategy theo viewport.
- **Bằng chứng:** performance lab; `CatalogPage.tsx:222`; source scan không có `srcset/sizes`.
- **Requirement:** NFR-04/NFR-05, audit §14.
- **Khuyến nghị:** `$impeccable optimize` — AVIF/WebP variants, `srcset/sizes`, chỉ ưu tiên ảnh above-the-fold theo viewport, tự host/subset font nếu phù hợp.

#### AUD-MOTION-01 — Process/Immersive Bloom chưa khép scope đã duyệt

- **Route:** Home, đặc biệt 768/390/360.
- **Tái hiện:** cuộn process section ở desktop và mobile.
- **Hiện tại:** ribbon + 7 paper card; không final 3D/integration hook; mobile vẫn 7 card thay vì 4 chặng.
- **Mong đợi:** fallback 2.5D hoàn chỉnh kèm integration hook khi bỏ 3D; mobile gom 4 chặng nhưng giữ đủ nội dung.
- **Bằng chứng:** `HomePage.tsx:28–35, 187–203`; screenshot Home 390.
- **Requirement:** master §11, BA §17–18.
- **Khuyến nghị:** `$impeccable animate` — ưu tiên 4-stage mobile và documented performance gate trước khi cân nhắc 3D.

#### AUD-SEO-01 — SEO/social/hosting release artifacts chưa có

- **Loại:** Technical + infra dependency.
- **Hiện tại:** không canonical, OG/Twitter, robots, sitemap, prerender product; rewrite chỉ là tài liệu mẫu.
- **Mong đợi:** artifacts đúng domain và catalog thật, deep-link smoke trên host thật.
- **Bằng chứng:** source/dist scan; `docs/STATIC_HOSTING.md`.
- **Requirement:** master §13, audit §14/§17.
- **Khuyến nghị:** chọn domain/host trước; sau đó tạo canonical/robots/sitemap và quyết định prerender/SSR cho product OG.

#### AUD-SEC-01 — Toolchain có 6 advisory

- **Loại:** Technical — build/security.
- **Hiện tại:** runtime audit 0; full audit có 1 low, 1 moderate, 4 high trong Babel/browserslist/nanoid/postcss/Vite; Vite là direct dev dependency.
- **Mong đợi:** dependency review và upgrade có kiểm soát trước release pipeline.
- **Bằng chứng:** `npm audit --json` ngày audit.
- **Requirement:** production hardening.
- **Khuyến nghị:** `$impeccable harden` không tự `audit fix`; đánh giá changelog và nâng lockfile trong lượt implementation riêng.

#### AUD-CONTENT-01 — Asset/copy/wordmark chưa được Lamie duyệt

- **Loại:** Content/Brand dependency — không phải code defect.
- **Hiện tại:** UI hiển thị “Câu chữ tạm”, “Nội dung định hướng”, “bản chữ chờ duyệt” và caption concept chờ duyệt.
- **Mong đợi:** bộ asset/copy/wordmark production được duyệt hoặc thay thế.
- **Bằng chứng:** `app/site-config.ts:17`, `HomePage.tsx:89,213`, `docs/IMAGE_ASSETS.md`.
- **Requirement:** BA content gate, master §9/§10.
- **Khuyến nghị:** Lamie duyệt từng asset/copy; không xóa nhãn chỉ để làm UI trông hoàn chỉnh.

### P3 — Low/Polish

#### AUD-POLISH-01 — Type/token sidecar chưa phản ánh đầy đủ implementation

- **Hiện tại:** detector báo nhiều advisory type size 0.55–0.82rem, fluid endpoint, literal tonal color và pill radius ngoài DESIGN sidecar. Contrast màu mẫu pass, nhưng một số metadata quá nhỏ.
- **Bằng chứng:** Impeccable detector; `styles.css` các dòng 174–220, 271–279, 526–530.
- **Khuyến nghị:** `$impeccable typeset`, sau đó `$impeccable document`; nâng metadata quan trọng và document intentional tonal ramps.

#### AUD-POLISH-02 — Reduced-motion rule triệt tiêu mọi transition

- **Hiện tại:** global `animation/transition-duration: 0.01ms !important` làm nội dung an toàn nhưng cũng xóa feedback transition không gây vestibular; marquee không có explicit offscreen pause ở normal mode.
- **Bằng chứng:** `styles.css:592–598`; reduced-motion test có 0 running animation và đầy đủ content.
- **Khuyến nghị:** `$impeccable animate` — tắt spatial/parallax motion có chọn lọc, giữ instant/non-spatial feedback rõ; pause marquee bằng visibility/intersection.

## 14. Những phần không thể kiểm tra

| Hạng mục | Lý do |
| --- | --- |
| So khớp trực tiếp ảnh concept `1(1).png`/`1(2).png` | File không có trong repo/Downloads của phiên audit |
| Gallery nhiều ảnh + thumbnail prev/next | 24 demo product đều chỉ có một ảnh |
| Product detail production thật | Production catalog rỗng theo đúng content gate |
| NVDA, VoiceOver, TalkBack | Không có screen reader/hardware trong môi trường; không được cài dependency/tool mới |
| Safari/Firefox/mobile device vật lý | Chỉ có Edge/Chromium headless trong môi trường |
| Bàn phím ảo mobile/safe-area thiết bị thật | Headless viewport không mô phỏng IME hoặc notch/safe-area phần cứng đầy đủ |
| INP/LCP/CLS p75 thực tế | Chưa deploy và không có RUM/analytics; lab một lần không thay thế field data |
| Rewrite/canonical trên host thật | Domain/provider chưa được chọn |
| Cuộc gọi `tel:` trên điện thoại thật | Chỉ xác minh href `tel:0906445004`; không có thiết bị gọi |
| Quyền sở hữu/độ đúng business của ảnh/copy | Cần Lamie duyệt; audit chỉ xác minh nhãn/provenance hiện có |

## 15. Phân biệt lỗi kỹ thuật với tài sản/dữ liệu Lamie còn thiếu

| Nhóm | Nội dung |
| --- | --- |
| Lỗi kỹ thuật cần code fix | Text resize, nested modal/ID, synonym `bó`, suggestion/relevance, breakpoint/grid/detail, full-card mobile, CLS, responsive images, motion/mobile process, SEO artifacts, toolchain advisories |
| Không phải lỗi code | `PRODUCTION_PRODUCTS` rỗng, chưa có 8–12 sản phẩm thật, ảnh sản phẩm thật, logo/wordmark, story/hero copy đã duyệt, map/domain/policy |
| Cách app đang xử lý đúng khi thiếu dữ liệu | Production empty state, demo exclusion, placeholder có nhãn, contact-price, copy “Lamie xác nhận”, analytics tắt, không structured data giả |

## 16. Kế hoạch xử lý ưu tiên

### Phải sửa trước nghiệm thu development/UI/UX

1. AUD-A11Y-01 — reflow/text resize 200%.
2. AUD-A11Y-02 — nested modal và unique accessible IDs.
3. AUD-SEARCH-01 — `bó/bouquet`; thêm regression tests.
4. AUD-RESP-01 và AUD-MOBILE-01 — grid/detail breakpoint và full-card mobile.
5. AUD-PERF-01 — loại footer flash/CLS route load.

### Phải hoàn tất trước publish

1. AUD-DATA-01 và AUD-CONTENT-01 — data/ảnh/copy/wordmark thật đã duyệt.
2. AUD-SEO-01 — domain, canonical, OG, robots, sitemap, prerender decision, host rewrite smoke.
3. AUD-PERF-02 — responsive images và kiểm thử lại trên production data thật.
4. AUD-SEC-01 — review/nâng toolchain có kiểm soát.
5. Chạy lại keyboard/screen reader/device matrix và xác nhận năm contact link trên môi trường publish.

### Có thể cải tiến sau

1. AUD-MOTION-01 — final bloom/3D theo performance gate và mobile 4-stage process.
2. AUD-POLISH-01 — hợp nhất type/token sidecar, nâng legibility metadata.
3. AUD-POLISH-02 — reduced-motion tinh tế hơn và offscreen marquee pause.
4. Bổ sung RUM để theo dõi p75 LCP/INP/CLS sau khi có consent/privacy decision.

## 17. Kết luận cuối

**Sản phẩm hoàn thiện phần lớn về development nhưng chưa sẵn sàng publish vì còn hai lỗi accessibility P1, chưa có catalog/content production thật, và các hạng mục performance/SEO/hosting chưa đạt điều kiện phát hành.**

---

Sau báo cáo này không có source fix nào được thực hiện. Vòng tiếp theo chỉ nên bắt đầu sau khi chủ shop chọn issue hoặc nhóm issue cần xử lý.
