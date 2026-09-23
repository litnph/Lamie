# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Khách đã biết mẫu, loại hoa hoặc màu mình muốn và cần tìm nhanh bằng tên, mã, taxonomy hoặc từ đồng nghĩa.
- Khách chỉ biết dịp và ngân sách, cần được dẫn từ nhu cầu đến một nhóm mẫu phù hợp.
- Khách chưa biết chọn gì, cần chuẩn bị một yêu cầu ngắn rồi chuyển sang kênh tư vấn thật của Lamie.
- Mobile/social được xem là nguồn truy cập quan trọng nhưng tỷ lệ thực tế chưa có analytics để xác nhận.

## Product Purpose

Lamie là một showroom hoa số bằng tiếng Việt: kể câu chuyện thương hiệu, giúp khách tìm và chia sẻ mẫu hoa, giải thích quy trình, rồi chuyển khách sang một trong các kênh liên hệ thật. Thành công là khách tìm được mẫu hoặc chuẩn bị đủ ngữ cảnh để Lamie tư vấn; website không mô phỏng giao dịch đã hoàn tất.

## Positioning

Website kết hợp một landing page giàu cảm xúc với catalog tĩnh có tìm kiếm/lọc và URL riêng cho từng mẫu. Mọi CTA kết thúc ở bước liên hệ để Lamie xác nhận, thay vì giả lập giỏ hàng, checkout, tồn kho hoặc chat.

## Operating Context

- Khách duyệt theo dịp, ngân sách, dòng sản phẩm, kiểu dáng, hoa, màu và phong cách.
- Khách có thể chia sẻ URL catalog đã lọc hoặc URL riêng của một mẫu.
- Dữ liệu liên hệ tùy chọn gồm mã/link mẫu, ngày nhận, ngân sách, khu vực/địa chỉ giao, nội dung thiệp và ghi chú; dữ liệu chỉ tồn tại cục bộ trong phiên cần thiết.
- Việc chuẩn bị, thay hoa, phí giao và khả năng nhận đơn luôn do Lamie xác nhận qua tư vấn.
- Chủ shop/dev cập nhật catalog qua file tĩnh; không có CMS trong phạm vi hiện tại.

## Capabilities and Constraints

- Route đã duyệt: `/`, `/mau-hoa`, `/mau-hoa/{slug}` và trang không tìm thấy.
- Catalog cần search tiếng Việt không dấu, synonym có kiểm soát, OR trong nhóm, AND giữa nhóm, sort, URL state, load-more và responsive filter.
- Dòng sản phẩm: `Hoa tươi`, `Hoa sáp & lụa`. Kiểu dáng, dịp, hoa, màu, phong cách, bộ sưu tập và trạng thái là các trục riêng theo tài liệu BA/UIUX.
- Trạng thái: `Đang nhận đặt`, `Đặt trước`, `Theo mùa`, `Tạm ngưng`. Không đại diện tồn kho thời gian thực.
- Giá theo từng sản phẩm: giá cụ thể hoặc `Liên hệ báo giá`; không tự tạo giá, mức giảm hay mốc ngân sách production.
- Website tĩnh, không backend/API/admin, account, member, cart, checkout, payment, live inventory, fake chat, fake review hoặc fake social proof.
- Dữ liệu production thật, domain, map chi tiết, lead time, phí giao và chính sách thanh toán/hủy vẫn đang mở; không được suy đoán.
- 24 sản phẩm demo chỉ phục vụ development/preview, phải có `isDemo` và bị loại khỏi production/SEO.
- Analytics adapter tắt mặc định cho đến khi có công cụ, consent và privacy review.

## Brand Commitments

- Tên thương hiệu: Lamie.
- Hotline: 0906 445 004; Instagram và TikTok: `@tiemhoalamie`; Zalo: `0906445004`.
- Địa chỉ công bố: MT Eastmark City, phường Long Trường, TP. Thủ Đức; luôn nhắc khách liên hệ trước khi đến.
- Giờ mở cửa: 08:00–21:00 hằng ngày.
- Hoa tươi dùng câu chữ trung thực: “Liên hệ Lamie để kiểm tra khu vực và phí giao.” Hoa sáp & lụa giao toàn quốc.
- Năm kênh liên hệ được trình bày ngang nhau khi link hợp lệ.
- Giọng nội dung dịu, rõ, hữu ích; không dùng claim tuyệt đối, chính sách, giá, review hoặc cam kết chưa có bằng chứng.
- Wordmark hiện là bản chữ chờ duyệt; không cắt logo từ ảnh concept.

## Evidence on Hand

- Nguồn nghiệp vụ đã duyệt: `C:\Users\Ngoph\Downloads\BA_UIUX_LAMIE_GIAI_DOAN_DINH_HUONG.md`.
- Quy trình triển khai: `C:\Users\Ngoph\Downloads\PROMPT_CODEX_IMPLEMENT_LAMIE.md`.
- Audit hiện trạng: `docs/MO_TA_FE_HIEN_TAI.md`.
- Repo có static export 16 sản phẩm và ảnh Lamie, nhưng dữ liệu chứa record test, giá placeholder và taxonomy cũ nên chưa đủ điều kiện production.
- Repo không có `1(1).png` hoặc `1(2).png`; visual direction của concept đã được mô tả đầy đủ trong tài liệu BA/UIUX.
- Chưa có review, số liệu uy tín, bộ ảnh hero/process đã duyệt, 8–12 sản phẩm production sạch, domain hoặc map chi tiết. Những nội dung này không được bịa.

## Product Principles

1. Trung thực trước chuyển đổi: chỉ hiển thị hành vi, giá, trạng thái và chính sách có thật.
2. Tìm mẫu trước, thuật ngữ sau: bắt đầu từ dịp/ngân sách và hỗ trợ search tự nhiên bằng tiếng Việt.
3. Một URL giữ nguyên ngữ cảnh: catalog đã lọc và sản phẩm đều phải reload/share được.
4. Cảm xúc không cản tác vụ: nhận diện giàu chất liệu ở Home, catalog sạch và nhanh.
5. Progressive enhancement: nội dung, filter, gallery và CTA vẫn hoạt động khi motion bị giảm hoặc asset nâng cao không tải.

## Accessibility & Inclusion

Mục tiêu WCAG 2.2 AA. Tất cả route, dialog, drawer, gallery và control phải dùng được bằng bàn phím; focus rõ và không bị che; target khoảng 44×44 px; trạng thái không chỉ truyền bằng màu; tiếng Việt dài không vỡ layout; reduced motion giữ đầy đủ nội dung và chức năng.
