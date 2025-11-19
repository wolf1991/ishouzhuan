<template>
  <header class="bg-white p-5 flex justify-between items-center border-b border-gray-200">
    <h1
      class="cursor-pointer select-none"
      tabindex="0"
      @touchstart="onPressStart"
      @touchend="onPressEnd"
      @touchcancel="onPressCancel"
      @mousedown="onPressStart"
      @mouseup="onPressEnd"
      @mouseleave="onPressCancel"
      @keydown.enter="goAdmin"
      @keydown.space.prevent="goAdmin"
    >
      <img src="https://szw.lmzy98.cn/m/skin/szw/images/logo.png" alt="手赚网" class="h-10">
    </h1>
    <div class="flex-1 max-w-md ml-5">
      <form action="/m/e/search/index.php" method="post" name="searchform" id="searchform" class="flex border border-gray-300 rounded overflow-hidden">
        <input type="hidden" name="show" value="title">
        <input type="hidden" name="tempid" value="1">
        <input type="hidden" name="tbname" value="news">
        <input type="text" name="keyboard" placeholder="搜索..." class="flex-1 p-2 border-none outline-none text-sm">
        <input type="submit" value="" class="w-10 bg-orange-500 border-none cursor-pointer bg-no-repeat bg-center" style="background-size: 20px;">
      </form>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

type PressTimer = number | ReturnType<typeof setTimeout> | null

declare module 'vue' {
  interface ComponentCustomProperties {
    $router?: any
  }
}

export default defineComponent({
  name: 'Header',
  data(): { pressTimer: PressTimer; pressed: boolean } {
    return {
      pressTimer: null,
      pressed: false,
    }
  },
  methods: {
    onPressStart(e: MouseEvent | TouchEvent) {
      // 仅左键或触摸
      if (e.type === 'mousedown' && 'button' in e && (e as MouseEvent).button !== 0) return
      this.pressed = true
      if (this.pressTimer) {
        clearTimeout(this.pressTimer as number)
        this.pressTimer = null
      }
      this.pressTimer = setTimeout(() => {
        if (this.pressed) this.goAdmin()
      }, 700) as unknown as number // 长按 700ms
    },
    onPressEnd() {
      this.pressed = false
      if (this.pressTimer) {
        clearTimeout(this.pressTimer as number)
        this.pressTimer = null
      }
    },
    onPressCancel() {
      this.onPressEnd()
    },
    goAdmin() {
      // 路由到 AppsAdmin 页面
      if ((this as any).$router) {
        try {
          (this as any).$router.push({ name: 'AppsAdmin' })
        } catch (err) {
          (this as any).$router.push('/AppsAdmin')
        }
      } else {
        window.location.href = '/AppsAdmin'
      }
    },
  },
  // 兼容 Vue2/Vue3 的卸载清理
  beforeDestroy() {
    if (this.pressTimer) clearTimeout(this.pressTimer as number)
  },
  beforeUnmount() {
    if (this.pressTimer) clearTimeout(this.pressTimer as number)
  },
})
</script>
