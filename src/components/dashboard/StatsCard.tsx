import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  toolName?: string;
  subtitle?: string;
}

export function StatsCard({ title, value, change, changeType, toolName, subtitle }: StatsCardProps) {
  const getTrendIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-400';
      case 'decrease':
        return 'text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="bg-gradient-card border-border/50 hover:border-border transition-all duration-300 shadow-card hover:shadow-glow group">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {toolName && (
            <div 
              className={`w-3 h-3 rounded-full bg-tool-${toolName.toLowerCase()} shadow-sm`}
            />
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-3xl font-bold font-mono text-foreground group-hover:scale-105 transition-transform duration-200">
          {value.toLocaleString()}
        </div>
        <div className="flex items-center space-x-2">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-muted-foreground">
            vs previous hour
          </span>
        </div>
      </CardContent>
    </Card>
  );
}