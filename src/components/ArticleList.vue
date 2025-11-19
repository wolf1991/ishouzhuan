<template>
  <div class="divide-y divide-gray-200">
    <ul>
      <li v-for="article in articles" :key="article.id" class="flex flex-col md:flex-row py-5 hover:bg-gray-50">
        <a :href="article.url" class="flex-shrink-0 w-full md:w-48 h-48 md:h-32 md:mr-5 mb-4 md:mb-0 overflow-hidden rounded">
          <img :src="article.image" :alt="article.title" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105">
        </a>
        <div class="flex-1 flex flex-col">
          <a :href="article.url" class="text-lg font-bold text-gray-800 mb-2.5 block hover:text-orange-500">{{ article.title }}</a>
          <p class="text-gray-600 leading-relaxed mb-2.5 overflow-hidden text-ellipsis" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">{{ article.description }}</p>
          <div class="mt-auto">
            <span class="text-gray-500 text-xs mr-4">{{ article.views }}人在关注</span>
            <span class="text-gray-500 text-xs">{{ article.date }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface ArticleItem {
  id: number
  title: string
  description: string
  url: string
  image: string
  views: number
  date: string
}

export default defineComponent({
  name: 'ArticleList',
  data(): { articles: ArticleItem[] } {
    return {
      articles: [
        {
          id: 153,
          title: '码支付个人免签约即时到账平台',
          description: '注册与登录 首先，请访问码支付授权官网( https://www.bbh98.cn/ )进行注册和登录。 支付宝个人免挂-出现以下问题的，请更换支付宝跳转模式，选择（转账单跳转模式 ） 或（无备注跳转模',
          url: 'https://szw.lmzy98.cn/m/view.php?aid=153',
          image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeQAAAB9CAYAAABzsBDGAAA5VElEQVR42u2dB5hV1bXHz73TK0hREw1FBYymG03sGFGMIY839bwkNMVeYjdGA0jYdin2...',
          views: 682,
          date: '2025-08-16'
        },
        {
          id: 152,
          title: 'app在线打包封装-在线封装APP-网站打包APP工具',
          description: '随着移动互联网的快速发展，APP在线封装和分发平台成为开发者不可或缺的工具。 这些平台不仅简化了应用打包流程，还提供了高效的分发渠道，大大降低了技术门槛和运营成本。 一',
          url: 'https://szw.lmzy98.cn/m/view.php?aid=152',
          image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeQAAAB9CAYAAABzsBDGAAA5VElEQVR42u2dB5hV1bXHz73TK0hREw1FBYymG03sGFGMIY839bwkNMVeYjdGA0jYdin2...',
          views: 987,
          date: '2025-08-16'
        }
        // ... more articles
      ]
    }
  }
})
</script>
