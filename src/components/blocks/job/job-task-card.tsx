import { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "../../../app/(dashboard)/orders/job/data";
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
  deleteTask: (id: string) => void;
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
            <h3 className={cn(
              "text-lg font-semibold cursor-pointer hover:underline",
              isChecked && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
          </div>
          
          {task.assignedPeople.length > 0 && (
            <div className="flex items-center gap-0.5">
              {task.assignedPeople.map(person => (
                <Avatar key={person.id} className="h-8 w-8">
                  <AvatarImage 
                    src={person.avatar} 
                    alt={person.name}
                  />
                </Avatar>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="size-7"
            onClick={() => deleteTask(task.id)}
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