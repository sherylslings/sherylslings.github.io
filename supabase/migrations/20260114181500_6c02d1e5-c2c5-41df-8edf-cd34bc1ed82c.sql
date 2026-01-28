-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Users can view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Update carriers policies to use new role system
DROP POLICY IF EXISTS "Admins can insert carriers" ON public.carriers;
DROP POLICY IF EXISTS "Admins can update carriers" ON public.carriers;
DROP POLICY IF EXISTS "Admins can delete carriers" ON public.carriers;

CREATE POLICY "Admins can insert carriers"
ON public.carriers
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update carriers"
ON public.carriers
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete carriers"
ON public.carriers
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update booking_requests policies
DROP POLICY IF EXISTS "Admins can view booking requests" ON public.booking_requests;
DROP POLICY IF EXISTS "Admins can update booking requests" ON public.booking_requests;

CREATE POLICY "Admins can view booking requests"
ON public.booking_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update booking requests"
ON public.booking_requests
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));