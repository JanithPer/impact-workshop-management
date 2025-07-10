"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RepairOrder, Customer } from './columns'; // Import types

// Define Zod schema (same as add, but maybe adjust based on update needs)
const repairOrderSchema = z.object({
  customer: z.string().min(1, { message: 'Customer is required' }),
  registrationNumber: z.string().min(1, { message: 'Registration Number is required' }).max(20),
  kilometers: z.coerce.number().min(0, { message: 'Kilometers must be a positive number' }),
  vin: z.string().length(17, { message: 'VIN must be 17 characters' }).regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'Invalid VIN format'),
  dealAmount: z.coerce.number().min(0).optional(),
  dateBooked: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Invalid date' }),
  notes: z.string().max(500).optional(),
});

type RepairOrderFormData = z.infer<typeof repairOrderSchema>;

interface EditRepairOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repairOrder: RepairOrder | null; // Pass the repair order to edit
}

// Fetch customers for the dropdown
const fetchCustomers = async (): Promise<Customer[]> => {
  const response = await api.get('/customers');
  return response.data.data; // Adjust based on your actual API response structure
};

export function EditRepairOrderDialog({ open, onOpenChange, repairOrder }: EditRepairOrderDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery<Customer[]>({ 
    queryKey: ['customers'], 
    queryFn: fetchCustomers 
  });

  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<RepairOrderFormData>({
    resolver: zodResolver(repairOrderSchema),
    // Default values will be set by useEffect when repairOrder changes
  });

  // Populate form when repairOrder data is available
  useEffect(() => {
    if (repairOrder) {
      reset({
        customer: repairOrder.customer._id, // Use customer ID
        registrationNumber: repairOrder.registrationNumber,
        kilometers: repairOrder.kilometers,
        vin: repairOrder.vin,
        dealAmount: repairOrder.dealAmount ?? 0,
        dateBooked: repairOrder.dateBooked ? new Date(repairOrder.dateBooked).toISOString().split('T')[0] : '', // Format date for input
        notes: repairOrder.notes ?? '',
      });
    }
  }, [repairOrder, reset]);

  const mutation = useMutation({
    mutationFn: async (data: RepairOrderFormData) => {
      if (!repairOrder?._id) throw new Error("Repair Order ID is missing");
      // Convert date string to Date object before sending
      const payload = {
        ...data,
        dateBooked: new Date(data.dateBooked),
      };
      // Use POST with ID as per backend route definition
      await api.post(`/repair-orders/${repairOrder._id}`, payload);
    },
    onSuccess: () => {
      toast.success('Repair order updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['repair-orders'] });
      onOpenChange(false); // Close dialog on success
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update repair order. Please try again.';
      toast.error(errorMessage);
      console.error("Error updating repair order:", error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: RepairOrderFormData) => {
    setIsSubmitting(true);
    mutation.mutate(data);
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      // Optionally reset to default values or keep last state
      // reset(); // Uncomment to clear form on close
    }
  }, [open, reset]);

  if (!repairOrder) return null; // Don't render if no repair order is selected

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Repair Order</DialogTitle>
          <DialogDescription>
            Update the details for repair order #{repairOrder.registrationNumber}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* Customer Select */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer-edit" className="text-right">
              Customer
            </Label>
            <div className="col-span-3">
              <Select 
                defaultValue={repairOrder.customer._id} // Set default value
                onValueChange={(value) => setValue('customer', value)} 
                disabled={isLoadingCustomers}
              >
                <SelectTrigger id="customer-edit">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingCustomers ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    customers.map((customer) => (
                      <SelectItem key={customer._id} value={customer._id}>
                        {customer.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.customer && <p className="text-red-500 text-sm mt-1">{errors.customer.message}</p>}
            </div>
          </div>

          {/* Registration Number */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="registrationNumber-edit" className="text-right">
              Reg Number
            </Label>
            <div className="col-span-3">
              <Input id="registrationNumber-edit" {...register('registrationNumber')} />
              {errors.registrationNumber && <p className="text-red-500 text-sm mt-1">{errors.registrationNumber.message}</p>}
            </div>
          </div>

          {/* Kilometers */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="kilometers-edit" className="text-right">
              Kilometers
            </Label>
            <div className="col-span-3">
              <Input id="kilometers-edit" type="number" {...register('kilometers')} />
              {errors.kilometers && <p className="text-red-500 text-sm mt-1">{errors.kilometers.message}</p>}
            </div>
          </div>

          {/* VIN */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vin-edit" className="text-right">
              VIN
            </Label>
            <div className="col-span-3">
              <Input id="vin-edit" {...register('vin')} />
              {errors.vin && <p className="text-red-500 text-sm mt-1">{errors.vin.message}</p>}
            </div>
          </div>

          {/* Estimate */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dealAmount-edit" className="text-right">
              Estimate
            </Label>
            <div className="col-span-3">
              <Input id="dealAmount-edit" type="number" step="0.01" {...register('dealAmount')} />
              {errors.dealAmount && <p className="text-red-500 text-sm mt-1">{errors.dealAmount.message}</p>}
            </div>
          </div>

          {/* Date Booked */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dateBooked-edit" className="text-right">
              Date Booked
            </Label>
            <div className="col-span-3">
              <Input id="dateBooked-edit" type="date" {...register('dateBooked')} />
              {errors.dateBooked && <p className="text-red-500 text-sm mt-1">{errors.dateBooked.message}</p>}
            </div>
          </div>

          {/* Notes */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes-edit" className="text-right">
              Notes
            </Label>
            <div className="col-span-3">
              <Textarea id="notes-edit" {...register('notes')} />
              {errors.notes && <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Repair Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}