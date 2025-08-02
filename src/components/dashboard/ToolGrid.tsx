import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ToolGridProps {
  tools: string[];
  totalExecutions: Record<string, number>;
  growthRate: Record<string, number>;
}

export function ToolGrid({ tools, totalExecutions, growthRate }: ToolGridProps) {
  const [sortBy, setSortBy] = useState<'name' | 'executions' | 'growth'>('executions');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showAll, setShowAll] = useState(false);

  const sortedTools = [...tools].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.localeCompare(b);
        break;
      case 'executions':
        comparison = totalExecutions[a] - totalExecutions[b];
        break;
      case 'growth':
        comparison = growthRate[a] - growthRate[b];
        break;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  const displayedTools = showAll ? sortedTools : sortedTools.slice(0, 12);

  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const getTrendIcon = (change: number) => {
    if (change > 5) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (change < -5) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 5) return 'text-green-400';
    if (change < -5) return 'text-red-400';
    return 'text-muted-foreground';
  };

  const getToolCategory = (tool: string) => {
    if (tool.includes('SELENIUM') || tool.includes('CYPRESS') || tool.includes('PLAYWRIGHT')) return 'UI';
    if (tool.includes('POSTMAN') || tool.includes('NEWMAN') || tool.includes('REST')) return 'API';
    if (tool.includes('LOAD') || tool.includes('JMETER') || tool.includes('K6')) return 'PERF';
    if (tool.includes('JEST') || tool.includes('MOCHA') || tool.includes('PYTEST')) return 'UNIT';
    return 'OTHER';
  };

  const categoryColors = {
    'UI': 'bg-tool-start/20 text-tool-start border-tool-start/30',
    'API': 'bg-tool-java/20 text-tool-java border-tool-java/30',
    'PERF': 'bg-tool-postman/20 text-tool-postman border-tool-postman/30',
    'UNIT': 'bg-tool-bruno/20 text-tool-bruno border-tool-bruno/30',
    'OTHER': 'bg-muted/20 text-muted-foreground border-muted/30'
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">
            Tool Performance Grid
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort('name')}
              className="text-xs"
            >
              Name {sortBy === 'name' && (sortOrder === 'desc' ? <ChevronDown className="w-3 h-3 ml-1" /> : <ChevronUp className="w-3 h-3 ml-1" />)}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort('executions')}
              className="text-xs"
            >
              Volume {sortBy === 'executions' && (sortOrder === 'desc' ? <ChevronDown className="w-3 h-3 ml-1" /> : <ChevronUp className="w-3 h-3 ml-1" />)}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort('growth')}
              className="text-xs"
            >
              Growth {sortBy === 'growth' && (sortOrder === 'desc' ? <ChevronDown className="w-3 h-3 ml-1" /> : <ChevronUp className="w-3 h-3 ml-1" />)}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedTools.map((tool) => {
            const category = getToolCategory(tool);
            return (
              <div
                key={tool}
                className="p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-card/80 transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm text-foreground truncate">
                    {tool}
                  </h3>
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-2 py-0 ${categoryColors[category]}`}
                  >
                    {category}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Executions</span>
                    <span className="text-sm font-mono font-medium text-foreground">
                      {totalExecutions[tool]?.toLocaleString() || '0'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Growth</span>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(growthRate[tool] || 0)}
                      <span className={`text-xs font-medium ${getTrendColor(growthRate[tool] || 0)}`}>
                        {Math.abs(growthRate[tool] || 0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {tools.length > 12 && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="text-sm"
            >
              {showAll ? 'Show Less' : `Show All ${tools.length} Tools`}
              {showAll ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}