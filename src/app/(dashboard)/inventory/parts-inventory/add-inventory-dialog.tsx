"use client";

import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Define Zod schema for form validation
const inventorySchema = z.object({
  serviceType: z.enum(["buy", "sell"], { required_error: "Service Type is required." }),
  part: z.string().min(1, "Part is required."), // Part ID
  recordedBy: z.string().min(1, "Recorded By is required."), // User ID
  numberOfParts: z.coerce.number().min(1, "Number of Parts must be at least 1."),
  entryDate: z.date({ required_error: "Entry Date is required." }),
});

type InventoryFormValues = z.infer<typeof inventorySchema>;

interface Part {
  _id: string;
  name: string;
  partNumber: string;
}

interface User {
  _id: string;
  name: string;
}

interface AddInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddInventoryDialog({ open, onOpenChange }: AddInventoryDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      serviceType: undefined,
      part: "",
      recordedBy: "",
      numberOfParts: 1,
      entryDate: new Date(),
    },
  });

  const { data: parts, isLoading: isLoadingParts } = useQuery<Part[]>({
    queryKey: ['parts'],
    queryFn: async () => {
      const response = await api.get('/parts');
      return response.data.data; // Assuming API returns { message: '...', data: [...] }
    },
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data.data; // Assuming API returns { message: '...', data: [...] }
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InventoryFormValues) => {
      return api.post("/inventory", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success("Inventory item added successfully!");
      onOpenChange(false); 
      form.reset(); 
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Failed to add inventory item. Please try again.";
      toast.error(errorMessage);
      console.error("Error adding inventory item:", error);
    },
  });

  const onSubmit = (data: InventoryFormValues) => {
    mutation.mutate(data);
  };

  useEffect(() => {
    if (!open) {
      form.reset({
        serviceType: undefined,
        part: "",
        recordedBy: "",
        numberOfParts: 1,
        entryDate: new Date(),
      });
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add New Inventory Entry</DialogTitle>
          <DialogDescription>
            Fill in the details for the new inventory transaction.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="part"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingParts}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingParts ? "Loading parts..." : "Select a part"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {parts?.map((part) => (
                        <SelectItem key={part._id} value={part._id}>
                          {part.name} ({part.partNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfParts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Parts</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter number of parts" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="entryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Entry Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recordedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recorded By</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingUsers}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingUsers ? "Loading users..." : "Select user"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users?.map((user) => (
                        <SelectItem key={user._id} value={user._id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending || isLoadingParts || isLoadingUsers}>
                {mutation.isPending ? "Adding..." : "Add Inventory Entry"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}