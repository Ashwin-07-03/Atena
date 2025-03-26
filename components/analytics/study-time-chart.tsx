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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export interface StudyTimeData {
  day: string;
  hours: number;
  focus?: number;
}

interface StudyTimeChartProps {
  data: StudyTimeData[];
  showPreviousWeek?: boolean;
  previousWeekData?: StudyTimeData[];
}

export function StudyTimeChart({ 
  data, 
  showPreviousWeek = false,
  previousWeekData = []
}: StudyTimeChartProps) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 15,
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
        displayColors: true,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e2e8f0',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          padding: 8,
          callback: (value: any) => `${value}h`
        },
      },
    },
    barPercentage: 0.7,
    categoryPercentage: 0.8,
  };

  const chartData = {
    labels: data.map(item => item.day),
    datasets: [
      {
        label: 'This Week',
        data: data.map(item => item.hours),
        backgroundColor: '#3b82f6', // Blue
        borderRadius: 4,
      },
      ...(showPreviousWeek && previousWeekData.length > 0 ? [
        {
          label: 'Previous Week',
          data: previousWeekData.map(item => item.hours),
          backgroundColor: '#94a3b8', // Slate
          borderRadius: 4,
        }
      ] : [])
    ],
  };

  return (
    <div className="h-80 w-full">
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
} 