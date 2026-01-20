
export type ViewState = 'home' | 'shop' | 'product' | 'member' | 'login';

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
