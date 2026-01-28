export type Category = 'ring-slings' | 'wraps' | 'buckle-carriers' | 'onbuhimo';

export interface Carrier {
  id: string;
  brand_name: string;
  model_name: string;
  category: Category;
  age_range: string;
  weight_range: string;
  weekly_rent: number;
  monthly_rent: number;
  refundable_deposit: number;
  buyout_price: number;
  condition: string;
  carry_positions: string[];
  description: string | null;
  laundry_instructions: string | null;
  images: string[];
  availability_status: 'available' | 'rented';
  next_available_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingRequest {
  id: string;
  carrier_id: string;
  customer_name: string;
  phone: string;
  city: string;
  start_date: string;
  duration: 'weekly' | 'monthly';
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  agreed_to_terms: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryInfo {
  slug: Category;
  name: string;
  description: string;
  image: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: 'ring-slings',
    name: 'Ring Slings',
    description: 'Perfect for quick ups and nursing, ideal for newborns to toddlers',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop'
  },
  {
    slug: 'wraps',
    name: 'Wraps',
    description: 'Versatile and cozy, offering multiple carrying positions',
    image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=400&fit=crop'
  },
  {
    slug: 'buckle-carriers',
    name: 'Buckle Carriers',
    description: 'Easy to use with adjustable buckles, great for beginners',
    image: 'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=600&h=400&fit=crop'
  },
  {
    slug: 'onbuhimo',
    name: 'Onbuhimo',
    description: 'Traditional Japanese style, perfect for back carries',
    image: 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=600&h=400&fit=crop'
  }
];

export const getCategoryName = (slug: Category): string => {
  return CATEGORIES.find(c => c.slug === slug)?.name || slug;
};
