import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BarChartVizProps {
  data: { name: string; value: number }[];
}

export const BarChartViz: React.FC<BarChartVizProps> = ({ data }) => {
  // Dynamic barSize to make bars fit better regardless of data length
  // Adjust calculation for potentially wider bars in 3D perspective
  const barSize = Math.max(20, Math.min(50, 200 / (data.length || 1)));

  // Fix: The onClick handler receives a BarRectangleItem, which has a `payload` property containing the original data.
  const handleBarClick = (barData: any) => {
    const { name, value } = barData.payload;
    alert(`Repository: ${name}\nSize: ${value.toLocaleString()} KB`);
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="bar-fill-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255, 180, 255, 0.7)" /> {/* Lighter, more translucent Neon Magenta */}
            <stop offset="100%" stopColor="rgba(255, 180, 255, 0.2)" /> {/* More transparent lighter neon magenta */}
          </linearGradient>
          <filter id="glow-bar" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="15" result="coloredBlur"/> {/* Increased stdDeviation for stronger, smoky bloom */}
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" /> {/* More subtle white grid */}
        <XAxis type="number" stroke="rgba(255, 255, 255, 0.7)" fontSize={12} tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}/> {/* Slightly more transparent white Axis */}
        <YAxis 
            type="category" 
            dataKey="name" 
            stroke="rgba(255, 255, 255, 0.7)" 
            fontSize={12} 
            width={80} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: 'rgba(255, 255, 255, 0.7)' }} {/* Slightly more transparent white Ticks */}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            border: '1px solid #4b5563',
            color: '#d1d5db',
            borderRadius: '0.5rem'
          }}
          cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} {/* Subtle white cursor */}
          formatter={(value: number) => [value.toLocaleString(), null]}
          labelStyle={{ color: '#FFFFFF' }}
        />
        <Bar dataKey="value" fill="url(#bar-fill-gradient)" filter="url(#glow-bar)" radius={[0, 4, 4, 0]} barSize={barSize} fillOpacity={0.8} onClick={handleBarClick} /> {/* Neon Magenta Bar with translucency */}
      </BarChart>
    </ResponsiveContainer>
  );
};