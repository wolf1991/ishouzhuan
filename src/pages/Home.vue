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
import { defineComponent, onMounted, ref } from 'vue'
import type { AppItem, NavItem, RankTab } from '@/types'
import { fetchJson } from '@/utils/api'
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

    onMounted(() => {
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

