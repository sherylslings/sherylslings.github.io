import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SiteSettings, DEFAULT_SETTINGS, SiteFeature, HowItWorksStep, MenuItem, FooterLink } from '@/lib/siteSettings';

const parseSiteSettings = (data: any): SiteSettings => {
  return {
    ...data,
    features: (data.features as SiteFeature[]) || DEFAULT_SETTINGS.features,
    how_it_works_steps: (data.how_it_works_steps as HowItWorksStep[]) || DEFAULT_SETTINGS.how_it_works_steps,
    menu_items: (data.menu_items as MenuItem[]) || DEFAULT_SETTINGS.menu_items,
    footer_links: (data.footer_links as FooterLink[]) || DEFAULT_SETTINGS.footer_links,
  };
};

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['site-settings'],
    queryFn: async (): Promise<SiteSettings> => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching site settings:', error);
        // Return default settings if no data exists
        return {
          id: '',
          ...DEFAULT_SETTINGS,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }

      return parseSiteSettings(data);
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

export const useUpdateSiteSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<SiteSettings>) => {
      // First, get the current settings to get the ID
      const { data: currentSettings, error: fetchError } = await supabase
        .from('site_settings')
        .select('id')
        .limit(1)
        .single();

      if (fetchError) throw fetchError;

      // Convert typed arrays to JSON-compatible format for Supabase
      const dbUpdates: Record<string, unknown> = { ...updates };
      
      const { data, error } = await supabase
        .from('site_settings')
        .update(dbUpdates)
        .eq('id', currentSettings.id)
        .select()
        .single();

      if (error) throw error;
      return parseSiteSettings(data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['site-settings'], data);
    },
  });
};
