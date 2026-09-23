export const SITE_CONFIG = {
  name: 'Lamie',
  hotlineDisplay: '0906 445 004',
  hotlineValue: '0906445004',
  instagramHandle: '@tiemhoalamie',
  instagramUrl: 'https://www.instagram.com/tiemhoalamie/',
  tiktokHandle: '@tiemhoalamie',
  tiktokUrl: 'https://www.tiktok.com/@tiemhoalamie',
  zaloUrl: 'https://zalo.me/0906445004',
  facebookUrl: 'https://www.facebook.com/share/1EBqxaAM2y/',
  facebookEnabled: true,
  address: 'MT Eastmark City, phường Long Trường, TP. Thủ Đức',
  openingHours: '08:00–21:00 hằng ngày',
} as const;

export const BRAND_COPY = {
  needsApproval: true,
  heroTitle: 'Hoa cho những điều bạn muốn nói.',
  heroBody: 'Khám phá mẫu theo dịp, kiểu dáng và sắc hoa — rồi để Lamie cùng bạn xác nhận từng chi tiết trước khi chuẩn bị.',
  storyTitle: 'Một khoảng lặng để chọn hoa thật vừa ý.',
  storyBody: 'Lamie đang hoàn thiện câu chuyện thương hiệu. Trong lúc chờ nội dung chính thức, website tập trung vào việc giúp bạn tìm mẫu rõ ràng và liên hệ với đủ ngữ cảnh.',
} as const;

export const CONTACT_CHANNELS = [
  { id: 'instagram', label: 'Instagram', detail: SITE_CONFIG.instagramHandle, href: SITE_CONFIG.instagramUrl },
  { id: 'tiktok', label: 'TikTok', detail: SITE_CONFIG.tiktokHandle, href: SITE_CONFIG.tiktokUrl },
  { id: 'phone', label: 'Gọi hotline', detail: SITE_CONFIG.hotlineDisplay, href: `tel:${SITE_CONFIG.hotlineValue}` },
  { id: 'zalo', label: 'Zalo', detail: SITE_CONFIG.hotlineDisplay, href: SITE_CONFIG.zaloUrl },
  { id: 'facebook', label: 'Facebook', detail: 'Trang Lamie', href: SITE_CONFIG.facebookUrl },
] as const;

export type ContactChannel = (typeof CONTACT_CHANNELS)[number];
