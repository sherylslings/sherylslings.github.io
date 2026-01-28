-- Drop the restrictive policy
DROP POLICY IF EXISTS "Anyone can create booking requests" ON public.booking_requests;

-- Create a permissive policy for public inserts
CREATE POLICY "Anyone can create booking requests" 
ON public.booking_requests 
FOR INSERT 
TO public
WITH CHECK (true);