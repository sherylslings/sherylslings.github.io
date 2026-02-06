import React, { createContext, useContext, useEffect } from 'react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { SiteSettings, DEFAULT_SETTINGS } from '@/lib/siteSettings';

interface SiteSettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  getWhatsAppLink: (customMessage?: string) => string;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: settings, isLoading } = useSiteSettings();

  // Ensure we never "flash" old defaults, and never reintroduce category links
  // from persisted settings.
  const enforcedMenuItems = [
    { name: 'Home', href: '/' },
    { name: 'Policies', href: '/policies' },
    { name: 'Safety', href: '/safety' },
  ];

  const currentSettings: SiteSettings = (() => {
    const base: SiteSettings = {
      id: '',
      ...DEFAULT_SETTINGS,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!settings) return base;

    return {
      ...base,
      ...settings,
      // Always keep header nav limited to the 3 pages requested.
      menu_items: enforcedMenuItems,
      // Lock branding to the live defaults so there's no flash on refresh
      brand_name: base.brand_name,
      tagline: base.tagline,
      logo_url: base.logo_url,
      // Allow hero content to be dynamic from admin settings
      // hero_title, hero_subtitle, hero_image_url, hero_cta_text, hero_cta_link will use settings if available
    };
  })();

  // Apply dynamic CSS variables when settings change
  useEffect(() => {
    if (settings) {
      const root = document.documentElement;
      root.style.setProperty('--primary', settings.primary_color);
      root.style.setProperty('--secondary', settings.secondary_color);
      root.style.setProperty('--accent', settings.accent_color);
      root.style.setProperty('--background', settings.background_color);
      root.style.setProperty('--foreground', settings.foreground_color);
    }
  }, [settings]);

  const getWhatsAppLink = (customMessage?: string) => {
    const message = customMessage || currentSettings.whatsapp_message || '';
    return `https://wa.me/${currentSettings.whatsapp_number}?text=${encodeURIComponent(message)}`;
  };

  return (
    <SiteSettingsContext.Provider value={{ settings: currentSettings, isLoading, getWhatsAppLink }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettingsContext = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettingsContext must be used within SiteSettingsProvider');
  }
  return context;
};
