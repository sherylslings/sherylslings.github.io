-- Create site_settings table for full CMS control
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Branding
  logo_url text DEFAULT NULL,
  brand_name text NOT NULL DEFAULT 'Baby Carrier Rental',
  tagline text DEFAULT 'Sling Library',
  
  -- Colors (stored as HSL values)
  primary_color text NOT NULL DEFAULT '25 95% 53%',
  secondary_color text NOT NULL DEFAULT '30 60% 96%',
  accent_color text NOT NULL DEFAULT '25 90% 48%',
  background_color text NOT NULL DEFAULT '30 50% 98%',
  foreground_color text NOT NULL DEFAULT '25 40% 15%',
  
  -- Contact
  whatsapp_number text NOT NULL DEFAULT '919876543210',
  whatsapp_message text DEFAULT 'Hi! I am interested in renting a baby carrier.',
  email text DEFAULT NULL,
  instagram_url text DEFAULT NULL,
  
  -- Hero Section
  hero_title text NOT NULL DEFAULT 'Baby Carrier Rental & Sling Library',
  hero_subtitle text DEFAULT 'Try premium baby carriers before you buy. Rent weekly or monthly with free fit checks and sanitization included.',
  hero_image_url text DEFAULT NULL,
  hero_cta_text text DEFAULT 'Browse Collection',
  hero_cta_link text DEFAULT '/category/ring-slings',
  
  -- Features/Benefits
  features jsonb DEFAULT '[
    {"icon": "Award", "title": "Premium Brands", "description": "Curated collection of trusted carriers"},
    {"icon": "Shield", "title": "Sanitized", "description": "Deep cleaned between every rental"},
    {"icon": "Heart", "title": "Free Fit Checks", "description": "Virtual support for perfect fit"}
  ]'::jsonb,
  
  -- How It Works Section
  how_it_works_title text DEFAULT 'How It Works',
  how_it_works_steps jsonb DEFAULT '[
    {"step": 1, "title": "Browse & Choose", "description": "Explore our curated collection of baby carriers"},
    {"step": 2, "title": "Book via WhatsApp", "description": "Send us a message to reserve your carrier"},
    {"step": 3, "title": "Receive & Try", "description": "Get your carrier delivered with fit support"},
    {"step": 4, "title": "Return or Buy", "description": "Return when done or buy if you love it"}
  ]'::jsonb,
  
  -- Categories Section
  categories_title text DEFAULT 'Browse by Category',
  categories_subtitle text DEFAULT 'Find the perfect carrier for your needs',
  
  -- Navigation Menu
  menu_items jsonb DEFAULT '[
    {"name": "Home", "href": "/"},
    {"name": "Ring Slings", "href": "/category/ring-slings"},
    {"name": "Wraps", "href": "/category/wraps"},
    {"name": "Buckle Carriers", "href": "/category/buckle-carriers"},
    {"name": "Policies", "href": "/policies"},
    {"name": "Safety", "href": "/safety"}
  ]'::jsonb,
  
  -- Footer
  footer_description text DEFAULT 'Making babywearing accessible for every family. Rent, try, and find your perfect carrier.',
  footer_links jsonb DEFAULT '[
    {"name": "Rental Policy", "href": "/policies"},
    {"name": "Safety Tips", "href": "/safety"}
  ]'::jsonb,
  
  -- Policy Page Content (Markdown/HTML)
  policy_content text DEFAULT NULL,
  
  -- Safety Page Content
  safety_content text DEFAULT NULL,
  
  -- SEO
  meta_title text DEFAULT 'Baby Carrier Rental - Sling Library India',
  meta_description text DEFAULT 'Rent premium baby carriers in India. Try before you buy with our curated collection of ring slings, wraps, and buckle carriers.',
  
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read settings (needed for frontend)
CREATE POLICY "Site settings are publicly readable"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (true);

-- Only admins can update settings
CREATE POLICY "Admins can update site settings"
ON public.site_settings
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can insert (should only be one row)
CREATE POLICY "Admins can insert site settings"
ON public.site_settings
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings row
INSERT INTO public.site_settings (id) VALUES (gen_random_uuid());