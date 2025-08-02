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
      <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500 animate-scale-in group">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            🎯 Total Executions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold font-mono text-foreground group-hover:scale-110 transition-transform duration-300 bg-gradient-primary bg-clip-text text-transparent">
            {totalAllExecutions.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground mt-2 flex items-center">
            <span className="mr-2">⚡</span>
            Across {tools.length} active tools
          </p>
        </CardContent>
      </Card>

      {/* Average per Tool */}
      <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500 animate-scale-in group" style={{ animationDelay: '100ms' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            📊 Average per Tool
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold font-mono text-foreground group-hover:scale-110 transition-transform duration-300">
            {averageExecutions.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground mt-2 flex items-center">
            <span className="mr-2">🔄</span>
            Executions/hour
          </p>
        </CardContent>
      </Card>

      {/* Active Tools Status */}
      <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500 animate-scale-in group" style={{ animationDelay: '200ms' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            🔥 Tool Health Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-base font-medium text-foreground">{stableTools} Stable Tools</span>
          </div>
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-tool-start" />
            <span className="text-base font-medium text-foreground">{growingTools.length} Growing Fast</span>
          </div>
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-tool-postman" />
            <span className="text-base font-medium text-foreground">{decliningTools.length} Need Attention</span>
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-glow transition-all duration-500 animate-scale-in group" style={{ animationDelay: '300ms' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            🏆 Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPerformers.slice(0, 3).map((tool, index) => (
              <div key={tool} className="flex items-center justify-between group/item hover:bg-accent/20 p-2 rounded-lg transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="text-xs px-3 py-1 font-bold bg-gradient-primary text-white border-0">
                    #{index + 1}
                  </Badge>
                  <span className="text-base font-semibold group-hover/item:text-tool-start transition-colors duration-200">{tool}</span>
                </div>
                <span className="text-sm text-muted-foreground font-mono font-medium group-hover/item:text-foreground transition-colors duration-200">
                  🚀 {totalExecutions[tool].toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}