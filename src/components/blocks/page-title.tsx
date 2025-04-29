import { Plus, Trash, Download } from 'lucide-react';
import { Button } from '../ui/button';

interface PageTitleProps {
  name: string;
  onDelete?: () => void;
  deleteDisabled?: boolean;
}

const PageTitle: React.FC<PageTitleProps>= ({ name, onDelete, deleteDisabled }) => {
  return (
    <>
    <div className="px-4 flex justify-between">
      <h2 className="text-2xl">{name}</h2>
      <div className="flex gap-2">
      <Button variant="outline" size="icon" className="rounded-full cursor-pointer">
        <Plus />
      </Button>  
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full cursor-pointer"
        onClick={onDelete}
        disabled={deleteDisabled}
      >
        <Trash />
      </Button>
      <Button variant="outline" size="icon" className="rounded-full cursor-pointer">
        <Download />
      </Button>
      </div>
      </div>
    </>
  )
}

export default PageTitle