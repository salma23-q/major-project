
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { ShapValue } from '../types';

interface ShapVisualizerProps {
  data: ShapValue[];
}

const ShapVisualizer: React.FC<ShapVisualizerProps> = ({ data }) => {
  // Map data to Recharts format
  const chartData = data.map(item => ({
    name: item.label,
    value: parseFloat(item.value.toFixed(3)),
    fill: item.value > 0 ? '#ef4444' : '#22c55e'
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      return (
        <div className="bg-white p-2 border border-slate-200 shadow-lg rounded-md text-xs">
          <p className="font-semibold">{label}</p>
          <p className={val > 0 ? 'text-red-500' : 'text-green-500'}>
            Impact: {val > 0 ? '+' : ''}{val}
          </p>
          <p className="text-slate-500 italic">
            {val > 0 ? 'Increases fake probability' : 'Decreases fake probability'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 bg-white rounded-xl p-4 border border-slate-100">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
        SHAP Feature Importance (Model Logic)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={120} 
            tick={{ fontSize: 10, fill: '#64748b' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
          <ReferenceLine x={0} stroke="#cbd5e1" />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ShapVisualizer;
