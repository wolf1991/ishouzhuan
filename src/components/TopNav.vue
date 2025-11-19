<template>
  <div class="bg-white shadow-sm overflow-x-auto">
    <ul class="flex px-3 whitespace-nowrap">
      <li v-for="item in navItems" :key="item.name" class="inline-block px-4 text-center">
        <a :href="item.url" :class="['inline-block text-gray-800 text-base leading-9 my-0.5', { 'text-blue-500 font-bold border-b-2 border-blue-500': item.active }]">
          {{ item.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { NavItem } from '@/types'

export default defineComponent({
  name: 'TopNav',
  props: {
    navItems: {
      type: Array as PropType<NavItem[]>,
      default: () => []
    }
  }
})
</script>

