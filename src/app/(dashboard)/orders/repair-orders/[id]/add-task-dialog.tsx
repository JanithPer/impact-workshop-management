"use client";

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { api } from '@/lib/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '@/types/user'; // Assuming User type for assignedPeople

// Zod schema for task validation
const taskSchema = z.object({
  name: z.string().min(1, 'Task name is required').max(100),
  description: z.string().max(500).optional(),
  status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
  colorMode: z.enum(['success', 'warning', 'danger', 'info']).default('success'),
  start: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Start date is required" }),
  end: z.string().optional(),
  assignedPeople: z.array(z.string()).optional(), // Array of user IDs
  // comments: z.array(z.string().max(1000)).optional(), // Comments might be handled differently
  // pictures: z.any().optional(), // File uploads need special handling
  onKanban: z.boolean().default(false),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repairOrderId: string;
  onTaskAdded: () => void; // Callback to refresh task list
}

// Mock function to fetch users - replace with your actual API call
const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get('/users'); // Adjust endpoint as needed
  return response.data.data;
};

export function AddTaskDialog({ open, onOpenChange, repairOrderId, onTaskAdded }: AddTaskDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'todo',
      colorMode: 'success',
      start: new Date().toISOString().split('T')[0],
      assignedPeople: [],
      onKanban: false,
    },
  });

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to load users for assignment.");
      }
      setIsLoadingUsers(false);
    };
    if (open) {
        loadUsers();
    }
  }, [open]);

  const mutation = useMutation({
    mutationFn: async (data: TaskFormData) => {
      const formData = new FormData();
      formData.append('repairOrder', repairOrderId);
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      formData.append('status', data.status);
      formData.append('colorMode', data.colorMode);
      formData.append('start', new Date(data.start).toISOString());
      if (data.end) formData.append('end', new Date(data.end).toISOString());
      if (data.assignedPeople) formData.append('assignedPeople', JSON.stringify(data.assignedPeople));
      // formData.append('comments', JSON.stringify(data.comments || []));
      formData.append('onKanban', String(data.onKanban));
      
      // Handle file uploads if you add 'pictures' to the form
      // if (data.pictures && data.pictures.length > 0) {
      //   for (let i = 0; i < data.pictures.length; i++) {
      //     formData.append('pictures', data.pictures[i]);
      //   }
      // }

      await api.post('/tasks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      toast.success('Task added successfully!');
      queryClient.invalidateQueries({ queryKey: ['tasks', repairOrderId] }); // Invalidate tasks for this specific repair order
      queryClient.invalidateQueries({ queryKey: ['tasks'] }); // Or a more general task query key
      onTaskAdded(); // Call the callback
      onOpenChange(false); // Close dialog on success
      reset(); // Reset form
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to add task. Please try again.';
      toast.error(errorMessage);
      console.error("Error adding task:", error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: TaskFormData) => {
    setIsSubmitting(true);
    mutation.mutate(data);
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new task for this repair order.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* Task Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <div className="col-span-3">
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <div className="col-span-3">
              <Textarea id="description" {...register('description')} />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <div className="col-span-3">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
            </div>
          </div>
          
          {/* Color Mode */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="colorMode" className="text-right">Color Tag</Label>
            <div className="col-span-3">
              <Controller
                name="colorMode"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="colorMode">
                      <SelectValue placeholder="Select color tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="success">Green</SelectItem>
                      <SelectItem value="warning">Yellow</SelectItem>
                      <SelectItem value="danger">Red</SelectItem>
                      <SelectItem value="info">Blue</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.colorMode && <p className="text-red-500 text-sm mt-1">{errors.colorMode.message}</p>}
            </div>
          </div>

          {/* Start Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start" className="text-right">Start Date</Label>
            <div className="col-span-3">
              <Input id="start" type="date" {...register('start')} />
              {errors.start && <p className="text-red-500 text-sm mt-1">{errors.start.message}</p>}
            </div>
          </div>

          {/* End Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end" className="text-right">End Date</Label>
            <div className="col-span-3">
              <Input id="end" type="date" {...register('end')} />
              {errors.end && <p className="text-red-500 text-sm mt-1">{errors.end.message}</p>}
            </div>
          </div>

          {/* Assigned People */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignedPeople" className="text-right">Assign To</Label>
            <div className="col-span-3">
                <Controller
                    name="assignedPeople"
                    control={control}
                    render={({ field }) => (
                        <Select 
                            onValueChange={(value) => field.onChange(value ? [value] : [])} // Assuming single select for now, adjust if multi-select needed
                            disabled={isLoadingUsers}
                        >
                            <SelectTrigger id="assignedPeople">
                                <SelectValue placeholder="Select user(s)" />
                            </SelectTrigger>
                            <SelectContent>
                                {isLoadingUsers ? (
                                    <SelectItem value="loading" disabled>Loading users...</SelectItem>
                                ) : (
                                    users.map(user => (
                                        <SelectItem key={user._id} value={user._id!}>
                                            {user.name} ({user.email})
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    )}
                />
              {errors.assignedPeople && <p className="text-red-500 text-sm mt-1">{errors.assignedPeople.message}</p>}
            </div>
          </div>
          
          {/* On Kanban Board */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="onKanban" className="text-right">Show on Kanban</Label>
            <div className="col-span-3 flex items-center">
              <Controller
                name="onKanban"
                control={control}
                render={({ field }) => (
                    <input type="checkbox" id="onKanban" checked={field.value} onChange={field.onChange} className="mr-2 h-4 w-4" />
                )}
              />
              <span className='text-sm text-muted-foreground'>If checked, this task will appear on the Kanban board.</span>
              {errors.onKanban && <p className="text-red-500 text-sm mt-1">{errors.onKanban.message}</p>}
            </div>
          </div>

          {/* TODO: Add fields for comments and picture uploads if needed */}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingUsers}>
              {isSubmitting ? 'Adding Task...' : 'Add Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}