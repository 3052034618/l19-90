import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { sentimentTimeline } from '@/data/mockData'

function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

const data = sentimentTimeline.map((item) => ({
  time: formatTime(item.time),
  positive: Math.round(item.positive * 100),
  neutral: Math.round(item.neutral * 100),
  negative: Math.round(item.negative * 100),
}))

export default function SentimentChart() {
  return (
    <div className="rounded-xl border border-[#1E2D3D] bg-[#111B27] p-4">
      <h3 className="mb-3 text-sm font-medium text-[#8B9DAF]">评论情绪趋势</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="positiveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2ECC71" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2ECC71" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="neutralGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B9DAF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8B9DAF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="negativeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF4757" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF4757" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#4A5A6A' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#4A5A6A' }} axisLine={false} tickLine={false} width={30} unit="%" />
            <Tooltip
              contentStyle={{ background: '#1A2A3A', border: '1px solid #2A3A4A', borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: '#8B9DAF' }}
              formatter={(value: number) => `${value}%`}
            />
            <Area type="monotone" dataKey="positive" stroke="#2ECC71" fill="url(#positiveGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="neutral" stroke="#8B9DAF" fill="url(#neutralGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="negative" stroke="#FF4757" fill="url(#negativeGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex justify-center gap-4 text-xs">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#2ECC71]" />正面</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#8B9DAF]" />中性</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#FF4757]" />负面</span>
      </div>
    </div>
  )
}
