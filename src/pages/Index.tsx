import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { FeaturedCarriersSection } from '@/components/home/FeaturedCarriersSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <CategoriesSection />
      <FeaturedCarriersSection />
      <HowItWorksSection />
    </Layout>
  );
};

export default Index;
