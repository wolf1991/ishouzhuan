<template>
  <div class="border-t-8 border-gray-100">
    <div class="h-8 leading-8 px-3 pt-3">
      <span class="float-left text-base text-gray-800 font-semibold">站长推荐</span>
    </div>
    <ul class="overflow-hidden mx-3 mt-3">
      <li v-for="app in apps" :key="app.name" class="float-left w-1/4 mb-4">
        <a :href="app.url" class="block mx-auto">
          <img :src="app.image" :alt="app.name" class="w-16 h-16 rounded-xl block mx-auto">
          <p class="text-sm text-gray-900 text-center leading-5 h-5 overflow-hidden mt-1.5">{{ app.name }}</p>
        </a>
        <a :href="app.url" class="block mx-auto mt-1.5 w-14 h-6 leading-6 border border-blue-200 text-blue-500 text-xs text-center rounded-sm">下载</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { AppItem } from '@/types'

export default defineComponent({
  name: 'RecommendedApps',
  props: {
    apps: {
      type: Array as PropType<AppItem[]>,
      default: () => []
    }
  }
})
</script>

