import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCreateCarrier, useUpdateCarrier } from '@/hooks/useCarriers';
import { useToast } from '@/hooks/use-toast';
import { CATEGORIES, type Carrier, type Category } from '@/lib/types';
import { cn } from '@/lib/utils';

const carrierSchema = z.object({
  brand_name: z.string().min(1, 'Brand name required'),
  model_name: z.string().min(1, 'Model name required'),
  category: z.enum(['ring-slings', 'wraps', 'buckle-carriers', 'onbuhimo']),
  age_range: z.string().min(1, 'Age range required'),
  weight_range: z.string().min(1, 'Weight range required'),
  weekly_rent: z.coerce.number().min(1, 'Weekly rent required'),
  monthly_rent: z.coerce.number().min(1, 'Monthly rent required'),
  refundable_deposit: z.coerce.number().min(1, 'Deposit required'),
  buyout_price: z.coerce.number().min(1, 'Buyout price required'),
  condition: z.string().min(1, 'Condition required'),
  carry_positions: z.string(),
  description: z.string().optional(),
  images: z.string(),
  availability_status: z.enum(['available', 'rented']),
  next_available_date: z.date().optional().nullable(),
});

type CarrierFormData = z.infer<typeof carrierSchema>;

interface CarrierFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carrier: Carrier | null;
}

export const CarrierFormModal = ({ open, onOpenChange, carrier }: CarrierFormModalProps) => {
  const { toast } = useToast();
  const createCarrier = useCreateCarrier();
  const updateCarrier = useUpdateCarrier();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CarrierFormData>({
    resolver: zodResolver(carrierSchema),
    defaultValues: {
      category: 'ring-slings',
      availability_status: 'available',
      condition: 'gently used',
    },
  });

  const category = watch('category');
  const availabilityStatus = watch('availability_status');
  const nextAvailableDate = watch('next_available_date');

  useEffect(() => {
    if (carrier) {
      reset({
        brand_name: carrier.brand_name,
        model_name: carrier.model_name,
        category: carrier.category,
        age_range: carrier.age_range,
        weight_range: carrier.weight_range,
        weekly_rent: carrier.weekly_rent,
        monthly_rent: carrier.monthly_rent,
        refundable_deposit: carrier.refundable_deposit,
        buyout_price: carrier.buyout_price,
        condition: carrier.condition,
        carry_positions: carrier.carry_positions.join(', '),
        description: carrier.description || '',
        images: carrier.images.join('\n'),
        availability_status: carrier.availability_status,
        next_available_date: carrier.next_available_date ? new Date(carrier.next_available_date) : null,
      });
    } else {
      reset({
        brand_name: '',
        model_name: '',
        category: 'ring-slings',
        age_range: '',
        weight_range: '',
        weekly_rent: 0,
        monthly_rent: 0,
        refundable_deposit: 0,
        buyout_price: 0,
        condition: 'gently used',
        carry_positions: '',
        description: '',
        images: '',
        availability_status: 'available',
        next_available_date: null,
      });
    }
  }, [carrier, reset]);

  const onSubmit = async (data: CarrierFormData) => {
    try {
      const carrierData = {
        brand_name: data.brand_name,
        model_name: data.model_name,
        category: data.category as Category,
        age_range: data.age_range,
        weight_range: data.weight_range,
        weekly_rent: data.weekly_rent,
        monthly_rent: data.monthly_rent,
        refundable_deposit: data.refundable_deposit,
        buyout_price: data.buyout_price,
        condition: data.condition,
        carry_positions: data.carry_positions.split(',').map(p => p.trim()).filter(Boolean),
        description: data.description || null,
        laundry_instructions: null,
        images: data.images.split('\n').map(url => url.trim()).filter(Boolean),
        availability_status: data.availability_status as 'available' | 'rented',
        next_available_date: data.next_available_date ? format(data.next_available_date, 'yyyy-MM-dd') : null,
      };

      if (carrier) {
        await updateCarrier.mutateAsync({ id: carrier.id, ...carrierData });
        toast({ title: 'Carrier updated!' });
      } else {
        await createCarrier.mutateAsync(carrierData);
        toast({ title: 'Carrier created!' });
      }
      onOpenChange(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to save carrier' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {carrier ? 'Edit Carrier' : 'Add New Carrier'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Brand Name</Label>
              <Input {...register('brand_name')} placeholder="e.g. Sakura Bloom" />
              {errors.brand_name && <p className="text-xs text-destructive">{errors.brand_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Model Name</Label>
              <Input {...register('model_name')} placeholder="e.g. Scout" />
              {errors.model_name && <p className="text-xs text-destructive">{errors.model_name.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setValue('category', v as Category)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Condition</Label>
              <Input {...register('condition')} placeholder="e.g. gently used" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Age Range</Label>
              <Input {...register('age_range')} placeholder="e.g. 0-24 months" />
            </div>
            <div className="space-y-2">
              <Label>Weight Range</Label>
              <Input {...register('weight_range')} placeholder="e.g. 3-15 kg" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Weekly Rent (₹)</Label>
              <Input type="number" {...register('weekly_rent')} />
            </div>
            <div className="space-y-2">
              <Label>Monthly Rent (₹)</Label>
              <Input type="number" {...register('monthly_rent')} />
            </div>
            <div className="space-y-2">
              <Label>Deposit (₹)</Label>
              <Input type="number" {...register('refundable_deposit')} />
            </div>
            <div className="space-y-2">
              <Label>Buyout (₹)</Label>
              <Input type="number" {...register('buyout_price')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Carry Positions (comma separated)</Label>
            <Input {...register('carry_positions')} placeholder="front inward, hip carry, back carry" />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...register('description')} rows={3} />
          </div>

          <div className="space-y-2">
            <Label>Image URLs (one per line)</Label>
            <Textarea {...register('images')} rows={2} placeholder="https://..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={availabilityStatus} onValueChange={(v) => setValue('availability_status', v as 'available' | 'rented')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {availabilityStatus === 'rented' && (
              <div className="space-y-2">
                <Label>Return Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start", !nextAvailableDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {nextAvailableDate ? format(nextAvailableDate, 'dd MMM yyyy') : 'Pick date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={nextAvailableDate || undefined}
                      onSelect={(date) => setValue('next_available_date', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (carrier ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
