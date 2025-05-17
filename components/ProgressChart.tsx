
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatShortDate } from '../utils/healthUtils';

interface ProgressChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
  color?: string;
  yAxisLabel?: string;
  unit?: string;
  domain?: [number, number];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ 
  data, 
  color = '#26A69A', 
  yAxisLabel,
  unit = '',
  domain
}) => {
  // Prepare the data for the chart
  const chartData = data.map(item => ({
    date: formatShortDate(item.date),
    value: item.value,
    fullDate: item.date
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
      >
        <CartesianGrid vertical={false} stroke="#eeeeee" />
        <XAxis 
          dataKey="date" 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          domain={domain}
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 12 } } : undefined}
        />
        <Tooltip 
          formatter={(value: number) => [`${value}${unit}`, '']}
          labelFormatter={(label) => {
            const item = chartData.find(d => d.date === label);
            return item ? formatShortDate(item.fullDate) : label;
          }}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={3} 
          dot={{ fill: color, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: color }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ProgressChart;
