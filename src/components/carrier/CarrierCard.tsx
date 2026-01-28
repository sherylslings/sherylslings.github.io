import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import type { Carrier } from '@/lib/types';
import { getCategoryName } from '@/lib/types';
import { AvailabilityBadge } from './AvailabilityBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CarrierCardProps {
  carrier: Carrier;
}

export const CarrierCard = ({ carrier }: CarrierCardProps) => {
  const whatsappLink = `https://wa.me/919876543210?text=${encodeURIComponent(
    `Hi! I'm interested in renting the ${carrier.brand_name} ${carrier.model_name}.`
  )}`;

  return (
    <Card className="group overflow-hidden border-border/50 shadow-card hover:shadow-hover transition-all duration-300">
      <Link to={`/carrier/${carrier.id}`}>
        <div className="aspect-[4/3] overflow-hidden relative">
          <img
            src={carrier.images[0] || '/placeholder.svg'}
            alt={`${carrier.brand_name} ${carrier.model_name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <AvailabilityBadge
              status={carrier.availability_status}
              nextAvailableDate={carrier.next_available_date}
              size="sm"
            />
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            {getCategoryName(carrier.category)}
          </span>
        </div>
        
        <Link to={`/carrier/${carrier.id}`}>
          <h3 className="font-serif text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {carrier.brand_name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">{carrier.model_name}</p>
        </Link>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {carrier.description}
        </p>
        
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Weekly</p>
            <p className="font-semibold text-foreground">₹{carrier.weekly_rent}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Monthly</p>
            <p className="font-semibold text-primary">₹{carrier.monthly_rent}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link to={`/carrier/${carrier.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="ghost" className="px-3">
              <MessageCircle className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};
