<template>
  <div class="bg-white">
    <ul class="flex p-4">
      <li v-for="item in navItems" :key="item.name" class="flex-1 text-center">
        <a :href="item.url" class="block">
          <span class="inline-block w-12 h-12 mb-2.5 bg-no-repeat" :style="{ backgroundImage: 'url(./staticFiles/img-nav.png)', backgroundSize: 'auto 47px', backgroundPosition: item.bgPos }"></span>
          <p class="text-sm text-gray-600">{{ item.name }}</p>
        </a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface NavItem { name: string; url: string; bgPos: string }

export default defineComponent({
  name: 'QuickNav',
  data(): { navItems: NavItem[] } {
    return {
      navItems: [
        { name: '最新', url: 'https://szw.lmzy98.cn/m/list.php?tid=6', bgPos: '-197px 0' },
        { name: '苹果赚钱', url: 'https://szw.lmzy98.cn/m/list.php?tid=1', bgPos: '0 0' },
        { name: '安卓赚钱', url: 'https://szw.lmzy98.cn/m/list.php?tid=3', bgPos: '-98px 0' },
        { name: '专题推荐', url: 'https://szw.lmzy98.cn/m/list.php?tid=7', bgPos: '-50px 0' },
      ]
    }
  }
})
</script>

