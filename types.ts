
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
  span?: boolean; // For grid layout variation
}

export type SectionId = 'home' | 'about' | 'collections' | 'signature' | 'gallery' | 'contact';
