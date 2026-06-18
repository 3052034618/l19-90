import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileSearch, GitBranch, FileText, Shield } from 'lucide-react'

const navItems = [
  { path: '/clue-entry', icon: FileSearch, label: '线索录入' },
  { path: '/propagation', icon: GitBranch, label: '传播分析' },
  { path: '/briefing', icon: FileText, label: '处置简报' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[72px] flex-col items-center border-r border-[#1E2D3D] bg-[#0A1219] py-6">
      <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-[#00E5C7]/10">
        <Shield size={22} className="text-[#00E5C7]" />
      </div>

      <nav className="flex flex-1 flex-col items-center gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="group relative flex flex-col items-center gap-1"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute -left-3 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-[#00E5C7]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[#00E5C7]/15 text-[#00E5C7]'
                    : 'text-[#4A5A6A] hover:bg-[#1A2A3A] hover:text-[#8B9DAF]'
                }`}
              >
                <item.icon size={20} />
              </div>
              <span
                className={`text-[10px] ${
                  isActive ? 'text-[#00E5C7]' : 'text-[#4A5A6A] group-hover:text-[#8B9DAF]'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          )
        })}
      </nav>

      <div className="flex flex-col items-center gap-1">
        <div className="h-8 w-8 rounded-full bg-[#1A2A3A] flex items-center justify-center text-xs font-medium text-[#8B9DAF]">
          值
        </div>
        <span className="text-[10px] text-[#4A5A6A]">值班员</span>
      </div>
    </aside>
  )
}
