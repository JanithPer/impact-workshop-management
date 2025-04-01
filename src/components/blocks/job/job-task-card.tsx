import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash } from "lucide-react"
import { cn } from "@/lib/utils"
import { Task } from "../../../app/(dashboard)/orders/job/data" // Import the Task interface
import { Checkbox } from "@/components/ui/checkbox"

interface JobTaskCardProps {
  task: Task;
  deleteTask: (id: string) => void;
}

const JobTaskCard = ({ task, deleteTask }: JobTaskCardProps) => {
  return (
    <Card className="p-4 relative overflow-hidden">
      {/* Color strip */}
      <div className={cn(
        'absolute left-0 top-0 h-full w-1.5',
        task.colorClass
      )} />
      
      <div className='flex justify-between pl-2'>
        <div className='flex flex-col gap-2'>
          <div className="flex items-center gap-2">
          <Checkbox />
          <h3 className="text-lg font-semibold">{task.title}</h3>
          </div>
          <div className="flex items-center gap-0.5">
            <Avatar>
              <AvatarImage 
                src={task.avatar} 
                alt={task.title}
              />
            </Avatar>
            <Avatar>
            <AvatarImage 
              src={task.avatar} 
              alt={task.title}
            />
          </Avatar>
          <Avatar>
            <AvatarImage 
              src={task.avatar} 
              alt={task.title}
            />
          </Avatar>
          </div>
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
      <p className="text-sm text-muted-foreground pl-2">{task.description}</p>
    </Card>
  )
}

export default JobTaskCard