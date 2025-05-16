import { KanbanBoard } from "@/components/blocks/kanban/kanban-board"
import PageHeader from "@/components/blocks/page-header"

const KanbanBoardPage = () => {
  return (
    <div>
      <PageHeader firstLinkName="Projects" secondLinkName="Kanban Board" />
      <div className="px-4 flex justify-between">
        <h2 className="text-2xl">Projects Board</h2>
      </div>
      <KanbanBoard />
    </div>
  )
}

export default KanbanBoardPage