import { useState, useEffect, useCallback } from 'react';

interface ExecutionData {
  time: string;
  START: number;
  JAVA: number;
  POSTMAN: number;
  BRUNO: number;
}

interface StatsData {
  totalExecutions: {
    START: number;
    JAVA: number;
    POSTMAN: number;
    BRUNO: number;
  };
  peakExecutions: {
    START: number;
    JAVA: number;
    POSTMAN: number;
    BRUNO: number;
  };
  growthRate: {
    START: number;
    JAVA: number;
    POSTMAN: number;
    BRUNO: number;
  };
}

// Mock data generator to simulate real-time Kubernetes metrics
const generateMockData = (): ExecutionData => {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return {
    time: timeString,
    START: Math.floor(Math.random() * 100) + 20, // 20-120 executions
    JAVA: Math.floor(Math.random() * 80) + 30,   // 30-110 executions
    POSTMAN: Math.floor(Math.random() * 90) + 25, // 25-115 executions
    BRUNO: Math.floor(Math.random() * 70) + 15    // 15-85 executions
  };
};

const generateInitialData = (): ExecutionData[] => {
  const data: ExecutionData[] = [];
  const now = new Date();
  
  // Generate 60 data points for the last 60 minutes
  for (let i = 59; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60000);
    const timeString = timestamp.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    data.push({
      time: timeString,
      START: Math.floor(Math.random() * 100) + 20,
      JAVA: Math.floor(Math.random() * 80) + 30,
      POSTMAN: Math.floor(Math.random() * 90) + 25,
      BRUNO: Math.floor(Math.random() * 70) + 15
    });
  }
  
  return data;
};

export const useRealtimeData = () => {
  const [executionData, setExecutionData] = useState<ExecutionData[]>(() => generateInitialData());
  const [lastUpdate, setLastUpdate] = useState(() => new Date().toLocaleTimeString());

  const updateData = useCallback(() => {
    const newDataPoint = generateMockData();
    setExecutionData(prev => {
      const updated = [...prev.slice(1), newDataPoint]; // Keep last 60 points
      return updated;
    });
    setLastUpdate(new Date().toLocaleTimeString());
  }, []);

  useEffect(() => {
    // Update every 10 seconds to simulate real-time data
    const interval = setInterval(updateData, 10000);
    return () => clearInterval(interval);
  }, [updateData]);

  // Calculate statistics
  const calculateStats = useCallback((): StatsData => {
    const lastHourData = executionData.slice(-60); // Last 60 minutes
    const previousHourData = executionData.slice(-120, -60); // Previous 60 minutes (simulated)
    
    const calculateTotals = (data: ExecutionData[]) => ({
      START: data.reduce((sum, d) => sum + d.START, 0),
      JAVA: data.reduce((sum, d) => sum + d.JAVA, 0),
      POSTMAN: data.reduce((sum, d) => sum + d.POSTMAN, 0),
      BRUNO: data.reduce((sum, d) => sum + d.BRUNO, 0)
    });

    const calculatePeaks = (data: ExecutionData[]) => ({
      START: Math.max(...data.map(d => d.START)),
      JAVA: Math.max(...data.map(d => d.JAVA)),
      POSTMAN: Math.max(...data.map(d => d.POSTMAN)),
      BRUNO: Math.max(...data.map(d => d.BRUNO))
    });

    const currentTotals = calculateTotals(lastHourData);
    const previousTotals = previousHourData.length > 0 
      ? calculateTotals(previousHourData)
      : currentTotals; // Fallback for initial state

    const calculateGrowthRate = (current: number, previous: number) => {
      if (previous === 0) return 0;
      return Number(((current - previous) / previous * 100).toFixed(1));
    };

    return {
      totalExecutions: currentTotals,
      peakExecutions: calculatePeaks(lastHourData),
      growthRate: {
        START: calculateGrowthRate(currentTotals.START, previousTotals.START),
        JAVA: calculateGrowthRate(currentTotals.JAVA, previousTotals.JAVA),
        POSTMAN: calculateGrowthRate(currentTotals.POSTMAN, previousTotals.POSTMAN),
        BRUNO: calculateGrowthRate(currentTotals.BRUNO, previousTotals.BRUNO)
      }
    };
  }, [executionData]);

  return {
    executionData,
    statsData: calculateStats(),
    lastUpdate
  };
};