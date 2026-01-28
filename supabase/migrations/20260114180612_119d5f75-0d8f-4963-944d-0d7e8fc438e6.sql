-- Create carriers table
CREATE TABLE public.carriers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_name TEXT NOT NULL,
  model_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ring-slings', 'wraps', 'buckle-carriers', 'onbuhimo')),
  age_range TEXT NOT NULL,
  weight_range TEXT NOT NULL,
  weekly_rent INTEGER NOT NULL,
  monthly_rent INTEGER NOT NULL,
  refundable_deposit INTEGER NOT NULL,
  buyout_price INTEGER NOT NULL,
  condition TEXT NOT NULL DEFAULT 'gently used',
  carry_positions TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  laundry_instructions TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  availability_status TEXT NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'rented')),
  next_available_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create booking_requests table
CREATE TABLE public.booking_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  carrier_id UUID NOT NULL REFERENCES public.carriers(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  start_date DATE NOT NULL,
  duration TEXT NOT NULL CHECK (duration IN ('weekly', 'monthly')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'completed', 'cancelled')),
  agreed_to_terms BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Carriers are publicly viewable
CREATE POLICY "Carriers are viewable by everyone" 
ON public.carriers 
FOR SELECT 
USING (true);

-- Only admins can manage carriers
CREATE POLICY "Admins can insert carriers" 
ON public.carriers 
FOR INSERT 
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Admins can update carriers" 
ON public.carriers 
FOR UPDATE 
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Admins can delete carriers" 
ON public.carriers 
FOR DELETE 
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
);

-- Anyone can submit booking requests
CREATE POLICY "Anyone can create booking requests" 
ON public.booking_requests 
FOR INSERT 
WITH CHECK (true);

-- Admins can view all booking requests
CREATE POLICY "Admins can view booking requests" 
ON public.booking_requests 
FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
);

-- Admins can update booking requests
CREATE POLICY "Admins can update booking requests" 
ON public.booking_requests 
FOR UPDATE 
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
);

-- Profile policies
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, is_admin)
  VALUES (NEW.id, NEW.email, false);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Update triggers
CREATE TRIGGER update_carriers_updated_at
  BEFORE UPDATE ON public.carriers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_booking_requests_updated_at
  BEFORE UPDATE ON public.booking_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample carriers
INSERT INTO public.carriers (brand_name, model_name, category, age_range, weight_range, weekly_rent, monthly_rent, refundable_deposit, buyout_price, condition, carry_positions, description, images, availability_status, next_available_date) VALUES
('Sakura Bloom', 'Scout', 'ring-slings', '0-24 months', '3-15 kg', 350, 1200, 4000, 4000, 'gently used', ARRAY['front inward', 'hip carry'], 'Beautiful linen ring sling perfect for newborns and toddlers. Features a gathered shoulder for comfortable weight distribution.', ARRAY['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600', 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600'], 'available', NULL),
('Didymos', 'Prima Aurora', 'wraps', '0-36 months', '3-18 kg', 450, 1500, 6000, 6000, 'very gently used', ARRAY['front wrap cross carry', 'back carry', 'hip carry'], 'Gorgeous hand-woven wrap with beautiful gradient colors. Soft and supportive for extended wearing sessions.', ARRAY['https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600', 'https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=600'], 'rented', '2026-01-28'),
('Tula', 'Free-to-Grow', 'buckle-carriers', '3-36 months', '5-20 kg', 400, 1400, 5500, 5500, 'gently used', ARRAY['front inward', 'back carry'], 'Ergonomic buckle carrier that grows with your baby. Easy to adjust and perfect for beginners.', ARRAY['https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?w=600', 'https://images.unsplash.com/photo-1604917877934-07d8d248d396?w=600'], 'available', NULL);