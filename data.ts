import { FlowerProduct } from './types';

export const PRODUCTS: FlowerProduct[] = [
  { 
    id: '1', 
    name: 'Sương Sớm', 
    price: '450.000₫', 
    category: 'Thường Ngày', 
    image: 'https://picsum.photos/id/360/600/800', 
    additionalImages: [
      'https://picsum.photos/id/361/600/800',
      'https://picsum.photos/id/362/600/800',
      'https://picsum.photos/id/10/600/800'
    ],
    description: 'Một sự sắp đặt nhẹ nhàng với tông màu xanh và trắng, gợi nhớ đến buổi sáng trong lành đầy sương. Hoàn hảo để làm sáng bừng bàn ăn hoặc góc làm việc của bạn.' 
  },
  { 
    id: '2', 
    name: 'Hồng Cổ Điển', 
    price: '650.000₫', 
    category: 'Dịp Đặc Biệt', 
    image: 'https://picsum.photos/id/152/600/800', 
    additionalImages: [
      'https://picsum.photos/id/153/600/800',
      'https://picsum.photos/id/154/600/800',
      'https://picsum.photos/id/155/600/800'
    ],
    description: 'Những đóa hồng màu phấn cũ kết hợp cùng lá khuynh diệp khô. Một bó hoa vượt thời gian gợi lên sự hoài cổ và lãng mạn.' 
  },
  { 
    id: '3', 
    name: 'Bài Thơ Trắng', 
    price: '850.000₫', 
    category: 'Tiệc Cưới', 
    image: 'https://picsum.photos/id/306/600/800', 
    additionalImages: [
      'https://picsum.photos/id/307/600/800',
      'https://picsum.photos/id/308/600/800'
    ],
    description: 'Một tác phẩm thanh lịch với hoa ly trắng, mao lương và những bông hoa nhỏ tinh tế. Thuần khiết, sang trọng và bình yên.' 
  },
  { 
    id: '4', 
    name: 'Vườn Hoang Dại', 
    price: '550.000₫', 
    category: 'Thường Ngày', 
    image: 'https://picsum.photos/id/400/600/800', 
    additionalImages: [
      'https://picsum.photos/id/401/600/800',
      'https://picsum.photos/id/402/600/800'
    ],
    description: 'Sự pha trộn vui tươi của hoa dại và lá xanh theo mùa. Được thiết kế như thể vừa được hái vội từ một đồng cỏ đầy nắng.' 
  },
  { 
    id: '5', 
    name: 'Mẫu Đơn Kiêu Sa', 
    price: '950.000₫', 
    category: 'Dịp Đặc Biệt', 
    image: 'https://picsum.photos/id/364/600/800', 
    additionalImages: [
      'https://picsum.photos/id/365/600/800',
      'https://picsum.photos/id/366/600/800'
    ],
    description: 'Những đóa mẫu đơn hồng rực rỡ chiếm trọn "spotlight" trong thiết kế sang trọng này. Chỉ có sẵn vào cuối xuân và đầu hè.' 
  },
  { 
    id: '6', 
    name: 'Lời Thì Thầm Mùa Thu', 
    price: '700.000₫', 
    category: 'Hoa Khô', 
    image: 'https://picsum.photos/id/106/600/800', 
    description: 'Một bình hoa khô bền lâu với tông màu đất ấm áp, cỏ lau khô và đài sen.' 
  },
  { 
    id: '7', 
    name: 'Đỏ Cổ Điển', 
    price: '1.200.000₫', 
    category: 'Kỷ Niệm', 
    image: 'https://picsum.photos/id/292/600/800', 
    description: 'Những bông hồng đỏ thẫm được sắp xếp theo phong cách đặc trưng của Lamie—tự nhiên, phóng khoáng và vô cùng lãng mạn.' 
  },
  { 
    id: '8', 
    name: 'Giấc Mơ Tím', 
    price: '600.000₫', 
    category: 'Thường Ngày', 
    image: 'https://picsum.photos/id/111/600/800', 
    description: 'Sắc tím nhẹ nhàng và màu oải hương pha trộn với các loại thảo mộc thơm ngát. Một bó hoa xoa dịu tâm hồn cho mọi không gian.' 
  },
];