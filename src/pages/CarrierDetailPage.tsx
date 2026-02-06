import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Info } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { AvailabilityBadge } from '@/components/carrier/AvailabilityBadge';
import { BookingModal } from '@/components/carrier/BookingModal';
import { useCarrier } from '@/hooks/useCarriers';
import { getCategoryName } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext';

const CarrierDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: carrier, isLoading } = useCarrier(id!);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { getWhatsAppLink, settings } = useSiteSettingsContext();

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!carrier) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">Carrier not found</p>
          <Link to="/" className="text-primary hover:underline">Go back home</Link>
        </div>
      </Layout>
    );
  }

  const whatsappLink = useMemo(
    () => getWhatsAppLink(
      `Hi! I'm interested in the ${carrier.brand_name} ${carrier.model_name}. Is it available?`
    ),
    [getWhatsAppLink, carrier.brand_name, carrier.model_name, settings.whatsapp_number]
  );

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <Link to={`/category/${carrier.category}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to {getCategoryName(carrier.category)}
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-card">
              <img
                src={carrier.images[selectedImage] || '/placeholder.svg'}
                alt={`${carrier.brand_name} ${carrier.model_name}`}
                className="w-full h-full object-cover"
              />
            </div>
            {carrier.images.length > 1 && (
              <div className="flex gap-3">
                {carrier.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === selectedImage ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <span className="text-sm text-muted-foreground uppercase tracking-wide">
                {getCategoryName(carrier.category)}
              </span>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-1">
                {carrier.brand_name}
              </h1>
              <p className="text-xl text-muted-foreground">{carrier.model_name}</p>
            </div>

            <AvailabilityBadge status={carrier.availability_status} nextAvailableDate={carrier.next_available_date} />

            <p className="text-muted-foreground">{carrier.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-muted-foreground mb-1">Age Range</p>
                <p className="font-medium">{carrier.age_range}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-muted-foreground mb-1">Weight Range</p>
                <p className="font-medium">{carrier.weight_range}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-muted-foreground mb-1">Condition</p>
                <p className="font-medium capitalize">{carrier.condition}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-muted-foreground mb-1">Carry Positions</p>
                <p className="font-medium capitalize">{carrier.carry_positions.join(', ') || 'Multiple'}</p>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-accent/50 rounded-xl p-6 space-y-4">
              <h3 className="font-serif text-lg font-semibold">Rental Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Weekly Rent</p>
                  <p className="text-2xl font-bold text-foreground">₹{carrier.weekly_rent}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Rent</p>
                  <p className="text-2xl font-bold text-primary">₹{carrier.monthly_rent}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">Refundable Security Deposit</p>
                <p className="text-lg font-semibold">₹{carrier.refundable_deposit}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button size="lg" className="flex-1" onClick={() => setBookingOpen(true)} disabled={carrier.availability_status === 'rented'}>
                {carrier.availability_status === 'rented' ? 'Currently Rented' : 'Request Booking'}
              </Button>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-2">
                  <MessageCircle className="w-5 h-5" />
                </Button>
              </a>
            </div>

            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg text-sm">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-muted-foreground">
                <strong>Buyout available:</strong> If you decide to keep the carrier, the refundable deposit (₹{carrier.buyout_price}) will be adjusted against the purchase price. Contact us on WhatsApp to proceed.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BookingModal carrier={carrier} open={bookingOpen} onOpenChange={setBookingOpen} />
    </Layout>
  );
};

export default CarrierDetailPage;
