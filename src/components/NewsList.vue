<template>
  <div class="border-t-8 border-gray-100 px-3">
    <div class="h-8 leading-8 pt-3 flex justify-between items-center">
      <span class="text-base text-gray-800 font-semibold">手赚资讯</span>
      <a href="https://szw.lmzy98.cn/m/list.php?tid=5" class="text-sm text-gray-500">更多 +</a>
    </div>
    <ul class="divide-y divide-gray-200">
      <li v-for="article in articles" :key="article.id" class="flex py-5">
        <a :href="article.url" class="flex-shrink-0 mr-3">
          <img :src="article.image" :alt="article.title" class="w-14 h-14 rounded-md">
        </a>
        <div class="flex-1">
          <a :href="article.url" class="block text-sm text-gray-800 leading-tight">{{ article.title }}</a>
          <p class="w-full h-9 leading-tight text-xs text-gray-500 mt-0.5 overflow-hidden">{{ article.description }}</p>
          <div class="mt-2">
            <span class="float-left text-xs text-gray-400 mr-2.5">{{ article.views }}人在关注</span>
            <span class="float-left text-xs text-gray-400">{{ article.date }}</span>
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
  name: 'NewsList',
  data(): { articles: ArticleItem[] } {
    return {
      articles: [
        {
          id: 154,
          title: '公众号无限回调登录系统接口',
          description: '可将你的web网站接入一个微信域名回调登录功能。 微信域名回调第三方授权登录是一种常见的用户身份验证机制，它允许用户通过自己的微信账号登录应用程序，而无需创建新的账户。',
          url: 'https://szw.lmzy98.cn/m/view.php?aid=154',
          image: './staticFiles/1-250Q61S9590-L.png',
          views: 136,
          date: '2025-08-16'
        },
        {
          id: 151,
          title: '手赚网app推广平台',
          description: '手赚网APP推广平台主要通过聚合各类手机赚钱应用并提供下载分发服务实现推广变现，其核心特点和运作模式如下： 一、平台定位与服务模式 应用分发中心 整合CPA（按安装付费）、',
          url: 'https://szw.lmzy98.cn/m/view.php?aid=151',
          image: './staticFiles/1-250Q61QQ40-L.png',
          views: 1594,
          date: '2025-08-16'
        },
        {
          id: 153,
          title: '码支付个人免签约即时到账平台',
          description: '注册与登录 首先，请访问码支付授权官网( https://www.bbh98.cn/ )进行注册和登录。 支付宝个人免挂-出现以下问题的，请更换支付宝跳转模式，选择（转账单跳转模式 ） 或（无备注跳转模',
          url: 'https://szw.lmzy98.cn/m/view.php?aid=153',
          image: './staticFiles/1-250Q61SI10-L.png',
          views: 682,
          date: '2025-08-16'
        },
        {
          id: 152,
          title: 'app在线打包封装-在线封装APP-网站打包APP工具',
          description: '随着移动互联网的快速发展，APP在线封装和分发平台成为开发者不可或缺的工具。 这些平台不仅简化了应用打包流程，还提供了高效的分发渠道，大大降低了技术门槛和运营成本。 一',
          url: 'https://szw.lmzy98.cn/m/view.php?aid=152',
          image: './staticFiles/1-250Q61S5020-L.png',
          views: 987,
          date: '2025-08-16'
        }
      ]
    }
  }
})
</script>
