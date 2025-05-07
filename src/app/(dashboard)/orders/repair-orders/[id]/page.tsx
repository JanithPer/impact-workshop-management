"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import PageHeader from "@/components/blocks/page-header";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from 'lucide-react';
import JobTaskCard from "@/components/blocks/job/job-task-card";
import { api } from "@/lib/axios"; // Assuming you have an api helper
import { toast } from "sonner";
import { RepairOrder } from '@/types/repair-order'; 
import { Task } from '@/types/task'; 
import { EditRepairOrderDialog } from "../edit-repair-order-dialog";
import { AddTaskDialog } from './add-task-dialog';

// Mock data for initial setup, replace with API calls
const initialTasks: Task[] = []; // Start with empty tasks

const RepairOrderDetailPage = () => {
    const router = useRouter();
    const params = useParams();
    const repairOrderId = params.id as string;

    const [repairOrder, setRepairOrder] = useState<RepairOrder | null>(null);
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // TODO: States for dialogs
    const [isEditRepairOrderDialogOpen, setIsEditRepairOrderDialogOpen] = useState(false);
    const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);

    useEffect(() => {
        if (repairOrderId) {
            const fetchRepairOrderDetails = async () => {
                setIsLoading(true);
                try {
                    // Fetch Repair Order Details
                    const repairOrderRes = await api.get(`/repair-orders/${repairOrderId}`);
                    setRepairOrder(repairOrderRes.data.data);

                    // Fetch Tasks for this Repair Order
                    // Assuming backend supports filtering tasks by repairOrder ID
                    // You might need to adjust the endpoint or query params
                    const tasksRes = await api.get(`/tasks?repairOrder=${repairOrderId}`); 
                    setTasks(tasksRes.data.data || []);
                    setError(null);
                } catch (err: any) {
                    console.error("Failed to fetch repair order details or tasks:", err);
                    setError(err.response?.data?.message || "Failed to load data. Please try again.");
                    toast.error(err.response?.data?.message || "Failed to load data.");
                }
                setIsLoading(false);
            };
            fetchRepairOrderDetails();
        }
    }, [repairOrderId]);

    const deleteTask = async (taskId: string) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            setTasks(tasks.filter(task => task._id !== taskId));
            toast.success("Task deleted successfully!");
        } catch (err: any) {
            console.error("Failed to delete task:", err);
            toast.error(err.response?.data?.message || "Failed to delete task.");
        }
    };

    if (isLoading) {
        return <div>Loading repair order details...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!repairOrder) {
        return <div>Repair order not found.</div>;
    }

    return (
        <div>
            <PageHeader firstLinkName="Orders" secondLinkName={`Repair Order: ${repairOrder.registrationNumber || repairOrderId}`} href={`/orders/repair-orders/${repairOrderId}`} />
            <div className="px-4 flex justify-between items-center">
                <h2 className="text-2xl">{repairOrder.customer?.name || 'Customer Name N/A'} - {repairOrder.registrationNumber}</h2>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-full cursor-pointer"
                        onClick={() => setIsEditRepairOrderDialogOpen(true)} // TODO: Implement Edit Dialog
                    >
                        <Pencil />
                    </Button>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className="rounded-full cursor-pointer"
                        onClick={() => setIsAddTaskDialogOpen(true)} // TODO: Implement Add Task Dialog
                    >
                        <Plus />
                    </Button>
                </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                <div className="flex flex-col items-left gap-y-1">
                    <p className="text-[12px] text-muted-foreground">Deal Amount</p>
                    <p>{repairOrder.dealAmount?.toLocaleString() || 'N/A'}</p>  
                </div>
                <div className="flex flex-col items-left gap-y-1">
                    <p className="text-[12px] text-muted-foreground">VIN</p>
                    <p>{repairOrder.vin || 'N/A'}</p>  
                </div>
                <div className="flex flex-col items-left gap-y-1">
                    <p className="text-[12px] text-muted-foreground">Date Booked</p>
                    <p>{repairOrder.dateBooked ? new Date(repairOrder.dateBooked).toLocaleDateString() : 'N/A'}</p>  
                </div>
                <div className="flex flex-col items-left gap-y-1">
                    <p className="text-[12px] text-muted-foreground">Kilometers</p>
                    <p>{repairOrder.kilometers?.toLocaleString() || 'N/A'}</p>  
                </div>
                <div className="flex flex-col items-left gap-y-1 col-span-full">
                    <p className="text-[12px] text-muted-foreground">Notes</p>
                    <p className="whitespace-pre-wrap">{repairOrder.notes || 'No notes provided.'}</p>  
                </div>
            </div>

            <div className="p-4">
                {tasks.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {tasks.map(task => (
                            <JobTaskCard 
                                key={task._id} 
                                task={task} 
                                deleteTask={() => deleteTask(task._id!)} // Ensure task._id is used
                                // TODO: Add props for editing task if needed
                            />
                        ))}
                    </div>
                ) : (
                    <p>No tasks found for this repair order.</p>
                )}
            </div>
            
            {isEditRepairOrderDialogOpen && repairOrder && (
                <EditRepairOrderDialog
                    open={isEditRepairOrderDialogOpen}
                    onOpenChange={setIsEditRepairOrderDialogOpen}
                    repairOrder={repairOrder} // Pass the full repairOrder object
                />
            )}
            {isAddTaskDialogOpen && repairOrder && (
                <AddTaskDialog
                    open={isAddTaskDialogOpen}
                    onOpenChange={setIsAddTaskDialogOpen}
                    repairOrderId={repairOrder._id!}
                    onTaskAdded={() => {
                        // Refetch tasks or update state optimistically
                        api.get(`/tasks?repairOrder=${repairOrderId}`).then(res => setTasks(res.data.data || [])).catch(err => toast.error("Failed to refresh tasks."));
                    }}
                />
            )}
        </div>
    );
}

export default RepairOrderDetailPage;