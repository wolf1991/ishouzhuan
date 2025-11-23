/**
 * SEO工具函数
 * 用于动态管理页面的meta标签和结构化数据
 * 特别针对百度搜索引擎优化
 */

export interface SEOConfig {
  title?: string
  description?: string
  keywords?: string
  canonical?: string
  ogImage?: string
  ogUrl?: string
  jsonLd?: object
  baiduPush?: boolean // 是否推送到百度
}

/**
 * 更新页面标题
 */
export function updateTitle(title: string) {
  document.title = title
  // 更新og:title
  updateMetaTag('property', 'og:title', title)
}

/**
 * 更新meta标签
 */
export function updateMetaTag(
  attribute: 'name' | 'property',
  key: string,
  value: string
) {
  let meta = document.querySelector(
    `meta[${attribute}="${key}"]`
  ) as HTMLMetaElement

  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attribute, key)
    document.head.appendChild(meta)
  }

  meta.content = value
}

/**
 * 更新canonical链接
 */
export function updateCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement

  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }

  link.href = url
}

/**
 * 注入JSON-LD结构化数据
 */
export function injectJsonLd(data: object, id: string = 'seo-jsonld') {
  // 移除旧的JSON-LD
  const existing = document.getElementById(id)
  if (existing) {
    existing.remove()
  }

  // 创建新的JSON-LD
  const script = document.createElement('script')
  script.id = id
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

/**
 * 应用SEO配置
 */
export function applySEO(config: SEOConfig) {
  if (config.title) {
    updateTitle(config.title)
  }

  if (config.description) {
    updateMetaTag('name', 'description', config.description)
    updateMetaTag('property', 'og:description', config.description)
    updateMetaTag('name', 'twitter:description', config.description)
  }

  if (config.keywords) {
    updateMetaTag('name', 'keywords', config.keywords)
  }

  if (config.canonical) {
    updateCanonical(config.canonical)
    updateMetaTag('property', 'og:url', config.canonical)
    updateMetaTag('name', 'twitter:url', config.canonical)
  }

  if (config.ogImage) {
    updateMetaTag('property', 'og:image', config.ogImage)
    updateMetaTag('name', 'twitter:image', config.ogImage)
  }

  if (config.ogUrl) {
    updateMetaTag('property', 'og:url', config.ogUrl)
  }

  if (config.jsonLd) {
    injectJsonLd(config.jsonLd)
  }
}

/**
 * 生成网站的结构化数据
 */
export function generateWebsiteJsonLd(baseUrl: string = 'https://szw.lmzy98.cn') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '手赚网',
    url: baseUrl,
    description: '手赚网-任务兼职平台是一个专业的手机赚钱软件分享平台，专注于app下载赚钱,提供手机赚钱软件排行及大全',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/m/e/search/index.php?keyboard={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

/**
 * 生成组织/公司的结构化数据
 */
export function generateOrganizationJsonLd(baseUrl: string = 'https://szw.lmzy98.cn') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '手赚网',
    url: baseUrl,
    logo: `${baseUrl}/m/skin/szw/images/logo.png`,
    description: '专业的手机赚钱软件分享平台',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: '客服',
      availableLanguage: 'Chinese'
    }
  }
}

/**
 * 生成应用列表的结构化数据
 */
export function generateItemListJsonLd(
  apps: Array<{ name: string; url: string; image: string; description?: string }>,
  listName: string = '热门应用'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    itemListElement: apps.map((app, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: app.name,
        url: app.url,
        image: app.image,
        description: app.description || `${app.name} - 手机赚钱应用`
      }
    }))
  }
}

/**
 * 百度自动推送URL
 * 当页面加载时，自动将当前URL推送给百度
 */
export function pushToBaidu(url?: string) {
  try {
    const currentUrl = url || window.location.href
    
    // 检查是否已经加载了百度推送脚本
    if (typeof (window as any).push !== 'undefined') {
      (window as any).push([currentUrl])
      return
    }
    
    // 如果没有加载，尝试使用fetch API推送（需要配置百度API）
    // 注意：这需要你在百度站长工具中配置API推送
    // 这里只是示例，实际使用时需要替换为你的API密钥
    const apiUrl = 'https://data.zz.baidu.com/urls?site=你的站点&token=你的token'
    
    // 如果需要使用API推送，取消下面的注释并配置
    /*
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: currentUrl
    }).catch(err => {
      console.warn('百度推送失败:', err)
    })
    */
  } catch (error) {
    console.warn('百度推送出错:', error)
  }
}

/**
 * 生成百度友好的结构化数据
 * 百度对某些结构化数据格式有特殊偏好
 */
export function generateBaiduFriendlyJsonLd(
  apps: Array<{ name: string; url: string; image: string; description?: string }>,
  listName: string = '热门应用'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    description: `${listName} - 手赚网精选手机赚钱应用`,
    itemListElement: apps.map((app, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        '@id': app.url,
        name: app.name,
        url: app.url,
        image: app.image,
        description: app.description || `${app.name} - 手机赚钱应用`,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Android, iOS',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'CNY'
        }
      }
    }))
  }
}

/**
 * 应用SEO配置（包含百度优化）
 */
export function applyBaiduSEO(config: SEOConfig) {
  // 应用基础SEO
  applySEO(config)
  
  // 百度自动推送
  if (config.baiduPush !== false) {
    // 延迟推送，确保页面完全加载
    setTimeout(() => {
      pushToBaidu(config.canonical)
    }, 1000)
  }
}

