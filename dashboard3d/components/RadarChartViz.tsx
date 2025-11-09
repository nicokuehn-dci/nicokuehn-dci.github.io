import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, PolarRadiusAxis } from 'recharts';

interface RadarChartVizProps {
  data: { subject: string; A: number; B?: number; fullMark: number }[];
}

export const RadarChartViz: React.FC<RadarChartVizProps> = ({ data }) => {
  // Ensure we have a valid fullMark, defaulting to 1 to avoid errors with empty data.
  const fullMark = data && data.length > 0 ? data[0].fullMark : 1;

  return (
    <ResponsiveContainer width="100%" height="100%" debounce={1}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <defs>
          <radialGradient id="radar-fill-gradient" cx="50%" cy="50%" r="60%" fx="50%" fy="40%">
            <stop offset="0%" stopColor="rgba(180, 255, 255, 0.7)" /> {/* Lighter, more translucent Neon Cyan */}
            <stop offset="100%" stopColor="rgba(180, 255, 255, 0.2)" /> {/* More transparent lighter neon cyan */}
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="15" result="coloredBlur"/> {/* Increased stdDeviation for stronger, smoky bloom */}
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <PolarGrid stroke="rgba(255, 255, 255, 0.1)" /> {/* More subtle white grid */}
        <PolarAngleAxis dataKey="subject" stroke="rgba(255, 255, 255, 0.7)" fontSize={12} tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}/> {/* Slightly more transparent white axis text */}
        {/* This is the fix: It sets the radial axis scale to the true maximum value. */}
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, fullMark]} 
          axisLine={false} 
          tick={false} 
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            border: '1px solid #4b5563',
            color: '#d1d5db',
            borderRadius: '0.5rem'
          }}
          cursor={{ stroke: 'rgba(255, 255, 255, 0.3)', strokeWidth: 1, strokeDasharray: '3 3' }} {/* Subtle white cursor */}
          formatter={(value: number) => [value.toLocaleString(), 'Value']}
        />
        <Radar name="Value" dataKey="A" stroke="rgba(180, 255, 255, 0.8)" strokeWidth={3} fill="url(#radar-fill-gradient)" fillOpacity={0.8} filter="url(#glow)" /> {/* Lighter, more translucent Neon Cyan Radar */}
      </RadarChart>
    </ResponsiveContainer>
  );
};