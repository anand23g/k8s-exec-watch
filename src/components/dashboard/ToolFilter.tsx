import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Tool {
  name: string;
  color: string;
  enabled: boolean;
}

interface ToolFilterProps {
  tools: Tool[];
  onToggle: (toolName: string) => void;
}

export function ToolFilter({ tools, onToggle }: ToolFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tools.map((tool) => (
        <Button
          key={tool.name}
          variant={tool.enabled ? "default" : "outline"}
          size="sm"
          onClick={() => onToggle(tool.name)}
          className={`
            transition-all duration-200 hover:scale-105
            ${tool.enabled 
              ? `bg-gradient-tool-${tool.name.toLowerCase()} hover:opacity-90 text-white` 
              : 'hover:border-opacity-60'
            }
          `}
        >
          <div 
            className={`w-3 h-3 rounded-full mr-2 ${
              tool.enabled ? 'bg-white/30' : `bg-tool-${tool.name.toLowerCase()}`
            }`}
          />
          {tool.name}
          <Badge 
            variant="secondary" 
            className="ml-2 text-xs font-mono bg-black/20 text-white border-0"
          >
            {tool.enabled ? 'ON' : 'OFF'}
          </Badge>
        </Button>
      ))}
    </div>
  );
}