import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Carrier, Category } from '@/lib/types';

export const useCarriers = (category?: Category) => {
  return useQuery({
    queryKey: ['carriers', category],
    queryFn: async () => {
      let query = supabase
        .from('carriers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Carrier[];
    },
  });
};

export const useCarrier = (id: string) => {
  return useQuery({
    queryKey: ['carrier', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carriers')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Carrier | null;
    },
    enabled: !!id,
  });
};

export const useCreateCarrier = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (carrier: Omit<Carrier, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('carriers')
        .insert(carrier)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carriers'] });
    },
  });
};

export const useUpdateCarrier = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...carrier }: Partial<Carrier> & { id: string }) => {
      const { data, error } = await supabase
        .from('carriers')
        .update(carrier)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['carriers'] });
      queryClient.invalidateQueries({ queryKey: ['carrier', variables.id] });
    },
  });
};

export const useDeleteCarrier = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('carriers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carriers'] });
    },
  });
};
