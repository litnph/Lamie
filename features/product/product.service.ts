
import { FlowerProduct } from './product.type';

const INITIAL_PRODUCTS: FlowerProduct[] = [
  { 
    id: '1', name: 'Morning Dew', price: '450.000₫', category: 'Daily', 
    image: 'https://picsum.photos/id/360/600/800', 
    description: 'A gentle arrangement of greens and whites, reminiscent of a fresh, dewy morning. Perfect for brightening up a breakfast table or desk.',
    additionalImages: ['https://picsum.photos/id/361/600/800', 'https://picsum.photos/id/362/600/800']
  },
  { 
    id: '2', name: 'Vintage Rose', price: '650.000₫', category: 'Special', 
    image: 'https://picsum.photos/id/152/600/800', 
    description: 'Dusty pink roses paired with dried eucalyptus. A timeless bouquet that evokes nostalgia and romance.',
    additionalImages: ['https://picsum.photos/id/153/600/800']
  },
  { 
    id: '3', name: 'White Poem', price: '850.000₫', category: 'Wedding', 
    image: 'https://picsum.photos/id/306/600/800', 
    description: 'An elegant composition of white lilies and ranunculus. Pure, sophisticated, and serene.',
    additionalImages: []
  },
  { 
    id: '4', name: 'Wild Garden', price: '550.000₫', category: 'Daily', 
    image: 'https://picsum.photos/id/400/600/800', 
    description: 'A playful mix of seasonal wildflowers and foliage. Designed to look as if it was just gathered from a sunlit meadow.',
    additionalImages: []
  },
  { 
    id: '5', name: 'Elegant Peony', price: '950.000₫', category: 'Special', 
    image: 'https://picsum.photos/id/364/600/800', 
    description: 'Vibrant pink peonies take center stage in this luxurious arrangement. Available only in late spring and early summer.',
    additionalImages: []
  },
  { 
    id: '6', name: 'The Whisper', price: '700.000₫', category: 'Dried', 
    image: 'https://picsum.photos/id/106/600/800', 
    description: 'A long-lasting dried flower arrangement in warm earth tones.',
    additionalImages: []
  },
  { 
    id: '7', name: 'Classic Red', price: '1.200.000₫', category: 'Anniversary', 
    image: 'https://picsum.photos/id/292/600/800', 
    description: 'Deep red roses arranged in Lamie signature style—organic, loose, and incredibly romantic.',
    additionalImages: []
  },
  { 
    id: '8', name: 'Purple Dream', price: '600.000₫', category: 'Daily', 
    image: 'https://picsum.photos/id/111/600/800', 
    description: 'Soft purples and lavender shades mixed with fragrant herbs.',
    additionalImages: []
  },
];

export const ProductService = {
  async getAll(): Promise<FlowerProduct[]> {
    // Simulating API latency
    await new Promise(r => setTimeout(r, 600));
    const saved = localStorage.getItem('lamie_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  },
  async saveAll(products: FlowerProduct[]): Promise<void> {
    await new Promise(r => setTimeout(r, 300));
    localStorage.setItem('lamie_products', JSON.stringify(products));
  }
};
