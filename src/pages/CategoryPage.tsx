import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { CarrierCard } from '@/components/carrier/CarrierCard';
import { useCarriers } from '@/hooks/useCarriers';
import { getCategoryName, CATEGORIES, type Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: Category }>();
  const { data: carriers, isLoading } = useCarriers(slug);
  const category = CATEGORIES.find(c => c.slug === slug);

  return (
    <Layout>
      <div className="gradient-warm py-12 md:py-16">
        <div className="container">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
            {category?.name || getCategoryName(slug!)}
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            {category?.description}
          </p>
        </div>
      </div>

      <div className="container py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] rounded-lg" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : carriers && carriers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {carriers.map((carrier) => (
              <CarrierCard key={carrier.id} carrier={carrier} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            No carriers available in this category. Check back soon!
          </p>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
