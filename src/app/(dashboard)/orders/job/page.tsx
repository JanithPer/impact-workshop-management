"use client"

import PageHeader from "@/components/blocks/page-header"
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from 'lucide-react';

import { useState } from "react"
import { tasks as initialTasks } from "./data"
import JobTaskCard from "@/components/blocks/job/job-task-card";

const JobPage = () => {
    const [tasks, setTasks] = useState(initialTasks)
    const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
    }

  return (
    <div>
        <PageHeader firstLinkName="Orders" secondLinkName="Job Page" />
        <div className="px-4 flex justify-between">
            <h2 className="text-2xl">South Coast Party Hire</h2>
            <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-full cursor-pointer">
                <Pencil />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full cursor-pointer">
                <Plus />
            </Button>
            </div>
        </div>

        <div className="p-4 flex justify-between items-center">
        <div className="flex flex-col items-left gap-y-1">
          <p className="text-[12px] text-muted-foreground">Deal Amount</p>
          <p>142,275</p>  
        </div>
        <div className="flex flex-col items-left gap-y-1">
          <p className="text-[12px] text-muted-foreground">VIN</p>
          <p>JAANSKGJSDDAKFGJAFSDJOG</p>  
        </div>
        <div className="flex flex-col items-left gap-y-1">
          <p className="text-[12px] text-muted-foreground">Date booked</p>
          <p>March 14, 2025</p>  
        </div>
        <div className="flex flex-col items-left gap-y-1">
          <p className="text-[12px] text-muted-foreground">	Notes</p>
          <p>B service as required, front brake, 
            rego check</p>  
        </div>
        </div>

    <div className="p-4 flex flex-col gap-2">
      {tasks.map(task => (
        <JobTaskCard 
          key={task.id} 
          task={task} 
          deleteTask={deleteTask} 
        />
      ))}
    </div>

    </div>
  )
}

export default JobPage