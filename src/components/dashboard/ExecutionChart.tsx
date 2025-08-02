import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Tool } from './ToolFilter';

interface ExecutionData {
  time: string;
  START: number;
  JAVA: number;
  POSTMAN: number;
  BRUNO: number;
}

interface ExecutionChartProps {
  data: ExecutionData[];
  tools: Tool[];
}

export function ExecutionChart({ data, tools }: ExecutionChartProps) {
  const getToolColor = (toolName: string) => {
    switch (toolName.toLowerCase()) {
      case 'start':
        return 'hsl(217, 91%, 60%)';
      case 'java':
        return 'hsl(25, 95%, 53%)';
      case 'postman':
        return 'hsl(0, 84%, 60%)';
      case 'bruno':
        return 'hsl(142, 76%, 36%)';
      default:
        return 'hsl(217, 91%, 60%)';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.dataKey}:</span> {entry.value} executions
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Real-Time Execution Trends
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Last 60 minutes • Auto-refreshing every 10 seconds
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(224, 32%, 15%)" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(215, 20%, 65%)"
                fontSize={12}
                tick={{ fill: 'hsl(215, 20%, 65%)' }}
              />
              <YAxis 
                stroke="hsl(215, 20%, 65%)"
                fontSize={12}
                tick={{ fill: 'hsl(215, 20%, 65%)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: 'hsl(215, 20%, 65%)' }}
              />
              {tools.map((tool) => (
                tool.enabled && (
                  <Line
                    key={tool.name}
                    type="monotone"
                    dataKey={tool.name}
                    stroke={getToolColor(tool.name)}
                    strokeWidth={2}
                    dot={{ r: 4, fill: getToolColor(tool.name) }}
                    activeDot={{ r: 6, fill: getToolColor(tool.name) }}
                    connectNulls={false}
                  />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}