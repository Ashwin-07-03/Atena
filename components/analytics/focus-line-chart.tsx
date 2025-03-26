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
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { StudyTimeData } from './study-time-chart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface FocusLineChartProps {
  data: StudyTimeData[];
  showPreviousWeek?: boolean;
  previousWeekData?: StudyTimeData[];
}

export function FocusLineChart({ 
  data, 
  showPreviousWeek = false,
  previousWeekData = []
}: FocusLineChartProps) {
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
        callbacks: {
          label: function(context: any) {
            return `Focus: ${context.parsed.y}%`;
          }
        }
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
        min: 0,
        max: 100,
        grid: {
          color: '#e2e8f0',
          drawBorder: false,
        },
        ticks: {
          color: '#64748b',
          padding: 8,
          stepSize: 20,
          callback: (value: any) => `${value}%`
        },
      },
    },
    elements: {
      line: {
        tension: 0.3, // Smoother curve
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };

  const chartData = {
    labels: data.map(item => item.day),
    datasets: [
      {
        label: 'This Week',
        data: data.map(item => item.focus || 0),
        borderColor: '#3b82f6', // Blue
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        pointBackgroundColor: '#3b82f6',
      },
      ...(showPreviousWeek && previousWeekData.length > 0 ? [
        {
          label: 'Previous Week',
          data: previousWeekData.map(item => item.focus || 0),
          borderColor: '#94a3b8', // Slate
          backgroundColor: 'rgba(148, 163, 184, 0.05)',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          pointBackgroundColor: '#94a3b8',
        }
      ] : [])
    ],
  };

  return (
    <div className="h-80 w-full">
      <Line options={chartOptions} data={chartData} />
    </div>
  );
} 