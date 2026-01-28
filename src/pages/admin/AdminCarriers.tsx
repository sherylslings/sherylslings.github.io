import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useCarriers, useDeleteCarrier } from '@/hooks/useCarriers';
import { getCategoryName } from '@/lib/types';
import { CarrierFormModal } from '@/components/admin/CarrierFormModal';
import { useToast } from '@/hooks/use-toast';
import type { Carrier } from '@/lib/types';

const AdminCarriers = () => {
  const { data: carriers, isLoading } = useCarriers();
  const deleteCarrier = useDeleteCarrier();
  const { toast } = useToast();
  const [editingCarrier, setEditingCarrier] = useState<Carrier | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await deleteCarrier.mutateAsync(id);
      toast({ title: 'Carrier deleted successfully' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to delete carrier' });
    }
  };

  const handleEdit = (carrier: Carrier) => {
    setEditingCarrier(carrier);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingCarrier(null);
    setIsFormOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-serif">Carriers</CardTitle>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Carrier
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground text-center py-8">Loading...</p>
        ) : carriers && carriers.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand / Model</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Weekly</TableHead>
                  <TableHead>Monthly</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carriers.map((carrier) => (
                  <TableRow key={carrier.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={carrier.images[0] || '/placeholder.svg'}
                          alt=""
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{carrier.brand_name}</p>
                          <p className="text-sm text-muted-foreground">{carrier.model_name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryName(carrier.category)}</TableCell>
                    <TableCell>₹{carrier.weekly_rent}</TableCell>
                    <TableCell>₹{carrier.monthly_rent}</TableCell>
                    <TableCell>
                      <Badge variant={carrier.availability_status === 'available' ? 'default' : 'secondary'}>
                        {carrier.availability_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Link to={`/carrier/${carrier.id}`} target="_blank">
                          <Button variant="ghost" size="icon">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(carrier)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Carrier?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete {carrier.brand_name} {carrier.model_name}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(carrier.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">No carriers yet. Add your first carrier!</p>
        )}
      </CardContent>

      <CarrierFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        carrier={editingCarrier}
      />
    </Card>
  );
};

export default AdminCarriers;
