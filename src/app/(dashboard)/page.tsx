import PageHeader from "@/components/blocks/page-header";
import { PartsStockChart } from "./dashboard-components/parts-stock-chart";
import { KanbanTasksChart } from "./dashboard-components/kanban-task-chart";
import { LowStockPartsChart } from "./dashboard-components/low-stock-parts-chart";
import RecentOrdersTable from "./dashboard-components/recent-orders-table";

export default function Page() {
  return (
    <>
      <PageHeader firstLinkName="Home" secondLinkName="Dashboard" />
      <div className="px-4 flex justify-between">
        <h2 className="text-2xl">Dashboard</h2>
      </div>
      <div className="flex flex-col gap-5 p-4 pt-4">
        <div className="grid auto-rows-min gap-4 sm:grid-cols-2 md:grid-cols-3 h-[400px]">
          <div className="bg-muted/50 rounded-xl h-full">
            <PartsStockChart />
          </div>
          <div className="bg-muted/50 rounded-xl h-full">
            <KanbanTasksChart />
          </div>
          <div className="bg-muted/50 rounded-xl h-full">
            <LowStockPartsChart />
          </div>
        </div>
        <RecentOrdersTable />
      </div>
    </>
  );
}