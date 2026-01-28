import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CarrierCard } from '@/components/carrier/CarrierCard';
import { useCarriers } from '@/hooks/useCarriers';
import { Skeleton } from '@/components/ui/skeleton';

export const FeaturedCarriersSection = () => {
  const { data: carriers, isLoading } = useCarriers();
  const featuredCarriers = carriers?.slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              Featured Carriers
            </h2>
            <p className="text-muted-foreground">
              Popular picks from our collection
            </p>
          </div>
          <Link to="/category/ring-slings">
            <Button variant="outline" className="gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] rounded-lg" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : featuredCarriers && featuredCarriers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCarriers.map((carrier, index) => (
              <div
                key={carrier.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CarrierCard carrier={carrier} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            No carriers available at the moment. Check back soon!
          </p>
        )}
      </div>
    </section>
  );
};
