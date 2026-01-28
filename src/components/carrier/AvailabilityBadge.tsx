import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Check, Clock } from 'lucide-react';

interface AvailabilityBadgeProps {
  status: 'available' | 'rented';
  nextAvailableDate?: string | null;
  size?: 'sm' | 'md';
}

export const AvailabilityBadge = ({ status, nextAvailableDate, size = 'md' }: AvailabilityBadgeProps) => {
  const isAvailable = status === 'available';

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === 'sm' ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
        isAvailable
          ? "bg-available/10 text-available"
          : "bg-rented/10 text-rented"
      )}
    >
      {isAvailable ? (
        <>
          <Check className={cn(size === 'sm' ? "w-3 h-3" : "w-4 h-4")} />
          Available
        </>
      ) : (
        <>
          <Clock className={cn(size === 'sm' ? "w-3 h-3" : "w-4 h-4")} />
          {nextAvailableDate
            ? `Available ${format(new Date(nextAvailableDate), 'dd MMM')}`
            : 'Rented'}
        </>
      )}
    </div>
  );
};
