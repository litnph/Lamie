import { AppLink } from '../../components/storefront/AppLink';
import { ArrowIcon } from '../../components/storefront/Icons';

interface NotFoundPageProps { navigate: (to: string) => void }

export default function NotFoundPage({ navigate }: NotFoundPageProps) {
  return (
    <main id="main-content" className="not-found-page container-wide">
      <div>
        <p>Trang không tìm thấy</p>
        <h1>Đường dẫn này không nằm trong khu vườn của Lamie.</h1>
        <p>Quay lại trang chủ hoặc mở Mẫu hoa Lamie để tiếp tục khám phá.</p>
        <div className="not-found-actions">
          <AppLink href="/" navigate={navigate} className="button button--ink">Về trang chủ <ArrowIcon /></AppLink>
          <AppLink href="/mau-hoa" navigate={navigate} className="button button--outline">Xem mẫu hoa</AppLink>
        </div>
      </div>
      <div className="not-found-art" aria-hidden="true"><span /><i /><b /></div>
    </main>
  );
}
