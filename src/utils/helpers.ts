import type { OriginalLink } from '@/types'

const PLATFORM_MAP: Record<string, string> = {
  'weibo.com': '微博',
  'weibo.cn': '微博',
  'weixin.qq.com': '微信',
  'mp.weixin.qq.com': '微信',
  'toutiao.com': '头条',
  'www.toutiao.com': '头条',
  'douyin.com': '抖音',
  'www.douyin.com': '抖音',
  'xiaohongshu.com': '小红书',
  'www.xiaohongshu.com': '小红书',
  'zhihu.com': '知乎',
  'www.zhihu.com': '知乎',
  'kuaishou.com': '快手',
  'www.kuaishou.com': '快手',
  'bilibili.com': 'B站',
  'www.bilibili.com': 'B站',
}

export function parseLink(url: string): OriginalLink | null {
  try {
    const u = new URL(url)
    const domain = u.hostname.replace(/^www\./, '')
    const platform = PLATFORM_MAP[u.hostname] || PLATFORM_MAP[domain] || domain
    return { url, domain, platform }
  } catch {
    return null
  }
}

export function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

export function formatNum(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return `${Math.floor(diff / 60000)}分钟前`
  if (hours < 24) return `${hours}小时前`
  return `${Math.floor(hours / 24)}天前`
}

export function cn(...inputs: (string | undefined | false | null)[]): string {
  return inputs.filter(Boolean).join(' ')
}
