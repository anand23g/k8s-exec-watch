import { useState, useMemo } from 'react';

interface ExecutionData {
  time: string;
  [key: string]: number | string;
}

interface StatsData {
  totalExecutions: Record<string, number>;
  peakExecutions: Record<string, number>;
  growthRate: Record<string, number>;
}

// Generate 22 tools for a more realistic enterprise scenario
const generateToolNames = (): string[] => [
  'START', 'JAVA', 'POSTMAN', 'BRUNO', 'CYPRESS', 'SELENIUM', 'PLAYWRIGHT', 'JEST',
  'MOCHA', 'PYTEST', 'UNITTEST', 'TESTNG', 'JUNIT', 'CUCUMBER', 'KARATE', 'REST_ASSURED',
  'NEWMAN', 'INSOMNIA', 'LOADRUNNER', 'JMETER', 'K6', 'ARTILLERY'
];

// Mock data generator for 22 tools
const generateMockDataPoint = (tools: string[]): ExecutionData => {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  const data: ExecutionData = { time: timeString };
  
  tools.forEach(tool => {
    // Vary execution patterns by tool type
    const baseExecution = tool.includes('LOAD') || tool.includes('PERFORMANCE') 
      ? Math.floor(Math.random() * 50) + 10  // Performance tools: lower volume
      : Math.floor(Math.random() * 120) + 20; // Regular tools: higher volume
    
    data[tool] = baseExecution;
  });
  
  return data;
};

const generateInitialData = (tools: string[]): ExecutionData[] => {
  const data: ExecutionData[] = [];
  const now = new Date();
  
  for (let i = 59; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60000);
    const timeString = timestamp.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const dataPoint: ExecutionData = { time: timeString };
    tools.forEach(tool => {
      const baseExecution = tool.includes('LOAD') || tool.includes('PERFORMANCE') 
        ? Math.floor(Math.random() * 50) + 10
        : Math.floor(Math.random() * 120) + 20;
      dataPoint[tool] = baseExecution;
    });
    
    data.push(dataPoint);
  }
  
  return data;
};

export const useScalableRealtimeData = () => {
  const tools = useMemo(() => generateToolNames(), []);
  const [executionData, setExecutionData] = useState<ExecutionData[]>(() => generateInitialData(tools));
  const [lastUpdate, setLastUpdate] = useState(() => new Date().toLocaleTimeString());

  const updateData = () => {
    const newDataPoint = generateMockDataPoint(tools);
    setExecutionData(prev => {
      const updated = [...prev.slice(1), newDataPoint];
      return updated;
    });
    setLastUpdate(new Date().toLocaleTimeString());
  };

  // Auto-update every 10 seconds
  useState(() => {
    const interval = setInterval(updateData, 10000);
    return () => clearInterval(interval);
  });

  const calculateStats = (): StatsData => {
    const lastHourData = executionData.slice(-60);
    
    const totalExecutions: Record<string, number> = {};
    const peakExecutions: Record<string, number> = {};
    const growthRate: Record<string, number> = {};
    
    tools.forEach(tool => {
      const toolData = lastHourData.map(d => d[tool] as number);
      totalExecutions[tool] = toolData.reduce((sum, val) => sum + val, 0);
      peakExecutions[tool] = Math.max(...toolData);
      
      // Calculate growth rate (simplified)
      const recent = toolData.slice(-10).reduce((sum, val) => sum + val, 0);
      const previous = toolData.slice(-20, -10).reduce((sum, val) => sum + val, 0);
      growthRate[tool] = previous > 0 ? Number(((recent - previous) / previous * 100).toFixed(1)) : 0;
    });
    
    return { totalExecutions, peakExecutions, growthRate };
  };

  return {
    tools,
    executionData,
    statsData: calculateStats(),
    lastUpdate
  };
};