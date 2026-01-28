import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateBookingRequest } from '@/hooks/useBookingRequests';
import { useToast } from '@/hooks/use-toast';
import type { Carrier } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const bookingSchema = z.object({
  customer_name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  city: z.string().min(2, 'City is required'),
  start_date: z.date({ required_error: 'Start date is required' }),
  duration: z.enum(['weekly', 'monthly']),
  agreed_to_terms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the rental terms' }),
  }),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  carrier: Carrier;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BookingModal = ({ carrier, open, onOpenChange }: BookingModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const createBooking = useCreateBookingRequest();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      duration: 'weekly',
      agreed_to_terms: false as unknown as true,
    },
  });

  const startDate = watch('start_date');
  const duration = watch('duration');
  const agreedToTerms = watch('agreed_to_terms');

  const onSubmit = async (data: BookingFormData) => {
    try {
      await createBooking.mutateAsync({
        carrier_id: carrier.id,
        customer_name: data.customer_name,
        phone: data.phone,
        city: data.city,
        start_date: format(data.start_date, 'yyyy-MM-dd'),
        duration: data.duration,
        agreed_to_terms: data.agreed_to_terms,
        notes: null,
      });
      setSubmitted(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit booking request. Please try again.',
      });
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    reset();
    onOpenChange(false);
  };

  const rentAmount = duration === 'weekly' ? carrier.weekly_rent : carrier.monthly_rent;

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-available/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-available" />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2">Request Submitted!</h3>
            <p className="text-muted-foreground mb-6">
              Thank you! We'll confirm availability on WhatsApp shortly.
            </p>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Request Booking</DialogTitle>
        </DialogHeader>

        <div className="bg-accent/50 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium">{carrier.brand_name} {carrier.model_name}</p>
          <p className="text-sm text-muted-foreground">{duration === 'weekly' ? 'Weekly' : 'Monthly'} Rent: ₹{rentAmount}</p>
          <p className="text-sm text-muted-foreground">Refundable Deposit: ₹{carrier.refundable_deposit}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Full Name</Label>
              <Input
                id="customer_name"
                {...register('customer_name')}
                placeholder="Your name"
              />
              {errors.customer_name && (
                <p className="text-xs text-destructive">{errors.customer_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+91 98765 43210"
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              {...register('city')}
              placeholder="Your city"
            />
            {errors.city && (
              <p className="text-xs text-destructive">{errors.city.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Preferred Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'dd MMM yyyy') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setValue('start_date', date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.start_date && (
                <p className="text-xs text-destructive">{errors.start_date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <Select
                value={duration}
                onValueChange={(value: 'weekly' | 'monthly') => setValue('duration', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly (₹{carrier.weekly_rent})</SelectItem>
                  <SelectItem value="monthly">Monthly (₹{carrier.monthly_rent})</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
            <p className="font-medium">Rental Summary</p>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rent ({duration})</span>
              <span>₹{rentAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Security Deposit (Refundable)</span>
              <span>₹{carrier.refundable_deposit}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-border">
              <span>Total Payable</span>
              <span>₹{rentAmount + carrier.refundable_deposit}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setValue('agreed_to_terms', checked as boolean as true)}
            />
            <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
              I agree to the{' '}
              <Link to="/policies" className="text-primary hover:underline" target="_blank">
                rental terms & conditions
              </Link>
              , including the deposit policy and late return fees.
            </Label>
          </div>
          {errors.agreed_to_terms && (
            <p className="text-xs text-destructive">{errors.agreed_to_terms.message}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
