import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";

interface ToolSummaryProps {
  tools: string[];
  totalExecutions: Record<string, number>;
  growthRate: Record<string, number>;
}

export function ToolSummary({ tools, totalExecutions, growthRate }: ToolSummaryProps) {
  // Calculate summary statistics
  const totalAllExecutions = Object.values(totalExecutions).reduce((sum, val) => sum + val, 0);
  const averageExecutions = Math.round(totalAllExecutions / tools.length);
  
  // Categorize tools by performance
  const topPerformers = tools
    .sort((a, b) => totalExecutions[b] - totalExecutions[a])
    .slice(0, 5);
    
  const growingTools = tools
    .filter(tool => growthRate[tool] > 10)
    .sort((a, b) => growthRate[b] - growthRate[a]);
    
  const decliningTools = tools
    .filter(tool => growthRate[tool] < -10)
    .sort((a, b) => growthRate[a] - growthRate[b]);

  const stableTools = tools.filter(tool => 
    Math.abs(growthRate[tool]) <= 10
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Executions */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Executions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-mono text-foreground">
            {totalAllExecutions.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Across {tools.length} tools
          </p>
        </CardContent>
      </Card>

      {/* Average per Tool */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Average per Tool
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-mono text-foreground">
            {averageExecutions.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Executions/hour
          </p>
        </CardContent>
      </Card>

      {/* Active Tools Status */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Tool Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-foreground">{stableTools} Stable</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-tool-start" />
            <span className="text-sm text-foreground">{growingTools.length} Growing</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-tool-postman" />
            <span className="text-sm text-foreground">{decliningTools.length} Declining</span>
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {topPerformers.slice(0, 3).map((tool, index) => (
              <div key={tool} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs px-2 py-0 font-mono">
                    #{index + 1}
                  </Badge>
                  <span className="text-sm font-medium">{tool}</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {totalExecutions[tool].toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}