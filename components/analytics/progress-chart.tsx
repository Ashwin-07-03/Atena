"use client";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export interface ProgressData {
  date: string;
  studyHours: number;
  grade?: number;
  performance?: number;
}

interface ProgressChartProps {
  data: ProgressData[];
  metrics: ('studyHours' | 'grade' | 'performance')[];
  timeframe: 'week' | 'month' | 'semester';
}

export function ProgressChart({ 
  data,
  metrics,
  timeframe
}: ProgressChartProps) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          padding: 15,
          color: '#64748b',
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        padding: 12,
        borderColor: '#1e293b',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: metrics.includes('studyHours'),
          text: 'Study Hours',
          color: '#64748b',
        },
        grid: {
          color: '#e2e8f0',
        },
        ticks: {
          color: '#64748b',
        },
      },
      y1: {
        type: 'linear' as const,
        display: metrics.includes('grade'),
        position: 'right' as const,
        title: {
          display: metrics.includes('grade'),
          text: 'Grade (%)',
          color: '#64748b',
        },
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#64748b',
        },
      },
      y2: {
        type: 'linear' as const,
        display: metrics.includes('performance'),
        position: 'right' as const,
        title: {
          display: metrics.includes('performance'),
          text: 'Performance',
          color: '#64748b',
        },
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#64748b',
        },
      },
    },
  };

  const datasets = [];

  if (metrics.includes('studyHours')) {
    datasets.push({
      label: 'Study Hours',
      data: data.map(item => item.studyHours),
      borderColor: '#3b82f6',
      backgroundColor: '#3b82f6',
      yAxisID: 'y',
      tension: 0.3,
    });
  }

  if (metrics.includes('grade')) {
    datasets.push({
      label: 'Grade',
      data: data.map(item => item.grade),
      borderColor: '#f59e0b',
      backgroundColor: '#f59e0b',
      yAxisID: 'y1',
      tension: 0.3,
    });
  }

  if (metrics.includes('performance')) {
    datasets.push({
      label: 'Performance',
      data: data.map(item => item.performance),
      borderColor: '#10b981',
      backgroundColor: '#10b981',
      yAxisID: 'y2',
      borderDash: [5, 5],
      tension: 0.3,
    });
  }

  const chartData = {
    labels: data.map(item => item.date),
    datasets,
  };

  return (
    <div className="h-80 w-full">
      <Line options={chartOptions} data={chartData} />
    </div>
  );
} 