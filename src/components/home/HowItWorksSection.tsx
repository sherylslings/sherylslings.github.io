import { Search, MessageCircle, Package, Heart } from 'lucide-react';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  MessageCircle,
  Package,
  Heart,
};

export const HowItWorksSection = () => {
  const { settings } = useSiteSettingsContext();

  const steps = settings.how_it_works_steps;
  const defaultIcons = [Search, MessageCircle, Package, Heart];

  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            {settings.how_it_works_title || 'How It Works'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Renting is easy! Try different carriers to find your perfect match.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = defaultIcons[index % defaultIcons.length];
            return (
              <div
                key={step.step}
                className="relative animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="absolute top-8 left-1/2 w-full h-px bg-border -z-10 hidden lg:block last:hidden"></div>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold mb-3">
                    {step.step}
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
