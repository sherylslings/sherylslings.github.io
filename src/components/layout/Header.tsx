import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings, getWhatsAppLink } = useSiteSettingsContext();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <nav className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          {settings.logo_url ? (
            <img 
              src={settings.logo_url} 
              alt={settings.brand_name} 
              className="h-10 w-auto object-contain"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-serif text-lg">
                {settings.brand_name.charAt(0)}
              </span>
            </div>
          )}
          <div className="hidden sm:block">
            <h1 className="font-serif text-lg font-semibold text-foreground leading-tight">
              {settings.brand_name}
            </h1>
            {settings.tagline && (
              <p className="text-xs text-muted-foreground">{settings.tagline}</p>
            )}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {settings.menu_items.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="gap-2 hidden sm:flex">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </Button>
          </a>
          
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-card border-b border-border animate-fade-in">
          <div className="container py-4 flex flex-col gap-3">
            {settings.menu_items.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "py-2 text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="mt-2">
              <Button size="sm" className="w-full gap-2">
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
