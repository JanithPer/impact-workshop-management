"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Define Zod schema for form validation based on Mongoose schema
const partSchema = z.object({
  name: z.string().min(1, "Part Name is required").max(100),
  partNumber: z.string().min(1, "Part Number is required").max(50),
  lowStockValue: z.coerce.number().min(0, "Low Stock Value must be non-negative"),
  currentStock: z.coerce.number().min(0, "Current Stock must be non-negative"),
  costPrice: z.coerce.number().min(0, "Cost Price must be non-negative").optional(),
});

type PartFormValues = z.infer<typeof partSchema>;

interface AddPartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPartDialog({ open, onOpenChange }: AddPartDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<PartFormValues>({
    resolver: zodResolver(partSchema),
    defaultValues: {
      name: "",
      partNumber: "",
      lowStockValue: 0,
      currentStock: 0,
      costPrice: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: PartFormValues) => {
      // Assuming backend endpoint is '/parts' for creating
      return api.post("/parts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      toast.success("Part added successfully!");
      onOpenChange(false); // Close dialog on success
      form.reset(); // Reset form after successful submission
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to add part. Please try again.";
      toast.error(errorMessage);
      console.error("Error adding part:", error);
    },
  });

  const onSubmit = (data: PartFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Part</DialogTitle>
          <DialogDescription>
            Fill in the details for the new part.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter part name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="partNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter part number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currentStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Stock</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter current stock" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lowStockValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Low Stock Threshold</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter low stock value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="costPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost Price (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter cost price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Adding..." : "Add Part"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}