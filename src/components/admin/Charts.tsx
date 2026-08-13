import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';

const axis = { stroke: '#52525b', fontSize: 11 };
const grid = '#27272a';

const tooltipStyle = {
  contentStyle: {
    background: '#18181b',
    border: '1px solid #3f3f46',
    borderRadius: 8,
    fontSize: 12,
    color: '#fafafa'
  },
  labelStyle: { color: '#a1a1aa' }
};

export function GrowthAreaChart({
  data,
  dataKey,
  color = '#C42B53',
  height = 240





}: {data: Record<string, string | number>[];dataKey: string;color?: string;height?: number;}) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid stroke={grid} vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} {...axis} />
          <YAxis tickLine={false} axisLine={false} {...axis} width={52} />
          <Tooltip {...tooltipStyle} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={color}
            fillOpacity={0.12} />
          
        </AreaChart>
      </ResponsiveContainer>
    </div>);

}

export function DualLineChart({
  data,
  height = 240



}: {data: Record<string, string | number>[];height?: number;}) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid stroke={grid} vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} {...axis} />
          <YAxis tickLine={false} axisLine={false} {...axis} width={52} />
          <Tooltip {...tooltipStyle} />
          <Line type="monotone" dataKey="users" stroke="#C9A24A" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="subscribers" stroke="#C42B53" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>);

}

export function SimpleBarChart({
  data,
  dataKey,
  xKey,
  color = '#C9A24A',
  height = 240






}: {data: Record<string, string | number>[];dataKey: string;xKey: string;color?: string;height?: number;}) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
          <CartesianGrid stroke={grid} vertical={false} />
          <XAxis dataKey={xKey} tickLine={false} axisLine={false} {...axis} />
          <YAxis tickLine={false} axisLine={false} {...axis} width={52} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} maxBarSize={38} />
        </BarChart>
      </ResponsiveContainer>
    </div>);

}

const PIE_COLORS = ['#C42B53', '#C9A24A', '#7E6428', '#6E1128', '#52525b'];

export function CategoryPieChart({
  data,
  height = 240



}: {data: {name: string;value: number;}[];height?: number;}) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2}>
            {data.map((_, i) =>
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="#131415" />
            )}
          </Pie>
          <Tooltip {...tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    </div>);

}

export function RetentionLineChart({
  data,
  height = 240



}: {data: {week: string;retained: number;}[];height?: number;}) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
          <CartesianGrid stroke={grid} vertical={false} />
          <XAxis dataKey="week" tickLine={false} axisLine={false} {...axis} />
          <YAxis tickLine={false} axisLine={false} {...axis} width={40} unit="%" />
          <Tooltip {...tooltipStyle} />
          <Area
            type="monotone"
            dataKey="retained"
            stroke="#C9A24A"
            strokeWidth={2}
            fill="#C9A24A"
            fillOpacity={0.1} />
          
        </AreaChart>
      </ResponsiveContainer>
    </div>);

}