import React from 'react'
import { Button } from '../ui/button'
import { Plus, Trash, Download } from 'lucide-react';

interface PageTitleProps {
  name: string;
}

const PageTitle: React.FC<PageTitleProps>= ({ name }) => {
  return (
    <>
    <div className="px-4 flex justify-between">
      <h2 className="text-2xl">{name}</h2>
      <div className="flex gap-2">
      <Button variant="outline" size="icon" className="rounded-full cursor-pointer">
        <Plus />
      </Button>  
      <Button variant="outline" size="icon" className="rounded-full cursor-pointer">
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