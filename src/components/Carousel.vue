<template>
  <div class="relative w-full h-36 mx-auto overflow-hidden">
    <div class="relative h-full">
      <!-- Slides -->
      <div v-for="(slide, index) in slides" :key="index" class="absolute w-full h-full transition-opacity duration-500 ease-in-out" :class="{ 'opacity-100': index === currentIndex, 'opacity-0': index !== currentIndex }">
        <a :href="slide.url" target="_blank">
          <img :src="slide.image" :alt="slide.alt" class="w-full h-full object-cover">
        </a>
      </div>
    </div>
    <!-- Dots -->
    <div class="absolute z-10 bottom-1.5 w-full text-center">
      <div class="inline-block h-2 px-1.5 py-0.5 bg-white bg-opacity-70 rounded-full text-xs align-top">
        <button v-for="(slide, index) in slides" :key="index" @click="currentIndex = index" class="inline-block w-1.5 h-1.5 rounded-full bg-gray-500 mx-1 align-top overflow-hidden" :class="{ 'bg-blue-500': index === currentIndex }"></button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface Slide { url: string; image: string; alt: string }

type IntervalId = number | ReturnType<typeof setInterval> | null

export default defineComponent({
  name: 'Carousel',
  data(): { currentIndex: number; slides: Slide[]; intervalId: IntervalId } {
    return {
      currentIndex: 0,
      slides: [
        { url: 'https://szw.lmzy98.cn/ios/148.html', image: './staticFiles/1-250Q4003S2N1.png', alt: '梦幻扑鱼' },
        { url: 'https://szw.lmzy98.cn/yuedu/150.html', image: './staticFiles/1-250Q40044280-L.jpg', alt: '公众号回调' },
        { url: 'https://szw.lmzy98.cn/shouji/147.html', image: './staticFiles/1-250Q32246400-L.png', alt: '果冻试玩' },
        { url: 'https://szw.lmzy98.cn/yuedu/142.html', image: './staticFiles/1-250Q61PS3R4.png', alt: '永不下架' },
      ],
      intervalId: null
    }
  },
  mounted() {
    this.startAutoPlay();
  },
  beforeUnmount() {
    this.stopAutoPlay();
  },
  methods: {
    startAutoPlay() {
      this.intervalId = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
      }, 3000) as unknown as number;
    },
    stopAutoPlay() {
      if (this.intervalId) clearInterval(this.intervalId as number);
      this.intervalId = null
    }
  }
})
</script>

