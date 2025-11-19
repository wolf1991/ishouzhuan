<template>
  <div class="border-t-8 border-gray-100 px-3">
    <div class="h-8 leading-8 pt-3 flex justify-between items-center">
      <span class="text-base text-gray-800 font-semibold">最近更新</span>
      <a href="https://szw.lmzy98.cn/m/list.php?tid=6" class="text-sm text-gray-500">更多 +</a>
    </div>
    <div class="pt-1.5">
      <ul class="flex flex-wrap -mx-1.5">
        <li v-for="app in apps" :key="app.name" class="w-1/4 p-1.5 text-center">
          <a :href="app.url">
            <div class="w-full mb-2.5">
              <img :src="app.image" :alt="app.name" class="w-14 h-14 rounded-lg mx-auto">
            </div>
            <p class="text-gray-800 h-5 leading-5 overflow-hidden text-sm">{{ app.name }}</p>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { AppItem } from '@/types'

export default defineComponent({
  name: 'RecentUpdates',
  props: {
    apps: {
      type: Array as PropType<AppItem[]>,
      default: () => []
    }
  }
})
</script>

