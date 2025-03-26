"use client";

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export interface SubjectData {
  name: string;
  hours: number;
  progress: number;
  color: string;
}

interface SubjectPieChartProps {
  data: SubjectData[];
  centerText?: {
    primary: string;
    secondary: string;
  }
}

export function SubjectPieChart({ 
  data,
  centerText 
}: SubjectPieChartProps) {
  // Extract colors from the bg- classes to use in the chart
  const getColorFromClass = (className: string) => {
    const colorMap: Record<string, string> = {
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#22c55e',
      'bg-amber-500': '#f59e0b',
      'bg-purple-500': '#a855f7',
      'bg-rose-500': '#f43f5e',
      'bg-sky-500': '#0ea5e9',
      'bg-indigo-500': '#6366f1',
      'bg-pink-500': '#ec4899',
      'bg-emerald-500': '#10b981',
      'bg-orange-500': '#f97316',
    };
    
    return colorMap[className] || '#94a3b8'; // Default to slate color
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          color: '#64748b',
          font: {
            size: 11
          }
        },
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
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value * 100) / total);
            return `${label}: ${value} hours (${percentage}%)`;
          }
        }
      },
    },
    cutout: '60%',
  };

  const chartData = {
    labels: data.map(subject => subject.name),
    datasets: [
      {
        data: data.map(subject => subject.hours),
        backgroundColor: data.map(subject => getColorFromClass(subject.color)),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="h-64 w-64 mx-auto relative">
      <Pie options={chartOptions} data={chartData} />
      {centerText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <h3 className="text-2xl font-bold">{centerText.primary}</h3>
          <p className="text-sm text-muted-foreground">{centerText.secondary}</p>
        </div>
      )}
    </div>
  );
} 