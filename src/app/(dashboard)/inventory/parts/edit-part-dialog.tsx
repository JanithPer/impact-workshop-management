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
import { Part } from "./columns"; // Import the Part type
import { useEffect } from "react";

// Define Zod schema (same as add dialog)
const partSchema = z.object({
  name: z.string().min(1, "Part Name is required").max(100),
  partNumber: z.string().min(1, "Part Number is required").max(50),
  lowStockValue: z.coerce.number().min(0, "Low Stock Value must be non-negative"),
  currentStock: z.coerce.number().min(0, "Current Stock must be non-negative"),
  costPrice: z.coerce.number().min(0, "Cost Price must be non-negative").optional(),
});

type PartFormValues = z.infer<typeof partSchema>;

interface EditPartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  part: Part; // Pass the part data to pre-fill the form
}

export function EditPartDialog({ open, onOpenChange, part }: EditPartDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<PartFormValues>({
    resolver: zodResolver(partSchema),
    // Default values are set using useEffect below
  });

  // Pre-fill form when part data changes
  useEffect(() => {
    if (part) {
      form.reset({
        name: part.name,
        partNumber: part.partNumber,
        lowStockValue: part.lowStockValue,
        currentStock: part.currentStock,
        costPrice: part.costPrice ?? 0, // Handle optional costPrice
      });
    }
  }, [part, form]);

  const mutation = useMutation({
    mutationFn: async (data: PartFormValues) => {
      // Assuming backend endpoint is '/parts/:id' for updating
      return api.put(`/parts/${part._id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      toast.success("Part updated successfully!");
      onOpenChange(false); // Close dialog on success
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to update part. Please try again.";
      toast.error(errorMessage);
      console.error("Error updating part:", error);
    },
  });

  const onSubmit = (data: PartFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Part</DialogTitle>
          <DialogDescription>
            Update the details for the part.
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
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}