import { Badge } from "@/components/ui/badge";
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
      <div className="container mx-auto px-6 py-8 space-y-10">
        {/* Header with enhanced styling */}
        <div className="animate-fade-in">
          <MetricsHeader
            clusterName="k8s-prod-cluster"
            totalExecutions={totalExecutions}
            activeNamespaces={8}
            lastUpdate={lastUpdate}
          />
        </div>

        {/* 🚀 TOOLS FIRST - Featured Tool Grid */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-foreground bg-gradient-primary bg-clip-text text-transparent">
              🛠️ Your Testing Arsenal
            </h2>
            <Badge className="bg-tool-start text-white border-0">
              {tools.length} Active Tools
            </Badge>
          </div>
          <ToolGrid 
            tools={tools}
            totalExecutions={statsData.totalExecutions}
            growthRate={statsData.growthRate}
          />
        </div>

        {/* System Overview Cards */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <h2 className="text-xl font-semibold text-foreground">📊 System Overview</h2>
          <ToolSummary 
            tools={tools}
            totalExecutions={statsData.totalExecutions}
            growthRate={statsData.growthRate}
          />
        </div>

        {/* Performance Visualization */}
        <div className="animate-slide-up" style={{ animationDelay: '600ms' }}>
          <SimplifiedChart 
            tools={tools}
            totalExecutions={statsData.totalExecutions}
            growthRate={statsData.growthRate}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
