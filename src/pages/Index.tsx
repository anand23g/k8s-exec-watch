import { MetricsHeader } from '@/components/dashboard/MetricsHeader';
import { ToolSummary } from '@/components/dashboard/ToolSummary';
import { ToolGrid } from '@/components/dashboard/ToolGrid';
import { SimplifiedChart } from '@/components/dashboard/SimplifiedChart';
import { useScalableRealtimeData } from '@/hooks/useScalableRealtimeData';

const Index = () => {
  const { tools, executionData, statsData, lastUpdate } = useScalableRealtimeData();

  // Calculate total executions across all tools
  const totalExecutions = Object.values(statsData.totalExecutions).reduce((sum, val) => sum + val, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header with simplified metrics */}
        <MetricsHeader
          clusterName="k8s-prod-cluster"
          totalExecutions={totalExecutions}
          activeNamespaces={8}
          lastUpdate={lastUpdate}
        />

        {/* High-level summary cards */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">System Overview</h2>
          <ToolSummary 
            tools={tools}
            totalExecutions={statsData.totalExecutions}
            growthRate={statsData.growthRate}
          />
        </div>

        {/* Simplified visualization */}
        <SimplifiedChart 
          tools={tools}
          totalExecutions={statsData.totalExecutions}
          growthRate={statsData.growthRate}
        />

        {/* Detailed tool grid */}
        <ToolGrid 
          tools={tools}
          totalExecutions={statsData.totalExecutions}
          growthRate={statsData.growthRate}
        />
      </div>
    </div>
  );
};

export default Index;
