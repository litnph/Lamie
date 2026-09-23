import { useEffect, useMemo, useState } from 'react';
import { CONTACT_CHANNELS, SITE_CONFIG } from '../../app/site-config';
import { trackEvent } from '../../app/analytics';
import { Dialog } from './Dialog';
import { CheckIcon, CopyIcon, ExternalIcon, PhoneIcon } from './Icons';

export interface ContactContext {
  sku?: string;
  productName?: string;
  productUrl?: string;
  intent?: string;
}

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
  context?: ContactContext;
}

interface ContactFormState {
  receiveDate: string;
  budget: string;
  deliveryArea: string;
  cardMessage: string;
  note: string;
}

const EMPTY_FORM: ContactFormState = { receiveDate: '', budget: '', deliveryArea: '', cardMessage: '', note: '' };

export const ContactDialog = ({ open, onClose, context }: ContactDialogProps) => {
  const [form, setForm] = useState<ContactFormState>(EMPTY_FORM);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle');

  useEffect(() => {
    if (open) setCopyState('idle');
  }, [open]);

  const summary = useMemo(() => {
    const lines = ['Xin chào Lamie, mình muốn được tư vấn đặt hoa.'];
    if (context?.intent) lines.push(`Nhu cầu: ${context.intent}`);
    if (context?.productName || context?.sku) lines.push(`Mẫu: ${context.productName ?? ''}${context.sku ? ` (${context.sku})` : ''}`.trim());
    if (context?.productUrl) lines.push(`Link mẫu: ${context.productUrl}`);
    if (form.receiveDate) lines.push(`Ngày nhận dự kiến: ${form.receiveDate}`);
    if (form.budget) lines.push(`Ngân sách dự kiến: ${form.budget}`);
    if (form.deliveryArea) lines.push(`Khu vực/địa chỉ giao: ${form.deliveryArea}`);
    if (form.cardMessage) lines.push(`Nội dung thiệp: ${form.cardMessage}`);
    if (form.note) lines.push(`Ghi chú: ${form.note}`);
    lines.push('Nhờ Lamie kiểm tra và xác nhận giúp mình nhé.');
    return lines.join('\n');
  }, [context, form]);

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopyState('copied');
    } catch {
      setCopyState('manual');
    }
  };

  const openChannel = async (channelId: string, href: string) => {
    trackEvent({ event: 'contact_channel', label: channelId });
    if (channelId !== 'phone') await copySummary();
    window.open(href, channelId === 'phone' ? '_self' : '_blank', 'noopener,noreferrer');
  };

  const channels = CONTACT_CHANNELS.filter((channel) => channel.id !== 'facebook' || SITE_CONFIG.facebookEnabled);

  return (
    <Dialog open={open} title="Liên hệ cùng Lamie" onClose={onClose} className="contact-dialog">
      <div className="contact-dialog__intro">
        <p>Chọn kênh phù hợp. Các trường dưới đây đều không bắt buộc và chỉ dùng để tạo nội dung bạn có thể sao chép.</p>
        {context?.productName ? <p className="contact-context">Đang hỏi về <strong>{context.productName}</strong>{context.sku ? ` · ${context.sku}` : ''}</p> : null}
      </div>

      <div className="contact-form-grid">
        <label>Ngày nhận dự kiến<input type="date" value={form.receiveDate} onChange={(event) => setForm({ ...form, receiveDate: event.target.value })} /></label>
        <label>Ngân sách dự kiến<input type="text" inputMode="numeric" placeholder="Ví dụ: khoảng ngân sách của bạn" value={form.budget} onChange={(event) => setForm({ ...form, budget: event.target.value })} /></label>
        <label className="field-wide">Khu vực/địa chỉ giao<input type="text" autoComplete="street-address" placeholder="Lamie sẽ kiểm tra khu vực và phí giao" value={form.deliveryArea} onChange={(event) => setForm({ ...form, deliveryArea: event.target.value })} /></label>
        <label className="field-wide">Nội dung trên thiệp<textarea rows={2} value={form.cardMessage} onChange={(event) => setForm({ ...form, cardMessage: event.target.value })} /></label>
        <label className="field-wide">Ghi chú thêm<textarea rows={2} value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} /></label>
      </div>

      <div className="summary-panel">
        <div>
          <h3>Nội dung chuẩn bị</h3>
          <p>Lamie chưa nhận được gì cho đến khi bạn tự gửi qua một kênh bên dưới.</p>
        </div>
        <button type="button" className="button button--outline" onClick={copySummary}>
          {copyState === 'copied' ? <CheckIcon /> : <CopyIcon />}
          {copyState === 'copied' ? 'Đã sao chép' : 'Sao chép nội dung'}
        </button>
        {copyState === 'manual' ? <textarea className="manual-copy" readOnly value={summary} aria-label="Nội dung để sao chép thủ công" /> : null}
      </div>

      <div className="channel-grid" aria-label="Các kênh liên hệ">
        {channels.map((channel) => (
          <button type="button" key={channel.id} onClick={() => void openChannel(channel.id, channel.href)}>
            <span className="channel-icon">{channel.id === 'phone' ? <PhoneIcon /> : <ExternalIcon />}</span>
            <strong>{channel.label}</strong>
            <small>{channel.detail}</small>
          </button>
        ))}
      </div>
      <p className="privacy-note">Không lưu địa chỉ, ngân sách, nội dung thiệp hoặc ghi chú vào backend hay analytics.</p>
    </Dialog>
  );
};
