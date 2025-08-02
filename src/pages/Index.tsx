import { useState } from 'react';
import { MetricsHeader } from '@/components/dashboard/MetricsHeader';
import { ToolFilter, Tool } from '@/components/dashboard/ToolFilter';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ExecutionChart } from '@/components/dashboard/ExecutionChart';
import { useRealtimeData } from '@/hooks/useRealtimeData';

const Index = () => {
  const { executionData, statsData, lastUpdate } = useRealtimeData();

  const [tools, setTools] = useState<Tool[]>([
    { name: 'START', color: 'blue', enabled: true },
    { name: 'JAVA', color: 'orange', enabled: true },
    { name: 'POSTMAN', color: 'red', enabled: true },
    { name: 'BRUNO', color: 'green', enabled: true },
  ]);

  const handleToolToggle = (toolName: string) => {
    setTools(prev => prev.map(tool => 
      tool.name === toolName ? { ...tool, enabled: !tool.enabled } : tool
    ));
  };

  const getChangeType = (change: number): 'increase' | 'decrease' | 'neutral' => {
    if (change > 0) return 'increase';
    if (change < 0) return 'decrease';
    return 'neutral';
  };

  // Calculate total executions across all tools
  const totalExecutions = Object.values(statsData.totalExecutions).reduce((sum, val) => sum + val, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <MetricsHeader
          clusterName="k8s-prod-cluster"
          totalExecutions={totalExecutions}
          activeNamespaces={4}
          lastUpdate={lastUpdate}
        />

        {/* Tool Filters */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">Tool Filters</h2>
          <ToolFilter tools={tools} onToggle={handleToolToggle} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <StatsCard
              key={tool.name}
              title={`${tool.name} Executions`}
              value={statsData.totalExecutions[tool.name as keyof typeof statsData.totalExecutions]}
              change={statsData.growthRate[tool.name as keyof typeof statsData.growthRate]}
              changeType={getChangeType(statsData.growthRate[tool.name as keyof typeof statsData.growthRate])}
              toolName={tool.name}
              subtitle="Last 60 minutes"
            />
          ))}
        </div>

        {/* Peak Executions Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <StatsCard
              key={`peak-${tool.name}`}
              title={`Peak ${tool.name}`}
              value={statsData.peakExecutions[tool.name as keyof typeof statsData.peakExecutions]}
              change={0}
              changeType="neutral"
              toolName={tool.name}
              subtitle="Highest minute"
            />
          ))}
        </div>

        {/* Execution Chart */}
        <ExecutionChart data={executionData} tools={tools} />
      </div>
    </div>
  );
};

export default Index;
