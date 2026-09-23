export interface TaxonomyOption {
  id: string;
  label: string;
}

export const TAXONOMY = {
  lines: [
    { id: 'hoa-tuoi', label: 'Hoa tươi' },
    { id: 'hoa-sap-lua', label: 'Hoa sáp & lụa' },
  ],
  forms: [
    { id: 'bo-hoa', label: 'Bó hoa' },
    { id: 'ke-hoa', label: 'Kệ hoa' },
    { id: 'ke-mini', label: 'Kệ mini' },
    { id: 'gio-hoa', label: 'Giỏ hoa' },
    { id: 'hop-hoa', label: 'Hộp/Box hoa' },
    { id: 'binh-hoa', label: 'Bình hoa' },
    { id: 'lang-hoa', label: 'Lẵng hoa' },
  ],
  occasions: [
    'Sinh nhật', 'Khai trương', 'Chia buồn', 'Tốt nghiệp', 'Kỷ niệm',
    'Tình yêu', 'Cầu hôn', 'Cưới', 'Chúc mừng', 'Thăm hỏi',
  ],
  flowers: ['Hoa hồng', 'Tulip', 'Cẩm tú cầu', 'Hướng dương', 'Hoa baby', 'Hoa lan', 'Mẫu đơn', 'Hoa lam tinh'],
  colors: ['Đỏ', 'Hồng', 'Trắng/Kem', 'Vàng', 'Cam', 'Xanh dương', 'Xanh lá', 'Tím'],
  palettes: ['Pastel', 'Phối nhiều màu'],
  styles: ['Garden', 'Tối giản', 'Vintage', 'Hàn Quốc', 'Sang trọng', 'Tự nhiên'],
  collections: ['Mùa dịu dàng', 'Sắc nắng', 'Khoảnh khắc xanh'],
  statuses: [
    { id: 'dang-nhan-dat', label: 'Đang nhận đặt' },
    { id: 'dat-truoc', label: 'Đặt trước' },
    { id: 'theo-mua', label: 'Theo mùa' },
    { id: 'tam-ngung', label: 'Tạm ngưng' },
  ],
} as const;

export const labelFor = (group: 'lines' | 'forms' | 'statuses', id: string): string =>
  TAXONOMY[group].find((option) => option.id === id)?.label ?? id;
