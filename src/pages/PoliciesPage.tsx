import { Layout } from '@/components/layout/Layout';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';

const PoliciesPage = () => {
  const { settings } = useSiteSettingsContext();

  // If custom policy content exists, render it
  if (settings.policy_content) {
    return (
      <Layout>
        <div className="gradient-warm py-12">
          <div className="container">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Rental Policy & Terms</h1>
          </div>
        </div>
        <div className="container py-12 max-w-3xl">
          <div 
            className="prose prose-neutral max-w-none"
            dangerouslySetInnerHTML={{ __html: settings.policy_content }}
          />
        </div>
      </Layout>
    );
  }

  // Default policy content
  return (
    <Layout>
      <div className="gradient-warm py-12">
        <div className="container">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Rental Policy & Terms</h1>
        </div>
      </div>
      <div className="container py-12 max-w-3xl">
        <div className="prose prose-neutral max-w-none space-y-8">
          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">Refundable Security Deposit</h2>
            <p className="text-muted-foreground">A refundable security deposit is collected at the start of each rental. This is fully refunded within 3-5 business days after the carrier is returned in good condition.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">Rental Period & Late Fees</h2>
            <p className="text-muted-foreground">Rentals are available on weekly or monthly basis. Late returns incur a fee of <strong>₹100 per day</strong>. Please inform us in advance if you need an extension.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">Return Expectations</h2>
            <p className="text-muted-foreground">Carriers should be returned in the same condition as received. Minor wear from normal use is expected. Please shake off any debris and spot clean if needed.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">Shipping Responsibility</h2>
            <p className="text-muted-foreground">Shipping costs for both delivery and return are borne by the renter. We recommend using a trackable courier service for returns.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">Damage, Loss & Non-Return</h2>
            <p className="text-muted-foreground">In case of damage beyond normal wear, repair costs will be deducted from the deposit. For lost or non-returned carriers, the full deposit will be forfeited as buyout.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">Cleaning & Laundry</h2>
            <p className="text-muted-foreground">All carriers are professionally laundered before each rental. If returned heavily soiled, a cleaning fee of ₹200-500 may apply.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold mb-4">Safety Disclaimer</h2>
            <p className="text-muted-foreground">Babywearing is done at the parent's own risk. We provide safety guidelines and offer free fit checks, but the responsibility for safe wearing lies with the caregiver.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default PoliciesPage;
