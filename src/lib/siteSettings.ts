export interface SiteFeature {
  icon: string;
  title: string;
  description: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
}

export interface MenuItem {
  name: string;
  href: string;
}

export interface FooterLink {
  name: string;
  href: string;
}

export interface SiteSettings {
  id: string;
  
  // Branding
  logo_url: string | null;
  brand_name: string;
  tagline: string | null;
  
  // Colors (HSL values)
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  foreground_color: string;
  
  // Contact
  whatsapp_number: string;
  whatsapp_message: string | null;
  email: string | null;
  instagram_url: string | null;
  
  // Hero Section
  hero_title: string;
  hero_subtitle: string | null;
  hero_image_url: string | null;
  hero_cta_text: string | null;
  hero_cta_link: string | null;
  
  // Features
  features: SiteFeature[];
  
  // How It Works
  how_it_works_title: string | null;
  how_it_works_steps: HowItWorksStep[];
  
  // Categories Section
  categories_title: string | null;
  categories_subtitle: string | null;
  
  // Navigation
  menu_items: MenuItem[];
  
  // Footer
  footer_description: string | null;
  footer_links: FooterLink[];
  
  // Content Pages
  policy_content: string | null;
  safety_content: string | null;
  
  // SEO
  meta_title: string | null;
  meta_description: string | null;
  
  created_at: string;
  updated_at: string;
}

export const DEFAULT_SETTINGS: Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'> = {
  logo_url: null,
  // Match your live branding so there is no flash on refresh before settings load.
  brand_name: 'Sheryl Slings',
  tagline: 'Sling Library',
  primary_color: '25 95% 53%',
  secondary_color: '30 60% 96%',
  accent_color: '25 90% 48%',
  background_color: '30 50% 98%',
  foreground_color: '25 40% 15%',
  whatsapp_number: '919876543210',
  whatsapp_message: 'Hi! I am interested in renting a baby carrier.',
  email: null,
  instagram_url: null,
  hero_title: 'Sheryl Slings & Sling Library',
  hero_subtitle: 'Try premium baby carriers before you buy. Rent weekly or monthly with free fit checks and sanitization included.',
  hero_image_url: null,
  hero_cta_text: 'Browse Collection',
  // Homepage now shows all products with filters.
  hero_cta_link: '/',
  features: [
    { icon: 'Award', title: 'Premium Brands', description: 'Curated collection of trusted carriers' },
    { icon: 'Shield', title: 'Sanitized', description: 'Deep cleaned between every rental' },
    { icon: 'Heart', title: 'Free Fit Checks', description: 'Virtual support for perfect fit' },
  ],
  how_it_works_title: 'How It Works',
  how_it_works_steps: [
    { step: 1, title: 'Browse & Choose', description: 'Explore our curated collection of baby carriers' },
    { step: 2, title: 'Book via WhatsApp', description: 'Send us a message to reserve your carrier' },
    { step: 3, title: 'Receive & Try', description: 'Get your carrier delivered with fit support' },
    { step: 4, title: 'Return or Buy', description: 'Return when done or buy if you love it' },
  ],
  categories_title: 'Browse by Category',
  categories_subtitle: 'Find the perfect carrier for your needs',
  menu_items: [
    { name: 'Home', href: '/' },
    { name: 'Policies', href: '/policies' },
    { name: 'Safety', href: '/safety' },
  ],
  footer_description: 'Making babywearing accessible for every family. Rent, try, and find your perfect carrier.',
  footer_links: [
    { name: 'Rental Policy', href: '/policies' },
    { name: 'Safety Tips', href: '/safety' },
  ],
  policy_content: null,
  safety_content: null,
  meta_title: 'Baby Carrier Rental - Sling Library India',
  meta_description: 'Rent premium baby carriers in India. Try before you buy with our curated collection of ring slings, wraps, and buckle carriers.',
};
