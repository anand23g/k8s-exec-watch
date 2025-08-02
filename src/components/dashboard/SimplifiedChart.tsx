import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SimplifiedChartProps {
  tools: string[];
  totalExecutions: Record<string, number>;
  growthRate: Record<string, number>;
}

export function SimplifiedChart({ tools, totalExecutions, growthRate }: SimplifiedChartProps) {
  // Get top 10 tools by execution volume for the chart
  const topTools = tools
    .sort((a, b) => totalExecutions[b] - totalExecutions[a])
    .slice(0, 10)
    .map(tool => ({
      name: tool,
      executions: totalExecutions[tool],
      growth: growthRate[tool]
    }));

  const getBarColor = (growth: number) => {
    if (growth > 10) return 'hsl(142, 76%, 36%)'; // Green for high growth
    if (growth > 0) return 'hsl(217, 91%, 60%)';  // Blue for positive growth
    if (growth > -10) return 'hsl(25, 95%, 53%)'; // Orange for slight decline
    return 'hsl(0, 84%, 60%)'; // Red for significant decline
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          <p className="text-sm text-foreground">
            <span className="font-medium">Executions:</span> {data.executions.toLocaleString()}
          </p>
          <p className="text-sm" style={{ color: getBarColor(data.growth) }}>
            <span className="font-medium">Growth:</span> {data.growth > 0 ? '+' : ''}{data.growth}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Top 10 Tools - Execution Volume
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Showing highest volume tools with growth indicators
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topTools} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(224, 32%, 15%)" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(215, 20%, 65%)"
                fontSize={11}
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fill: 'hsl(215, 20%, 65%)' }}
              />
              <YAxis 
                stroke="hsl(215, 20%, 65%)"
                fontSize={12}
                tick={{ fill: 'hsl(215, 20%, 65%)' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="executions" 
                radius={[4, 4, 0, 0]}
              >
                {topTools.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(entry.growth)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(142, 76%, 36%)' }} />
            <span className="text-muted-foreground">High Growth (+10%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(217, 91%, 60%)' }} />
            <span className="text-muted-foreground">Positive (0-10%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(25, 95%, 53%)' }} />
            <span className="text-muted-foreground">Slight Decline (0-10%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(0, 84%, 60%)' }} />
            <span className="text-muted-foreground">Significant Decline (-10%+)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}