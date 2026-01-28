import { Link } from 'react-router-dom';
import { MessageCircle, Instagram, Heart } from 'lucide-react';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';

export const Footer = () => {
  const { settings, getWhatsAppLink } = useSiteSettingsContext();

  return (
    <footer className="bg-secondary border-t border-border mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand / story */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {settings.logo_url ? (
                <img 
                  src={settings.logo_url} 
                  alt={settings.brand_name} 
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-serif text-lg">
                    {settings.brand_name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-serif text-lg font-semibold text-foreground">{settings.brand_name}</h3>
                {settings.tagline && (
                  <p className="text-xs text-muted-foreground">{settings.tagline}</p>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mb-4">
              {settings.footer_description}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation" className="space-y-6">
            <div>
              <h4 className="font-serif font-semibold mb-3 text-foreground">Information</h4>
              <ul className="space-y-2 text-sm">
                {settings.footer_links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-semibold mb-3 text-foreground">Admin</h4>
              <Link 
                to="/admin/login" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Admin Login
              </Link>
            </div>
          </nav>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {settings.brand_name}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary fill-primary" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};
