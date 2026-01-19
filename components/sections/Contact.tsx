import React from 'react';
import { SectionWrapper, Button, FadeIn } from '../ui/Base';

export const Contact: React.FC = () => {
  return (
    <SectionWrapper id="contact" className="bg-cream-100 py-32">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-16 rounded-lg shadow-sm border border-cream-200">
        <div className="text-center space-y-6 mb-12">
          <h2 className="font-serif text-4xl text-mocha-900">Liên Hệ</h2>
          <p className="font-body text-mocha-500">
            Cho ngày cưới, sự kiện, hay những đơn hàng thiết kế riêng, xin hãy nhắn tin cho chúng tôi.<br/>
            Lamie sẽ phản hồi nhẹ nhàng trong vòng 24 giờ.
          </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs uppercase tracking-widest text-mocha-300">Tên của bạn</label>
              <input 
                type="text" 
                id="name" 
                className="w-full border-b border-cream-200 py-2 focus:outline-none focus:border-mocha-500 transition-colors bg-transparent font-serif text-mocha-800"
                placeholder="Nhập tên"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs uppercase tracking-widest text-mocha-300">Email</label>
              <input 
                type="email" 
                id="email" 
                className="w-full border-b border-cream-200 py-2 focus:outline-none focus:border-mocha-500 transition-colors bg-transparent font-serif text-mocha-800"
                placeholder="email@cuaban.com"
              />
            </div>
          </div>
          
          <div className="space-y-2 pt-4">
             <label htmlFor="message" className="text-xs uppercase tracking-widest text-mocha-300">Lời nhắn</label>
             <textarea 
               id="message" 
               rows={4}
               className="w-full border-b border-cream-200 py-2 focus:outline-none focus:border-mocha-500 transition-colors bg-transparent font-serif text-mocha-800 resize-none"
               placeholder="Chia sẻ với Lamie về những bông hoa trong mơ của bạn..."
             ></textarea>
          </div>

          <div className="pt-8 text-center">
            <Button type="submit" className="w-full md:w-auto rounded-md">Gửi Tin Nhắn</Button>
          </div>
        </form>
      </div>
    </SectionWrapper>
  );
};