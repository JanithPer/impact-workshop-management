import PageHeader from "@/components/blocks/page-header";
import PageTitle from "@/components/blocks/page-title";
import TestChart from "./dashboard-components/test-chart";
import { ChartBarDefault } from "./dashboard-components/chart-bar-default";
import { ChartLineDefault } from "./dashboard-components/chart-lines-default";
import { PartsStockChart } from "./dashboard-components/parts-stock-chart";
import { ChartPieSimple } from "./dashboard-components/chart-pie-simple";
import { KanbanTasksChart } from "./dashboard-components/kanban-task-chart";
import { ChartBarMultiple } from "./dashboard-components/chart-bar-multiple";
import { LowStockPartsChart } from "./dashboard-components/low-stock-parts-chart";

export default function Page() {
  return (
    <>
      <PageHeader firstLinkName="Home" secondLinkName="Dashboard" />
      <div className="px-4 flex justify-between">
        <h2 className="text-2xl">Dashboard</h2>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
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
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </div>
    </>
  );
}