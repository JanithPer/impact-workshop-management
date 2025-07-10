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
import { Customer } from './columns'; // Assuming Customer type is defined here or imported

// Define Zod schema based on backend model
const repairOrderSchema = z.object({
  customer: z.string().min(1, { message: 'Customer is required' }),
  registrationNumber: z.string().min(1, { message: 'Registration Number is required' }).max(20),
  kilometers: z.coerce.number().min(0, { message: 'Kilometers must be a positive number' }),
  vin: z.string().length(17, { message: 'VIN must be 17 characters' }).regex(/^[A-HJ-NPR-Z0-9]{17}$/, 'Invalid VIN format'),
  dealAmount: z.coerce.number().min(0).optional(),
  dateBooked: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Invalid date' }), // Validate as string first
  notes: z.string().max(500).optional(),
});

type RepairOrderFormData = z.infer<typeof repairOrderSchema>;

interface AddRepairOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Fetch customers for the dropdown
const fetchCustomers = async (): Promise<Customer[]> => {
  const response = await api.get('/customers');
  return response.data.data; // Adjust based on your actual API response structure
};

export function AddRepairOrderDialog({ open, onOpenChange }: AddRepairOrderDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery<Customer[]>({ 
    queryKey: ['customers'], 
    queryFn: fetchCustomers 
  });

  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<RepairOrderFormData>({
    resolver: zodResolver(repairOrderSchema),
    defaultValues: {
      dateBooked: new Date().toISOString().split('T')[0], // Default to today's date in YYYY-MM-DD
      dealAmount: 0,
      notes: '',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: RepairOrderFormData) => {
      // Convert date string to Date object before sending if backend expects Date
      const payload = {
        ...data,
        dateBooked: new Date(data.dateBooked),
      };
      await api.post('/repair-orders', payload);
    },
    onSuccess: () => {
      toast.success('Repair order added successfully!');
      queryClient.invalidateQueries({ queryKey: ['repair-orders'] });
      onOpenChange(false); // Close dialog on success
      reset(); // Reset form
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to add repair order. Please try again.';
      toast.error(errorMessage);
      console.error("Error adding repair order:", error);
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
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Repair Order</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new repair order.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer" className="text-right">
              Customer
            </Label>
            <div className="col-span-3">
              <Select 
                onValueChange={(value) => setValue('customer', value)} 
                disabled={isLoadingCustomers}
              >
                <SelectTrigger id="customer">
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="registrationNumber" className="text-right">
              Reg Number
            </Label>
            <div className="col-span-3">
              <Input id="registrationNumber" {...register('registrationNumber')} />
              {errors.registrationNumber && <p className="text-red-500 text-sm mt-1">{errors.registrationNumber.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="kilometers" className="text-right">
              Kilometers
            </Label>
            <div className="col-span-3">
              <Input id="kilometers" type="number" {...register('kilometers')} />
              {errors.kilometers && <p className="text-red-500 text-sm mt-1">{errors.kilometers.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="vin" className="text-right">
              VIN
            </Label>
            <div className="col-span-3">
              <Input id="vin" {...register('vin')} />
              {errors.vin && <p className="text-red-500 text-sm mt-1">{errors.vin.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dealAmount" className="text-right">
              Estimate
            </Label>
            <div className="col-span-3">
              <Input id="dealAmount" type="number" step="0.01" {...register('dealAmount')} />
              {errors.dealAmount && <p className="text-red-500 text-sm mt-1">{errors.dealAmount.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dateBooked" className="text-right">
              Date Booked
            </Label>
            <div className="col-span-3">
              <Input id="dateBooked" type="date" {...register('dateBooked')} />
              {errors.dateBooked && <p className="text-red-500 text-sm mt-1">{errors.dateBooked.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <div className="col-span-3">
              <Textarea id="notes" {...register('notes')} />
              {errors.notes && <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Repair Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}