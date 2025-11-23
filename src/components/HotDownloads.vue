<template>
  <div class="border-t-8 border-gray-100 px-3">
    <div class="h-8 leading-8 pt-3">
      <span class="float-left text-base text-gray-800 font-semibold">热门下载</span>
    </div>
    <div class="relative">
      <img class="w-full" src="@/assets/bg-hotgm.png">
      <ul class="absolute top-0 left-0 w-full flex justify-around">
        <li v-for="app in topThreeApps" :key="app.name" class="text-center">
          <div class="mt-4">
            <a :href="app.url" class="block">
              <img :src="app.image" :alt="app.name + ' - 手机赚钱应用'" class="w-16 h-16 rounded-lg mx-auto">
            </a>
          </div>
          <a :href="app.url" class="block">
            <p class="text-sm text-gray-800 mt-1">{{ app.name }}</p>
          </a>
        </li>
      </ul>
    </div>
    <div>
      <ul class="block overflow-hidden">
        <li v-for="app in listApps" :key="app.name" class="relative border-b border-gray-100 py-4 flex items-center">
          <a :href="app.url" class="block">
            <img :src="app.image" :alt="app.name" class="w-14 h-14 rounded-lg">
          </a>
          <a :href="app.url" class="absolute top-1/2 right-0 -mt-3.5 text-center text-white leading-7 w-14 bg-blue-500 rounded-sm h-7">下载</a>
          <div class="block h-14 mx-16">
            <div class="w-full ml-2.5">
              <a :href="app.url" class="block max-h-12 text-gray-800 text-base overflow-hidden">{{ app.name }}</a>
              <div class="w-16 relative my-1.5 h-2.5 bg-no-repeat bg-[url('./staticFiles/icon_star.png')]" style="background-size: 66px auto;">
                <span class="block absolute left-0 top-0 max-w-full h-2.5 bg-no-repeat bg-[url('./staticFiles/icon_star.png')]" style="background-size: 66px auto; background-position: 0px -11px; width: 100%;"></span>
              </div>
              <p class="text-gray-500 overflow-hidden text-xs">人在玩丨{{ app.date }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { AppItem } from '@/types'

export default defineComponent({
  name: 'HotDownloads',
  props: {
    topApps: {
      type: Array as PropType<AppItem[]>,
      default: () => []
    }
  },

  computed: {
    topThreeApps(): Array<AppItem> {
      return this.topApps.slice(0, 3)
    },
    listApps(): Array<AppItem> {
      return this.topApps.slice(3)
    }
  }
})
</script>

