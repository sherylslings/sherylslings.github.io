import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';

export const HeroSection = () => {
  const { settings, getWhatsAppLink } = useSiteSettingsContext();

  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="container py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Try Before You Buy
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              {settings.hero_title.split('&')[0]}
              {settings.hero_title.includes('&') && (
                <>
                  &{' '}
                  <span className="text-primary">{settings.hero_title.split('&')[1]}</span>
                </>
              )}
              {!settings.hero_title.includes('&') && (
                <span className="text-primary">{settings.tagline}</span>
              )}
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl">
              {settings.hero_subtitle}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to={settings.hero_cta_link || '/category/ring-slings'}>
                <Button size="lg" className="gap-2">
                  {settings.hero_cta_text || 'Browse Collection'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat with Us
                </Button>
              </a>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 pt-4">
              {settings.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-lg">
                      {feature.icon === 'Award' && '🍼'}
                      {feature.icon === 'Shield' && '✨'}
                      {feature.icon === 'Heart' && '💬'}
                      {!['Award', 'Shield', 'Heart'].includes(feature.icon) && '⭐'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-hover">
              <img
                src={settings.hero_image_url || "https://images.unsplash.com/photo-1492725764893-90b379c2b6e7?w=800&h=600&fit=crop"}
                alt="Parent carrying baby in a wrap carrier"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl bg-primary/20 -z-10"></div>
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-secondary -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
