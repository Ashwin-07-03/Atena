"use client";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export interface TaskCategory {
  name: string;
  tasks: {
    name: string;
    hours: number;
    completed: boolean;
  }[];
  color: string;
}

interface TaskBreakdownChartProps {
  data: TaskCategory[];
}

export function TaskBreakdownChart({ data }: TaskBreakdownChartProps) {
  // Extract colors from the bg- classes for the chart
  const getColorFromClass = (className: string) => {
    const colorMap: Record<string, string> = {
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#22c55e',
      'bg-amber-500': '#f59e0b',
      'bg-purple-500': '#a855f7',
      'bg-rose-500': '#f43f5e',
      'bg-sky-500': '#0ea5e9',
      'bg-indigo-500': '#6366f1',
    };
    
    return colorMap[className] || '#94a3b8';
  };

  // Calculate hours per category
  const categories = data.map(category => category.name);
  const hoursPerCategory = data.map(category => 
    category.tasks.reduce((sum, task) => sum + task.hours, 0)
  );
  const completedHoursPerCategory = data.map(category =>
    category.tasks
      .filter(task => task.completed)
      .reduce((sum, task) => sum + task.hours, 0)
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          padding: 10,
          color: '#64748b',
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        padding: 12,
        borderColor: '#1e293b',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.x} hours`;
          }
        }
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          color: '#e2e8f0',
        },
        ticks: {
          color: '#64748b',
          callback: (value: any) => `${value}h`
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
        },
      },
    },
  };

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Completed',
        data: completedHoursPerCategory,
        backgroundColor: data.map(category => getColorFromClass(category.color)),
        borderRadius: 4,
      },
      {
        label: 'Remaining',
        data: hoursPerCategory.map((total, index) => total - completedHoursPerCategory[index]),
        backgroundColor: data.map(category => getColorFromClass(category.color).replace(')', ', 0.3)')),
        borderRadius: 4,
      },
    ],
  };

  // Calculate most and least time spent categories
  const mostTimeIndex = hoursPerCategory.indexOf(Math.max(...hoursPerCategory));
  const leastTimeIndex = hoursPerCategory.indexOf(Math.min(...hoursPerCategory));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Breakdown</CardTitle>
        <CardDescription>Hours spent by subject category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full mb-4">
          <Bar options={chartOptions} data={chartData} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Most time spent</p>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-8 ${data[mostTimeIndex].color} rounded-sm`}></div>
              <div>
                <p className="font-medium">{data[mostTimeIndex].name}</p>
                <p className="text-sm text-muted-foreground">
                  {hoursPerCategory[mostTimeIndex]} hours total
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Least time spent</p>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-8 ${data[leastTimeIndex].color} rounded-sm`}></div>
              <div>
                <p className="font-medium">{data[leastTimeIndex].name}</p>
                <p className="text-sm text-muted-foreground">
                  {hoursPerCategory[leastTimeIndex]} hours total
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 