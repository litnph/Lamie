import { FlowerProduct } from '../types/index';

// Mock Data
const INITIAL_PRODUCTS: FlowerProduct[] = [
  { 
    id: '1', name: 'Sương Sớm', price: '450.000₫', category: 'Thường Ngày', 
    image: 'https://picsum.photos/id/360/600/800', 
    description: 'Một sự sắp đặt nhẹ nhàng với tông màu xanh và trắng.',
    additionalImages: ['https://picsum.photos/id/361/600/800', 'https://picsum.photos/id/362/600/800']
  },
  { 
    id: '2', name: 'Hồng Cổ Điển', price: '650.000₫', category: 'Dịp Đặc Biệt', 
    image: 'https://picsum.photos/id/152/600/800', 
    description: 'Những đóa hồng màu phấn cũ kết hợp cùng lá khuynh diệp khô.',
    additionalImages: ['https://picsum.photos/id/153/600/800']
  },
  { 
    id: '3', name: 'Bài Thơ Trắng', price: '850.000₫', category: 'Tiệc Cưới', 
    image: 'https://picsum.photos/id/306/600/800', 
    description: 'Một tác phẩm thanh lịch với hoa ly trắng, mao lương.',
    additionalImages: []
  },
  { 
    id: '4', name: 'Vườn Hoang Dại', price: '550.000₫', category: 'Thường Ngày', 
    image: 'https://picsum.photos/id/400/600/800', 
    description: 'Sự pha trộn vui tươi của hoa dại và lá xanh theo mùa.',
    additionalImages: []
  },
  { 
    id: '5', name: 'Mẫu Đơn Kiêu Sa', price: '950.000₫', category: 'Dịp Đặc Biệt', 
    image: 'https://picsum.photos/id/364/600/800', 
    description: 'Những đóa mẫu đơn hồng rực rỡ chiếm trọn spotlight.',
    additionalImages: []
  },
  { 
    id: '6', name: 'Lời Thì Thầm', price: '700.000₫', category: 'Hoa Khô', 
    image: 'https://picsum.photos/id/106/600/800', 
    description: 'Một bình hoa khô bền lâu với tông màu đất ấm áp.',
    additionalImages: []
  },
  { 
    id: '7', name: 'Đỏ Cổ Điển', price: '1.200.000₫', category: 'Kỷ Niệm', 
    image: 'https://picsum.photos/id/292/600/800', 
    description: 'Những bông hồng đỏ thẫm được sắp xếp theo phong cách đặc trưng.',
    additionalImages: []
  },
  { 
    id: '8', name: 'Giấc Mơ Tím', price: '600.000₫', category: 'Thường Ngày', 
    image: 'https://picsum.photos/id/111/600/800', 
    description: 'Sắc tím nhẹ nhàng và màu oải hương.',
    additionalImages: []
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ProductService = {
  getAll: async (): Promise<FlowerProduct[]> => {
    // Check local storage first (simulating database persistence)
    const saved = localStorage.getItem('lamie_products');
    await delay(600); // Simulate network latency
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  },

  saveAll: async (products: FlowerProduct[]): Promise<void> => {
    await delay(300);
    localStorage.setItem('lamie_products', JSON.stringify(products));
  }
};

export const ChatService = {
  // Simulate connecting to a WebSocket
  connect: () => {
    console.log('ChatService: Connecting to WebSocket...');
    return true;
  },
  
  // Simulate sending a message to a bot/admin
  sendMessage: async (text: string) => {
    await delay(1000); // Bot thinking time
    return {
      text: `Cảm ơn bạn đã nhắn tin: "${text}". Nhân viên Lamie sẽ phản hồi sớm nhất có thể ạ!`,
      sender: 'bot',
      timestamp: Date.now()
    };
  }
};
