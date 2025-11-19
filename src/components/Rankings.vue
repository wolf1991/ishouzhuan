<template>
  <div class="border-t-8 border-gray-100 px-3">
    <div class="flex">
      <p v-for="(tab, index) in tabs" :key="tab.name" @click="activeTab = index" :class="['flex-1 text-center leading-10 border-b-2 text-base font-bold cursor-pointer', activeTab === index ? 'text-gray-800 border-blue-500' : 'text-gray-500 border-gray-100']">
        {{ tab.name }}
        <i v-if="activeTab === index" class="block w-0 h-0 border-r-4 border-b-4 border-l-4 border-transparent border-b-blue-500 mx-auto"></i>
      </p>
    </div>
    <div class="block w-full">
      <ul v-for="(tab, index) in tabs" :key="index" v-show="activeTab === index" class="overflow-hidden">
        <li v-for="app in tab.apps" :key="app.name" class="relative border-b border-gray-100 py-4 flex items-center">
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
import type { RankTab } from '@/types'

export default defineComponent({
  name: 'Rankings',
  props: {
    tabs: {
      type: Array as PropType<RankTab[]>,
      default: () => []
    }
  },
  data() {
    return {
      activeTab: 0
    }
  },
  watch: {
    tabs(newTabs: RankTab[]) {
      if (newTabs.length === 0) {
        this.activeTab = 0
      } else if (this.activeTab >= newTabs.length) {
        this.activeTab = 0
      }
    }
  }
})
</script>

