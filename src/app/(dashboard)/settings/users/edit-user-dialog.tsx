"use client"

import React, { useEffect, useState } from 'react'; // Added useState
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
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const editUserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50, { message: "Name cannot exceed 50 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  role: z.enum(['user', 'admin', 'technician',  'apprentice'], { required_error: "Role is required." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }).optional().or(z.literal('')), // Optional password
  avatar: z
    .instanceof(File, { message: "Avatar must be a file." })
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      password: '',
      avatar: undefined,
    },
  });

  // Mutation for updating user
  const mutation = useMutation({
    mutationFn: async (formData: FormData | EditUserFormValues) => {
      if (!user) throw new Error("User not selected");

      const headers = formData instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' };

      const response = await api.patch(`/users/${user._id}`, formData, { headers });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully!');
      onOpenChange(false);
      form.reset(); // Reset form on success
      setPreview(null); // Clear preview on success
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
        role: user.role as 'user' | 'admin' | 'technician' | 'apprentice',
        password: '', // Always clear password field on open
        avatar: undefined, // Clear avatar file input
      });
      setPreview(user.avatar?.url || null); // Set initial preview
    } else if (!open) {
        form.reset(); // Reset form when dialog closes
        setPreview(null); // Clear preview when dialog closes
    }
  }, [user, open, form]);

  const onSubmit = (data: EditUserFormValues) => {
    let submissionData: FormData | EditUserFormValues;

    if (data.avatar) {
      submissionData = new FormData();
      submissionData.append('name', data.name);
      submissionData.append('email', data.email);
      submissionData.append('role', data.role);
      if (data.password && data.password.trim() !== '') {
        submissionData.append('password', data.password);
      }
      submissionData.append('avatar', data.avatar);
    } else {
      // Send JSON if no avatar is uploaded
      submissionData = { ...data };
      delete submissionData.avatar; // Remove avatar field if empty
      if (!submissionData.password || submissionData.password.trim() === '') {
        delete submissionData.password; // Remove password if empty
      }
    }

    mutation.mutate(submissionData);
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
                <Avatar className="h-20 w-20">
                    <AvatarImage src={preview || user.avatar?.url} alt={`${user.name}'s avatar`} />
                    <AvatarFallback className="text-xl">
                    {user.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Change Avatar</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            onChange(file);
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setPreview(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            } else {
                              setPreview(user.avatar?.url || null); // Revert to original if no file selected
                            }
                          }}
                          {...rest}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="apprentice">Apprentice</SelectItem>
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