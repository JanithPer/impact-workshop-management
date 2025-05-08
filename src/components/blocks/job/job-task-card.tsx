import { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Trash, KanbanSquare } from "lucide-react"; // Added KanbanSquare import
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Task } from "@/types/task"
import { Checkbox } from "@/components/ui/checkbox";

const colorModes = {
  success: 'bg-green-500',
  danger: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
} as const

type ColorMode = keyof typeof colorModes

interface JobTaskCardProps {
  task: Task;
  deleteTask: (_id: string) => void;
}

const JobTaskCard = ({ task, deleteTask }: JobTaskCardProps) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Card className="p-4 relative overflow-hidden">
      {/* Color strip */}
      <div className={cn(
        'absolute left-0 top-0 h-full w-1.5',
        colorModes[task.colorMode as ColorMode] || 'bg-gray-500'
      )} />
      
      <div className='flex justify-between pl-2'>
        <div className='flex flex-col gap-2 w-full'>
          <div className="flex items-center gap-2">
            <Checkbox 
              className="cursor-pointer"
              checked={isChecked}
              onCheckedChange={(checked) => setIsChecked(!!checked)}
            />
            <Link href={`/orders/job/task/${task._id}`} passHref>
              <h3 className={cn(
                "text-lg font-semibold cursor-pointer hover:underline",
                isChecked && "line-through text-muted-foreground"
              )}>
                {task.name}
              </h3>
            </Link>
          </div>
          
          {task.assignedPeople && task.assignedPeople.length > 0 && (
            <div className="flex items-center gap-0.5">
              {task.assignedPeople.map(person => (
                <Avatar key={person.id} className="h-8 w-8">
                  <AvatarImage 
                    src={person.avatar.url} 
                    alt={person.name}
                  />
                </Avatar>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex gap-1"> {/* Wrapped buttons in a flex container */} 
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="size-7 cursor-pointer"
                  onClick={() => console.log('Add to Kanban clicked for task:', task._id)} // Placeholder onClick
                >
                  <KanbanSquare className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add to kanban</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button 
            variant="ghost" 
            size="icon" 
            className="size-7"
            onClick={() => deleteTask(task._id)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground pl-2 mt-2">{task.description}</p>
    </Card>
  )
}

export default JobTaskCard