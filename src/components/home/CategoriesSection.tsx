import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/types';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';

export const CategoriesSection = () => {
  const { settings } = useSiteSettingsContext();

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            {settings.categories_title || 'Explore Our Collection'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {settings.categories_subtitle || 'From ring slings for quick ups to structured carriers for hiking adventures, find the perfect carrier for every occasion.'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category, index) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="group block animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 shadow-card group-hover:shadow-hover transition-all duration-300">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-serif text-xl font-semibold text-white mb-1">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-1 text-white/80 text-sm group-hover:text-white transition-colors">
                    <span>View all</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
