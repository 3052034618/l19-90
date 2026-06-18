import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { platformDistribution } from '@/data/mockData'

export default function SourceChart() {
  return (
    <div className="rounded-xl border border-[#1E2D3D] bg-[#111B27] p-4">
      <h3 className="mb-3 text-sm font-medium text-[#8B9DAF]">传播来源分布</h3>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={platformDistribution}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {platformDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#1A2A3A', border: '1px solid #2A3A4A', borderRadius: 8, fontSize: 12 }}
              formatter={(value: number) => `${value}%`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs">
        {platformDistribution.map((item) => (
          <span key={item.name} className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            {item.name} {item.value}%
          </span>
        ))}
      </div>
    </div>
  )
}
