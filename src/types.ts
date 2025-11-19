// src/types.ts

/**
 * 代表一个应用的基本信息
 */
export interface AppItem {
  name: string
  url: string
  image: string
  date?: string // 可选，主要用于 listApps
}

/**
 * 导航项
 */
export interface NavItem {
  name: string
  url: string
  active: boolean
}

/**
 * 排行榜标签页
 */
export interface RankTab {
  name: string
  apps: AppItem[]
}

/**
 * 热门下载的结构，包含顶部和列表两部分
 */
export interface HotApps {
  topApps: AppItem[]
  listApps: AppItem[]
}

/**
 * apps.json 的完整数据结构（新版）
 */
export interface AppsData {
  recommandApps: AppItem[]
  hotApps: HotApps
  recentApps: AppItem[]
  iosApps: AppItem[]
  androidApps: AppItem[]
}

/**
 * 用于 API 响应的兼容类型，可能包含旧结构
 */
export interface LegacyAppsData {
  topApps?: AppItem[]
  listApps?: AppItem[]
  recommandApps?: AppItem[]
  hotApps?: Partial<HotApps>
  recentApps?: AppItem[]
  iosApps?: AppItem[]
  androidApps?: AppItem[]
  navItems?: NavItem[]
  recommendedApps?: AppItem[]
  rankings?: RankTab[]
}

