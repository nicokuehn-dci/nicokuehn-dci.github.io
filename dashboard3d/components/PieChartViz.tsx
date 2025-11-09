import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PieChartVizProps {
  data: { name: string; value: number }[];
}

const COLORS = [
    'rgba(180, 255, 255, 0.7)',
    'rgba(255, 180, 255, 0.65)',
    'rgba(255, 255, 180, 0.6)',
    'rgba(180, 255, 180, 0.55)',
    'rgba(150, 200, 255, 0.5)',
    'rgba(255, 200, 150, 0.45)'
];

export const PieChartViz: React.FC<PieChartVizProps> = ({ data }) => {

    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        const sliceData = payload[0].payload;
        // Fix: Calculate total from the 'data' prop passed to the main component
        const total = data.reduce((sum, entry) => sum + entry.value, 0);
        const percent = total > 0 ? ((sliceData.value / total) * 100).toFixed(1) : 0;

        return (
          <div 
            className="p-2 rounded-lg"
            style={{
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                border: '1px solid #4b5563',
                color: '#d1d5db'
            }}
          >
            <p className="font-semibold" style={{ color: payload[0].fill }}>{`${sliceData.name}`}</p>
            <p style={{ color: payload[0].fill }}>{`${percent}%`}</p>
            <p className="text-xs text-gray-400">{`${sliceData.value.toLocaleString()}`}</p>
          </div>
        );
      }
      return null;
    };

    const renderLegend = (props: any) => {
        const { payload } = props;
        const total = payload.reduce((sum: number, entry: any) => sum + entry.payload.value, 0);

        return (
            <ul className="text-xs text-center flex flex-wrap justify-center items-center gap-x-4">
                {payload.map((entry: any, index: number) => {
                     const percent = total > 0 ? ((entry.payload.value / total) * 100).toFixed(1) : 0;
                     return (
                        <li key={`item-${index}`} className="flex items-center gap-1">
                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }}></span>
                            {/* Make legend text white for better readability */}
                            <span style={{ color: '#FFFFFF' }}>{entry.value} ({percent}%)</span>
                        </li>
                     );
                })}
            </ul>
        );
    };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <defs>
            <filter id="glow-pie" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
                <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <Pie
          data={data}
          cx="50%"
          cy="45%" // Move slightly up to make space for legend
          innerRadius="60%"
          outerRadius="85%"
          fill="#8884d8"
          paddingAngle={2}
          dataKey="value"
          stroke="none"
          filter="url(#glow-pie)"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip data={data}/>} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} /> {/* Subtle white cursor */}
        <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconSize={8}
            content={renderLegend}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};