import { Badge } from "@/components/ui/badge";
import { Activity, Server, Clock } from "lucide-react";

interface MetricsHeaderProps {
  clusterName: string;
  totalExecutions: number;
  activeNamespaces: number;
  lastUpdate: string;
}

export function MetricsHeader({ clusterName, totalExecutions, activeNamespaces, lastUpdate }: MetricsHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Real-time test execution monitoring for Kubernetes cluster
        </p>
      </div>
      
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Server className="w-4 h-4 text-tool-start" />
          <span className="text-sm text-foreground font-medium">{clusterName}</span>
        </div>
        
        <Badge variant="outline" className="border-tool-start/30 text-tool-start">
          <Activity className="w-3 h-3 mr-1" />
          {totalExecutions.toLocaleString()} executions/hour
        </Badge>
        
        <Badge variant="outline" className="border-tool-java/30 text-tool-java">
          <Server className="w-3 h-3 mr-1" />
          {activeNamespaces} namespaces
        </Badge>
        
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Last updated: {lastUpdate}</span>
        </div>
      </div>
    </div>
  );
}