import React from 'react';
import { SectionWrapper, FadeIn, LeafIcon } from '../ui/Base';
import { Testimonial } from '../../types';

export const About: React.FC = () => {
  return (
    <SectionWrapper id="about" className="bg-cream-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">
        {/* Image Side */}
        <FadeIn className="relative pl-4 pt-4">
           {/* Decorative background border */}
           <div className="absolute top-0 left-0 w-full h-full border border-mocha-200 rounded-lg -z-10 transform -translate-x-4 -translate-y-4"></div>
           
           <div className="relative rounded-lg overflow-hidden aspect-[3/4] shadow-sm">
             <img 
               src="https://public.readdy.ai/ai/img_res/31107d7838c235c0a0448ed48724ad1c.jpg" 
               alt="Nghệ thuật cắm hoa" 
               className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]"
             />
           </div>
        </FadeIn>

        {/* Text Side */}
        <FadeIn delay={200} className="flex flex-col justify-center h-full pt-8 md:pt-12">
          <div className="mb-8">
            <span className="block text-xs font-body tracking-[0.25em] text-mocha-300 uppercase mb-4">Câu Chuyện</span>
            <h2 className="font-serif text-5xl text-mocha-900 mb-6">Về Lamie</h2>
            <div className="w-12 h-[1px] bg-mocha-800"></div>
          </div>
          
          <div className="space-y-6 font-body text-mocha-500 text-lg leading-relaxed">
            <p>
              Lamie được sinh ra từ một niềm tin giản đơn: rằng hoa không chỉ là vật trang trí, 
              mà là những người bạn dịu dàng mang chất thơ vào cuộc sống thường nhật.
            </p>
            <p>
              Mỗi sớm mai, chúng tôi cẩn thận chọn lựa những đóa hoa tươi nhất, sắp xếp chúng 
              với tất cả sự chú tâm. Những bó hoa thủ công của Lamie được tạo ra để lưu giữ 
              vẻ đẹp tĩnh lặng của thiên nhiên, mang đến sự ấm áp và an yên cho khoảnh khắc của bạn.
            </p>
            <p>
              Chúng tôi tin vào ngôn ngữ của loài hoa—khả năng diễn đạt những điều mà lời nói 
              chẳng thể gọi tên. Mỗi bình hoa đều kể một câu chuyện, thì thầm một cảm xúc, 
              và vương vấn mãi trong ký ức.
            </p>
          </div>
        </FadeIn>
      </div>
    </SectionWrapper>
  );
};

export const WhyChoose: React.FC = () => {
  const features = [
    { title: "Tuyển Chọn Tươi Mới", desc: "Được tuyển chọn hàng ngày từ các nhà vườn địa phương để đảm bảo độ bền lâu nhất." },
    { title: "Thiết Kế Nghệ Thuật", desc: "Mỗi bó hoa được xem như một tác phẩm nghệ thuật sống động và độc bản." },
    { title: "Sống Xanh", desc: "Sử dụng bao bì thân thiện môi trường và hạn chế xốp cắm hoa tối đa." },
  ];

  return (
    <SectionWrapper className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {features.map((f, i) => (
          <FadeIn key={i} delay={i * 200} className="text-center p-8 border border-cream-200 rounded-lg hover:border-mocha-300 transition-colors duration-500">
            <div className="w-12 h-12 bg-cream-100 rounded-full mx-auto mb-6 flex items-center justify-center text-mocha-500">
              <LeafIcon className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl text-mocha-900 mb-3">{f.title}</h3>
            <p className="font-body text-mocha-500 text-sm leading-relaxed">{f.desc}</p>
          </FadeIn>
        ))}
      </div>
    </SectionWrapper>
  );
};

export const Testimonials: React.FC = () => {
  const reviews: Testimonial[] = [
    { id: '1', text: "Bó hoa mình đặt tặng mẹ thực sự đẹp như một bài thơ. Màu sắc rất nhẹ nhàng và cách gói vô cùng tinh tế.", author: "Minh Anh", location: "Hà Nội" },
    { id: '2', text: "Lamie có một gu thẩm mỹ rất riêng mà mình chưa tìm thấy ở đâu khác. Cảm giác rất cá nhân và gần gũi.", author: "Thảo Vy", location: "TP. Hồ Chí Minh" },
    { id: '3', text: "Mình đặt hoa định kỳ hàng tuần và nó làm sáng bừng studio mỗi thứ Hai. Thực sự là những bông hoa dịu dàng.", author: "Hoàng Nam", location: "Đà Nẵng" },
  ];

  return (
    <SectionWrapper className="bg-cream-100 relative">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent opacity-50"></div>
      
      <div className="text-center mb-16">
        <h2 className="font-serif text-4xl text-mocha-900">Lời Nhắn Yêu Thương</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((review, i) => (
          <FadeIn key={review.id} delay={i * 150} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-500 relative border border-cream-200">
            <span className="absolute top-6 left-6 text-6xl font-serif text-cream-200">“</span>
            <p className="font-body text-mocha-500 leading-loose relative z-10 mb-6 pt-4">
              {review.text}
            </p>
            <div className="flex items-center gap-3 border-t border-cream-200 pt-4">
               <div className="w-8 h-8 rounded-full bg-mocha-100 flex items-center justify-center text-white text-xs font-serif">
                 {review.author[0]}
               </div>
               <div className="flex flex-col text-left">
                  <span className="font-serif text-mocha-900 text-sm">{review.author}</span>
                  <span className="font-body text-xs text-mocha-300">{review.location}</span>
               </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </SectionWrapper>
  );
};