import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BRAND_COPY, SITE_CONFIG } from '../../app/site-config';
import type { CatalogProduct } from '../../features/catalog/catalog.types';
import { AppLink } from '../../components/storefront/AppLink';
import { ArrowIcon, CheckIcon } from '../../components/storefront/Icons';
import { ProductCard } from '../../components/storefront/ProductCard';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface HomePageProps {
  products: CatalogProduct[];
  includeDemo: boolean;
  navigate: (to: string) => void;
  onContact: (context?: { intent?: string }) => void;
}

const OCCASION_CARDS = [
  { label: 'Sinh nhật', note: 'Từ dịu dàng đến rực rỡ', className: 'occasion-card--wide', query: 'Sinh nhật' },
  { label: 'Khai trương', note: 'Kệ, giỏ và lời chúc mới', className: 'occasion-card--tall', query: 'Khai trương' },
  { label: 'Tốt nghiệp', note: 'Cho cột mốc đáng nhớ', className: 'occasion-card--small', query: 'Tốt nghiệp' },
  { label: 'Tình yêu', note: 'Một lời nhắn bằng sắc hoa', className: 'occasion-card--small', query: 'Tình yêu' },
  { label: 'Chia buồn', note: 'Trang trọng và chân thành', className: 'occasion-card--small', query: 'Chia buồn' },
] as const;

const PROCESS_STEPS = [
  ['Chọn dịp và ngân sách', 'Bắt đầu từ điều bạn đã biết; không cần thuộc tên hoa hay kiểu dáng.'],
  ['Chọn mẫu hoa', 'Lưu mã hoặc đường dẫn mẫu để Lamie hiểu đúng hình ảnh bạn đang cân nhắc.'],
  ['Cá nhân hóa', 'Trao đổi màu, kích thước hoặc nội dung thiệp khi mẫu có hỗ trợ.'],
  ['Lamie xác nhận', 'Lamie xác nhận yêu cầu, khả năng chuẩn bị và các chi tiết cần thiết qua kênh liên hệ.'],
  ['Chuẩn bị và bó hoa', 'Mẫu được chuẩn bị sau khi hai bên đã thống nhất; thay hoa chỉ thực hiện khi khách đồng ý.'],
  ['Hoa được giao', 'Hoa tươi cần kiểm tra khu vực và phí giao; hoa sáp & lụa có thể giao toàn quốc.'],
  ['Người nhận nhận hoa', 'Hành trình khép lại ở người nhận, không phải ở một màn hình “đặt thành công” giả.'],
] as const;

export default function HomePage({ products, includeDemo, navigate, onContact }: HomePageProps) {
  const rootRef = useRef<HTMLElement>(null);
  const featured = products.filter((product) => product.featured).slice(0, 4);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.to('.hero-art__frame', {
        yPercent: -5,
        rotate: -0.5,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
      });
      gsap.to('.hero-paper--rose', {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
      });

      ScrollTrigger.create({
        trigger: '.process-layout',
        start: 'top 112px',
        end: 'bottom bottom-=120',
        pin: '.process-stage',
        pinSpacing: false,
      });

      gsap.utils.toArray<HTMLElement>('.process-card').forEach((card, index) => {
        gsap.fromTo(card, { y: 72, opacity: 0.72 }, {
          y: 0,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 82%', end: 'top 46%', scrub: 0.6 },
        });
        gsap.set(card, { zIndex: index + 1 });
      });
    });
    return () => media.revert();
  }, { scope: rootRef });

  return (
    <main ref={rootRef} id="main-content" className="home-page">
      {includeDemo ? (
        <div className="preview-notice" role="status">
          <span>Chế độ xem trước</span>
          <p>Catalog đang dùng 24 mẫu demo và giá kiểm thử. Production tự động loại toàn bộ dữ liệu này.</p>
        </div>
      ) : null}

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="content-draft-note">Câu chữ tạm — cần Lamie duyệt trước khi công bố</p>
          <h1 id="hero-title">
            <span>Hoa cho những điều</span>
            <span>bạn muốn <span className="inline-bloom" aria-hidden="true" /> nói.</span>
          </h1>
          <p>{BRAND_COPY.heroBody}</p>
          <div className="hero__actions">
            <AppLink href="/mau-hoa" navigate={navigate} className="button button--ink">Khám phá mẫu hoa <ArrowIcon /></AppLink>
            <button type="button" className="button button--text" onClick={() => onContact({ intent: 'Mình cần Lamie tư vấn chọn hoa' })}>Nhờ Lamie tư vấn <ArrowIcon /></button>
          </div>
          <dl className="hero__facts">
            <div><dt>Khu vực</dt><dd>TP.HCM · liên hệ trước khi đến</dd></div>
            <div><dt>Giờ mở cửa</dt><dd>{SITE_CONFIG.openingHours}</dd></div>
          </dl>
        </div>

        <div className="hero-art" aria-label="Ảnh concept Botanical Paper Editorial tạo cho hero Lamie">
          <div className="hero-paper hero-paper--sage" aria-hidden="true" />
          <div className="hero-paper hero-paper--rose" aria-hidden="true" />
          <figure className="hero-art__frame">
            <img src="/images/editorial/hero-botanical-editorial.webp" alt="Ảnh concept hoa kem, hồng phấn và xanh lam trên nền giấy thủ công" width="1122" height="1402" fetchPriority="high" />
            <figcaption>Ảnh concept tạo mới · cần Lamie duyệt trước khi công bố</figcaption>
          </figure>
          <span className="hero-art__line" aria-hidden="true" />
        </div>
      </section>

      <div className="occasion-marquee" aria-label="Các dịp có thể khám phá">
        <div className="occasion-marquee__track">
          <span>Sinh nhật</span><i /> <span>Khai trương</span><i /> <span>Tốt nghiệp</span><i /> <span>Kỷ niệm</span><i /> <span>Tình yêu</span><i /> <span>Cưới</span><i /> <span>Chúc mừng</span>
          <span aria-hidden="true">Sinh nhật</span><i aria-hidden="true" /> <span aria-hidden="true">Khai trương</span><i aria-hidden="true" /> <span aria-hidden="true">Tốt nghiệp</span><i aria-hidden="true" /> <span aria-hidden="true">Kỷ niệm</span><i aria-hidden="true" /> <span aria-hidden="true">Tình yêu</span><i aria-hidden="true" /> <span aria-hidden="true">Cưới</span><i aria-hidden="true" /> <span aria-hidden="true">Chúc mừng</span>
        </div>
      </div>

      <section className="section container-wide occasion-section" aria-labelledby="occasion-title">
        <div className="section-heading section-heading--split">
          <h2 id="occasion-title">Bắt đầu từ dịp bạn đang nghĩ đến.</h2>
          <p>Không cần biết trước tên hoa. Chọn một dịp để mở catalog với bộ lọc tương ứng, rồi tiếp tục thu hẹp theo màu, kiểu dáng hoặc dòng hoa.</p>
        </div>
        <div className="occasion-bento">
          {OCCASION_CARDS.map((occasion) => (
            <AppLink
              key={occasion.label}
              href={`/mau-hoa?dip=${encodeURIComponent(occasion.query)}`}
              navigate={navigate}
              className={`occasion-card ${occasion.className}`}
            >
              <span className="occasion-card__body"><strong>{occasion.label}</strong><small>{occasion.note}</small></span>
              <ArrowIcon />
            </AppLink>
          ))}
        </div>
      </section>

      <section className="section choice-section" aria-labelledby="choice-title">
        <div className="container-wide choice-grid">
          <div className="choice-copy">
            <h2 id="choice-title">Chọn theo cách tự nhiên nhất với bạn.</h2>
            <p>Theo ngân sách chưa có mốc production đã duyệt. Bạn có thể ghi khoảng dự kiến để Lamie tư vấn, hoặc đi thẳng vào dòng và kiểu dáng.</p>
            <button type="button" className="button button--outline" onClick={() => onContact({ intent: 'Mình muốn chọn hoa theo ngân sách dự kiến' })}>Tư vấn theo ngân sách <ArrowIcon /></button>
          </div>
          <div className="choice-panels">
            <AppLink href="/mau-hoa?dong=hoa-tuoi" navigate={navigate} className="choice-panel choice-panel--fresh">
              <span>Hoa tươi</span><strong>Hương sắc cho khoảnh khắc gần.</strong><small>Liên hệ Lamie để kiểm tra khu vực và phí giao.</small>
            </AppLink>
            <AppLink href="/mau-hoa?dong=hoa-sap-lua" navigate={navigate} className="choice-panel choice-panel--lasting">
              <span>Hoa sáp & lụa</span><strong>Một lựa chọn bền lâu.</strong><small>Giao toàn quốc · chi tiết được xác nhận khi tư vấn.</small>
            </AppLink>
          </div>
        </div>
      </section>

      <section className="section container-wide product-preview" aria-labelledby="preview-title">
        <div className="section-heading section-heading--split">
          <div>
            <h2 id="preview-title">Mẫu hoa Lamie</h2>
            <p>Một lần xem trước, không lặp thành nhiều khối “nổi bật” và “hiện có”.</p>
          </div>
          <AppLink href="/mau-hoa" navigate={navigate} className="text-link">Xem toàn bộ mẫu <ArrowIcon /></AppLink>
        </div>
        {featured.length ? (
          <div className="product-grid product-grid--preview">
            {featured.map((product, index) => <ProductCard key={product.id} product={product} navigate={navigate} priority={index < 2} />)}
          </div>
        ) : (
          <div className="honest-empty">
            <h3>Catalog production đang chờ dữ liệu thật.</h3>
            <p>Lamie cần bổ sung sản phẩm đã duyệt trước khi các mẫu được công bố. Bạn vẫn có thể liên hệ để được tư vấn.</p>
            <button type="button" className="button button--ink" onClick={() => onContact()}>Liên hệ Lamie</button>
          </div>
        )}
      </section>

      <section id="quy-trinh" className="section process-section" aria-labelledby="process-title">
        <div className="container-wide process-layout">
          <div className="process-stage">
            <h2 id="process-title">Từ một ý nghĩ đến lúc bó hoa được trao.</h2>
            <p>Bảy bước rõ ràng; Lamie luôn xác nhận trước khi chuẩn bị.</p>
            <div className="ribbon-visual" aria-hidden="true">
              <svg viewBox="0 0 420 260" role="img">
                <path d="M28 62C104 12 128 132 210 82s104 26 182-18" />
                <path d="M78 202c72-88 138 38 212-38 32-32 62-22 96 10" />
              </svg>
              <span className="ribbon-knot" />
            </div>
          </div>
          <ol className="process-cards">
            {PROCESS_STEPS.map(([title, body], index) => (
              <li key={title} className="process-card">
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{title}</h3><p>{body}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section story-section" aria-labelledby="story-title">
        <div className="container-wide story-grid">
          <figure>
            <img src="/images/editorial/story-florist-craft.webp" alt="Đôi tay người thợ đang cắt tỉa hoa trên bàn làm việc thủ công" width="1122" height="1402" loading="lazy" />
            <figcaption>Ảnh concept quy trình tạo mới · cần Lamie duyệt trước khi công bố</figcaption>
          </figure>
          <div>
            <p className="content-draft-note">Nội dung định hướng — chưa phải tuyên bố chính thức</p>
            <h2 id="story-title">{BRAND_COPY.storyTitle}</h2>
            <p>{BRAND_COPY.storyBody}</p>
            <ul className="verified-commitments">
              <li><CheckIcon /> Tư vấn theo dịp và ngân sách</li>
              <li><CheckIcon /> Xác nhận yêu cầu trước khi chuẩn bị</li>
              <li><CheckIcon /> Thông báo và xin ý kiến trước khi thay hoa</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="lien-he" className="section contact-section" aria-labelledby="contact-title">
        <div className="container-wide contact-section__inner">
          <div>
            <h2 id="contact-title">Bạn đã có dịp. Lamie cùng bạn tìm bó hoa.</h2>
            <p>Năm kênh liên hệ được trình bày ngang nhau trong bảng chọn. Website không gửi yêu cầu thay bạn.</p>
          </div>
          <div className="contact-section__actions">
            <button type="button" className="button button--paper" onClick={() => onContact()}>Chọn kênh liên hệ <ArrowIcon /></button>
            <a href={`tel:${SITE_CONFIG.hotlineValue}`} className="contact-phone">{SITE_CONFIG.hotlineDisplay}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
