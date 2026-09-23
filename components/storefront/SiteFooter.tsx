import { SITE_CONFIG } from '../../app/site-config';
import { AppLink } from './AppLink';
import { ArrowIcon, FlowerMark } from './Icons';

interface SiteFooterProps {
  navigate: (to: string) => void;
  onContact: () => void;
}

export const SiteFooter = ({ navigate, onContact }: SiteFooterProps) => (
  <footer className="site-footer">
    <div className="site-footer__lead container-wide">
      <h2>Một bó hoa bắt đầu từ một lời nhắn.</h2>
      <button type="button" className="button button--paper" onClick={onContact}>Bắt đầu cùng Lamie <ArrowIcon /></button>
    </div>
    <div className="site-footer__grid container-wide">
      <div className="footer-brand">
        <FlowerMark />
        <strong>Lamie</strong>
        <p>Showroom hoa số để khám phá mẫu và chuẩn bị thông tin trước khi liên hệ.</p>
      </div>
      <div>
        <h3>Khám phá</h3>
        <AppLink href="/mau-hoa" navigate={navigate}>Mẫu hoa Lamie</AppLink>
        <AppLink href="/#quy-trinh" navigate={navigate}>Quy trình đặt hoa</AppLink>
        <button type="button" className="footer-link-button" onClick={onContact}>Nhờ Lamie tư vấn</button>
      </div>
      <div>
        <h3>Liên hệ</h3>
        <a href={`tel:${SITE_CONFIG.hotlineValue}`}>{SITE_CONFIG.hotlineDisplay}</a>
        <a href={SITE_CONFIG.instagramUrl} target="_blank" rel="noreferrer">Instagram {SITE_CONFIG.instagramHandle}</a>
        <a href={SITE_CONFIG.tiktokUrl} target="_blank" rel="noreferrer">TikTok {SITE_CONFIG.tiktokHandle}</a>
      </div>
      <div>
        <h3>Ghé Lamie</h3>
        <p>{SITE_CONFIG.address}</p>
        <p>{SITE_CONFIG.openingHours}</p>
        <p>Vui lòng liên hệ trước khi đến.</p>
      </div>
    </div>
    <div className="site-footer__base container-wide">
      <span>© 2026 Lamie</span>
      <span>Website tĩnh · Không thanh toán trực tuyến</span>
    </div>
  </footer>
);
