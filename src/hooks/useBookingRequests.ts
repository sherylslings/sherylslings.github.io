import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { BookingRequest } from '@/lib/types';

export const useBookingRequests = () => {
  return useQuery({
    queryKey: ['booking-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('booking_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BookingRequest[];
    },
  });
};

export const useCreateBookingRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (
      request: Omit<BookingRequest, 'id' | 'status' | 'created_at' | 'updated_at'>
    ) => {
      // IMPORTANT: Don't request the inserted row back (no `.select()`),
      // because public users are not allowed to SELECT from booking_requests.
      const { error } = await supabase
        .from('booking_requests')
        .insert(request);

      if (error) throw error;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-requests'] });
    },
  });
};

export const useUpdateBookingRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BookingRequest> & { id: string }) => {
      const { data, error } = await supabase
        .from('booking_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-requests'] });
    },
  });
};
