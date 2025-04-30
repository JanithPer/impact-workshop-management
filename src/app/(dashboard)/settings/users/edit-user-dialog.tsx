"use client"

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // Import Form components
import { User } from "./columns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { toast } from 'sonner';

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define Zod schema for validation
const editUserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50, { message: "Name cannot exceed 50 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  role: z.enum(['user', 'admin'], { required_error: "Role is required." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }).optional().or(z.literal('')), // Optional password
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      password: '',
    },
  });

  // Mutation for updating user
  const mutation = useMutation({
    mutationFn: async (updateData: EditUserFormValues) => {
      if (!user) throw new Error("User not selected");
      // Only include password if it's not empty
      const payload: Partial<EditUserFormValues> = { ...updateData };
      if (!payload.password || payload.password.trim() === '') {
        delete payload.password;
      }
      const response = await api.patch(`/users/${user._id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully!');
      onOpenChange(false);
      form.reset(); // Reset form on success
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to update user. Please try again.';
      toast.error(errorMessage);
      console.error("Error updating user:", error);
    },
  });

  // Populate form with user data when dialog opens or user changes
  useEffect(() => {
    if (user && open) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role as 'user' | 'admin',
        password: '', // Always clear password field on open
      });
    } else if (!open) {
        form.reset(); // Reset form when dialog closes
    }
  }, [user, open, form]);

  const onSubmit = (data: EditUserFormValues) => {
    mutation.mutate(data);
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to the user profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-4">
                <Avatar>
                    <AvatarImage src={user.avatar?.url} alt={`${user.name}'s avatar`} />
                    <AvatarFallback>
                    {user.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                {/* TODO: Add avatar upload/change functionality if needed */}
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="col-span-3" />
                  </FormControl>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} className="col-span-3" />
                  </FormControl>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="col-span-3" placeholder="Leave blank to keep current" />
                  </FormControl>
                  <FormMessage className="col-span-4 text-right" />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>Cancel</Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}