<template>
  <div id="home" class="max-w-3xl mx-auto bg-white">
    <Header />
    <TopNav :nav-items="navItems" />
    <main class="bg-white">
      <Carousel />
      <QuickNav />
      <RecommendedApps :apps="recommandApps" />
      <HotDownloads :top-apps="hotTopApps" />
      <RecentUpdates :apps="recentApps" />
      <Rankings :tabs="rankingTabs" />
      <NewsList />
    </main>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import type { AppItem, NavItem, RankTab } from '@/types'
import { fetchJson } from '@/utils/api'
import { applySEO, generateWebsiteJsonLd, generateOrganizationJsonLd, generateItemListJsonLd } from '@/utils/seo'
import Header from '@/components/Header.vue'
import TopNav from '@/components/TopNav.vue'
import Carousel from '@/components/Carousel.vue'
import QuickNav from '@/components/QuickNav.vue'
import RecommendedApps from '@/components/RecommendedApps.vue'
import HotDownloads from '@/components/HotDownloads.vue'
import RecentUpdates from '@/components/RecentUpdates.vue'
import Rankings from '@/components/Rankings.vue'
import NewsList from '@/components/NewsList.vue'
import Footer from '@/components/Footer.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Header,
    TopNav,
    Carousel,
    QuickNav,
    RecommendedApps,
    HotDownloads,
    RecentUpdates,
    Rankings,
    NewsList,
    Footer
  },
  setup() {
    const navItems = ref<NavItem[]>([])
    const recommandApps = ref<AppItem[]>([])
    const hotTopApps = ref<AppItem[]>([])
    const hotListApps = ref<AppItem[]>([])
    const recentApps = ref<AppItem[]>([])
    const rankingTabs = ref<RankTab[]>([])

    const assignData = (data: any) => {
      navItems.value = Array.isArray(data.navItems) ? data.navItems : []

      const recommended = Array.isArray(data.recommandApps)
        ? data.recommandApps
        : Array.isArray(data.recommendedApps)
          ? data.recommendedApps
          : []
      recommandApps.value = recommended

      const topApps = Array.isArray(data.topApps) ? data.topApps : []
      const nestedHot = data.hotApps || {}

      hotTopApps.value =
        Array.isArray(nestedHot.topApps) && nestedHot.topApps.length
          ? nestedHot.topApps
          : topApps
      hotListApps.value =
        Array.isArray(nestedHot.listApps) && nestedHot.listApps.length
          ? nestedHot.listApps
          : listApps

      recentApps.value = Array.isArray(data.recentApps) ? data.recentApps : []
      rankingTabs.value = Array.isArray(data.rankings) ? data.rankings : []
    }

    const loadAppsData = async () => {
      const apiData = await fetchJson('/api/apps', { cache: 'no-cache' })
      if (apiData) {
        assignData(apiData)
        return
      }
      const fallbackData = await fetchJson('/data/apps.json', { cache: 'no-cache' })
      if (fallbackData) {
        assignData(fallbackData)
      }
    }

    // 应用SEO配置
    const applySEOConfig = () => {
      const baseUrl = window.location.origin
      
      // 生成结构化数据
      const websiteJsonLd = generateWebsiteJsonLd(baseUrl)
      const organizationJsonLd = generateOrganizationJsonLd(baseUrl)
      
      // 应用基础SEO
      applySEO({
        title: '手赚网-手机赚钱APP推广下载平台',
        description: '手赚网-任务兼职平台是一个专业的手机赚钱软件分享平台，专注于app下载赚钱,提供手机赚钱软件排行及大全,致力打造一个分享最新手赚应用和资讯的手赚平台，以及网上赚钱项目分享，网络兼职赚钱教程方法。',
        keywords: '手赚网,APP推广,app下载赚钱,网络兼职,赚佣金平台,手机赚钱软件,赚钱APP,兼职平台,任务平台',
        canonical: baseUrl + '/',
        ogImage: 'https://szw.lmzy98.cn/m/skin/szw/images/logo.png',
        ogUrl: baseUrl + '/',
        jsonLd: websiteJsonLd,
        baiduPush: true // 启用百度自动推送
      })
      
      // 注入组织信息
      const orgScript = document.createElement('script')
      orgScript.type = 'application/ld+json'
      orgScript.id = 'seo-organization-jsonld'
      orgScript.textContent = JSON.stringify(organizationJsonLd)
      document.head.appendChild(orgScript)
    }

    // 监听应用数据变化，生成应用列表的结构化数据
    watch([recommandApps, hotTopApps], () => {
      const baseUrl = window.location.origin
      
      // 生成推荐应用的结构化数据
      if (recommandApps.value.length > 0) {
        const recommendedJsonLd = generateItemListJsonLd(
          recommandApps.value.map(app => ({
            name: app.name,
            url: app.url,
            image: app.image
          })),
          '站长推荐应用'
        )
        
        let existing = document.getElementById('seo-recommended-jsonld')
        if (existing) existing.remove()
        
        const script = document.createElement('script')
        script.id = 'seo-recommended-jsonld'
        script.type = 'application/ld+json'
        script.textContent = JSON.stringify(recommendedJsonLd)
        document.head.appendChild(script)
      }
      
      // 生成热门应用的结构化数据
      if (hotTopApps.value.length > 0) {
        const hotJsonLd = generateItemListJsonLd(
          hotTopApps.value.slice(0, 10).map(app => ({
            name: app.name,
            url: app.url,
            image: app.image
          })),
          '热门下载应用'
        )
        
        let existing = document.getElementById('seo-hot-jsonld')
        if (existing) existing.remove()
        
        const script = document.createElement('script')
        script.id = 'seo-hot-jsonld'
        script.type = 'application/ld+json'
        script.textContent = JSON.stringify(hotJsonLd)
        document.head.appendChild(script)
      }
    }, { deep: true })

    onMounted(() => {
      applySEOConfig()
      loadAppsData()
    })

    return {
      navItems,
      recommandApps,
      hotTopApps,
      hotListApps,
      recentApps,
      rankingTabs
    }
  }
})
</script>

