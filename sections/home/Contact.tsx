
import React from 'react';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/ui/Card';
import { TextAreaField, TextField } from '../../components/ui/FormControls';

type Lang = 'vi' | 'en';

export const Contact: React.FC<{ lang: Lang }> = ({ lang }) => (
  <SectionWrapper id="contact" className="bg-cream-100 py-32">
    <Card surface="outlined" padding="lg" className="mx-auto max-w-2xl">
      <h2 className="font-serif text-4xl text-center mb-6">
        {lang === 'vi' ? 'Lien he Lamie' : 'Contact Lamie'}
      </h2>
      <div className="space-y-2 text-center mb-10 text-mocha-600 text-sm">
        <p>
          {lang === 'vi'
            ? 'Can tu van mau hoa, thong diep, hoac hoa theo dip? Gui Lamie mot loi nhan.'
            : 'Need help with flower tones, card wording, or occasion-based picks? Send Lamie a message.'}
        </p>
        <p>{lang === 'vi' ? 'Doi ngu se phan hoi nhanh trong gio lam viec.' : 'Our team replies quickly during business hours.'}</p>
      </div>
      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <TextField id="contact-name" name="name" label={lang === 'vi' ? 'Ho va ten' : 'Full name'} autoComplete="name" />
           <TextField id="contact-phone" name="phone" label={lang === 'vi' ? 'So dien thoai' : 'Phone number'} type="tel" autoComplete="tel" />
        </div>
        <TextAreaField
          id="contact-message"
          name="message"
          label={lang === 'vi' ? 'Loi nhan' : 'Message'}
          placeholder={lang === 'vi' ? 'Lamie co the ho tro ban dieu gi hom nay?' : 'How can Lamie help you today?'}
          rows={4}
        />
        <div className="text-center pt-8">
           <Button className="w-full md:w-auto">{lang === 'vi' ? 'Gui tin nhan' : 'Send message'}</Button>
        </div>
      </form>
    </Card>
  </SectionWrapper>
);
