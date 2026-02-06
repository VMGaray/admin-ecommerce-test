"use client";

import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  LabelList 
} from "recharts";
import { AnalyticsData } from "@/types"; 

interface OverviewProps {
  data: AnalyticsData[];
}

const COLORS = ['#627D9D', '#9D629A', '#9D8262', '#629D65'];

export function Overview({ data }: OverviewProps) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-87.5 flex items-center justify-center text-slate-500 text-sm italic border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
        Sin datos de ventas para mostrar
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
        <XAxis 
          dataKey="name" 
          stroke="#888888" 
          fontSize={12} 
          tickLine={false} 
          axisLine={false} 
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          cursor={{ fill: '#f1f5f9' }}
          contentStyle={{ 
            borderRadius: '12px', 
            border: 'none', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
          }}
        />
        
        <Bar 
          dataKey="value" 
          radius={[8, 8, 0, 0]} 
          minPointSize={15} 
        >
          {data.map((_, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
            />
          ))}
          <LabelList 
            dataKey="value" 
            position="top" 
            formatter={(val: any) => val > 0 ? `$${(Number(val) / 1000).toFixed(1)}k` : ""}
            style={{ fontSize: '10px', fill: '#64748b' }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}