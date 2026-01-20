export interface FlowerProduct {
  id: string;
  name: string;
  price: string;
  category: string;
  image: string;
  description: string;
  additionalImages?: string[];
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  location: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  span?: boolean;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'support';
  timestamp: number;
}

export type ViewState = 'home' | 'shop' | 'product' | 'admin' | 'login';
