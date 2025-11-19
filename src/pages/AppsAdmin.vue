<template>
  <div class="max-w-7xl mx-auto bg-white min-h-screen p-4">
    <h1 class="text-2xl font-bold mb-4">Apps 数据维护</h1>

    <div class="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
      <p>说明：</p>
      <ul class="list-disc ml-5">
        <li>使用 GET /api/apps 获取数据，POST /api/apps 保存数据。</li>
        <li>每个一级菜单对应一个 JSON 数组，可在表格中编辑或直接编辑 JSON 字符串。</li>
        <li>hotApps 包含 topApps 和 listApps 两个数组。</li>
        <li>图片路径应以 /staticFiles/... 开头，或填写完整的外链 URL。</li>
      </ul>
    </div>

    <!-- Tabs 导航 -->
    <div class="mb-4 border-b border-gray-200">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="px-4 py-2 rounded-t border border-b-0 transition-colors"
          :class="activeTab === tab.key 
            ? 'bg-white text-blue-600 border-gray-300 font-semibold' 
            : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200'"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
        <button
          class="px-4 py-2 bg-emerald-600 text-white rounded ml-auto"
          @click="saveToServer"
        >
          保存到服务器
        </button>
        <button
          class="px-4 py-2 bg-gray-700 text-white rounded"
          @click="downloadJson"
        >
          下载 JSON
        </button>
        <label class="px-4 py-2 bg-gray-200 rounded cursor-pointer">
          从文件导入
          <input type="file" class="hidden" accept="application/json" @change="importFromFile" />
        </label>
      </div>
    </div>

    <input ref="fileInput" type="file" class="hidden" @change="handleFileChange" />

    <div class="space-y-4">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl font-semibold">{{ getTabLabel(activeTab) }}</h2>
        <div class="flex gap-2">
          <button class="px-3 py-1 bg-blue-600 text-white rounded text-sm" @click="addRow(activeTab)">新增行</button>
          <button class="px-3 py-1 bg-gray-500 text-white rounded text-sm" @click="toggleJsonEditor(activeTab)">
            {{ jsonEditorMode[activeTab] ? '表格视图' : 'JSON 编辑' }}
          </button>
        </div>
      </div>

      <!-- 表格视图 -->
      <div v-if="!jsonEditorMode[activeTab]" class="overflow-x-auto border rounded">
        <table class="w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-3 py-2 text-left border-b">序号</th>
              <th class="px-3 py-2 text-left border-b">名称</th>
              <th class="px-3 py-2 text-left border-b">链接 URL</th>
              <th class="px-3 py-2 text-left border-b">图片 URL</th>
              <th class="px-3 py-2 text-left border-b">日期</th>
              <th class="px-3 py-2 text-left border-b">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(app, idx) in getCurrentData(activeTab)" :key="activeTab + '-' + idx" class="hover:bg-gray-50">
              <td class="px-3 py-2 border-b">{{ idx + 1 }}</td>
              <td class="px-3 py-2 border-b">
                <input v-model="app.name" class="w-full border rounded px-2 py-1" placeholder="名称" />
              </td>
              <td class="px-3 py-2 border-b">
                <div class="flex items-center gap-2">
                  <input v-model="app.url" class="w-full border rounded px-2 py-1" placeholder="链接 URL" />
                  <button
                    type="button"
                    class="text-gray-500 hover:text-blue-600"
                    title="上传并填写链接"
                    :disabled="isUploading"
                    @click="startUpload(activeTab, idx, 'url')"
                  >
                    ⬆️
                  </button>
                </div>
              </td>
              <td class="px-3 py-2 border-b">
                <div class="flex items-center gap-2">
                  <input v-model="app.image" class="w-full border rounded px-2 py-1" placeholder="图片 URL" />
                  <button
                    type="button"
                    class="text-gray-500 hover:text-blue-600"
                    title="上传并填写图片"
                    :disabled="isUploading"
                    @click="startUpload(activeTab, idx, 'image')"
                  >
                    ⬆️
                  </button>
                </div>
              </td>
              <td class="px-3 py-2 border-b">
                <input v-model="app.date" class="w-full border rounded px-2 py-1" placeholder="日期 (可选)" />
              </td>
              <td class="px-3 py-2 border-b">
                <button class="text-red-600 text-sm" @click="removeRow(activeTab, idx)">删除</button>
              </td>
            </tr>
            <tr v-if="getCurrentData(activeTab).length === 0">
              <td colspan="6" class="px-3 py-4 text-center text-gray-500">暂无数据，点击"新增行"添加</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- JSON 编辑器 -->
      <div v-else class="border rounded p-3">
        <textarea
          v-model="jsonStrings[activeTab]"
          class="w-full h-96 font-mono text-sm border rounded p-2"
          placeholder='[{"name":"","url":"","image":""}]'
          @blur="parseJsonString(activeTab)"
        ></textarea>
        <p class="text-xs text-gray-500 mt-1">编辑 JSON 字符串，失焦时自动解析</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { fetchJson } from '@/utils/api'

type TabKey =
  | 'recommandApps'
  | 'hotAppsTop'
  | 'recentApps'
  | 'iosApps'
  | 'androidApps'

interface TabConfig {
  key: TabKey
  label: string
  path: string[]
}

interface AppsDataShape {
  recommandApps: any[]
  hotApps: { topApps: any[]; listApps: any[] }
  recentApps: any[]
  iosApps: any[]
  androidApps: any[]
}

const tabs: TabConfig[] = [
  { key: 'recommandApps', label: '站长推荐', path: ['recommandApps'] },
  { key: 'hotAppsTop', label: '热门下载', path: ['hotApps', 'topApps'] },
  { key: 'recentApps', label: '最近更新', path: ['recentApps'] },
  { key: 'iosApps', label: '苹果 Apps', path: ['iosApps'] },
  { key: 'androidApps', label: '安卓 Apps', path: ['androidApps'] },
]

export default defineComponent({
  name: 'AppsAdmin',
  setup() {
    const activeTab = ref<TabKey>('recommandApps')

    const appsData = reactive<AppsDataShape>({
      recommandApps: [],
      hotApps: { topApps: [], listApps: [] },
      recentApps: [],
      iosApps: [],
      androidApps: []
    })

    const createStateMap = <T,>(value: T) => {
      return tabs.reduce((acc, tab) => {
        acc[tab.key] = typeof value === 'function' ? (value as any)(tab) : value
        return acc
      }, {} as Record<TabKey, T>)
    }

    const jsonEditorMode = reactive(createStateMap(false))
    const jsonStrings = reactive(createStateMap(''))

    const getTabConfig = (key: TabKey) => tabs.find(t => t.key === key)!

    const getTabLabel = (key: TabKey) => getTabConfig(key).label

    const getArrayRef = (path: string[]) => {
      let target: any = appsData
      for (let i = 0; i < path.length - 1; i++) {
        target = target[path[i]]
      }
      const lastKey = path[path.length - 1]
      if (!Array.isArray(target[lastKey])) {
        target[lastKey] = []
      }
      return target[lastKey]
    }

    const setArrayRef = (path: string[], value: any[]) => {
      let target: any = appsData
      for (let i = 0; i < path.length - 1; i++) {
        target = target[path[i]]
      }
      target[path[path.length - 1]] = value
    }

    const normalizeData = (data: any) => {
      if (data.topApps || data.listApps) {
        setArrayRef(['hotApps', 'topApps'], Array.isArray(data.topApps) ? data.topApps : [])
        setArrayRef(['hotApps', 'listApps'], Array.isArray(data.listApps) ? data.listApps : [])
      }

      if (data.recommandApps) appsData.recommandApps = Array.isArray(data.recommandApps) ? data.recommandApps : []
      if (data.hotApps) {
        setArrayRef(['hotApps', 'topApps'], Array.isArray(data.hotApps.topApps) ? data.hotApps.topApps : [])
        setArrayRef(['hotApps', 'listApps'], Array.isArray(data.hotApps.listApps) ? data.hotApps.listApps : [])
      }
      if (data.recentApps) appsData.recentApps = Array.isArray(data.recentApps) ? data.recentApps : []
      if (data.iosApps) appsData.iosApps = Array.isArray(data.iosApps) ? data.iosApps : []
      if (data.androidApps) appsData.androidApps = Array.isArray(data.androidApps) ? data.androidApps : []
    }

    const updateJsonStrings = () => {
      jsonStrings.recommandApps = JSON.stringify(appsData.recommandApps, null, 2)
      jsonStrings.hotAppsTop = JSON.stringify(appsData.hotApps.topApps, null, 2)
      jsonStrings.recentApps = JSON.stringify(appsData.recentApps, null, 2)
      jsonStrings.iosApps = JSON.stringify(appsData.iosApps, null, 2)
      jsonStrings.androidApps = JSON.stringify(appsData.androidApps, null, 2)
    }

    const loadData = async () => {
      const apiData = await fetchJson('/api/apps', { cache: 'no-cache' })
      if (apiData) {
        normalizeData(apiData)
        updateJsonStrings()
        return
      }
      updateJsonStrings()
    }

    const getCurrentData = (tabKey: TabKey) => {
      const config = getTabConfig(tabKey)
      return getArrayRef(config.path)
    }

    const createEmptyItem = (tabKey: TabKey) => {
      return { name: '', url: '', image: '', date: '' }
    }

    const addRow = (tabKey: TabKey) => {
      const arr = getCurrentData(tabKey)
      arr.push(createEmptyItem(tabKey))
      updateJsonStrings()
    }

    const removeRow = (tabKey: TabKey, idx: number) => {
      const arr = getCurrentData(tabKey)
      arr.splice(idx, 1)
      updateJsonStrings()
    }

    const toggleJsonEditor = (tabKey: TabKey) => {
      jsonEditorMode[tabKey] = !jsonEditorMode[tabKey]
    }

    const parseJsonString = (tabKey: TabKey) => {
      try {
        const parsed = JSON.parse(jsonStrings[tabKey])
        if (!Array.isArray(parsed)) {
          throw new Error('必须是数组格式')
        }
        const config = getTabConfig(tabKey)
        setArrayRef(config.path, parsed)
        updateJsonStrings()
      } catch (e: any) {
        alert('JSON 解析失败: ' + e.message)
      }
    }

    const saveToServer = async () => {
      try {
        const payload = {
          recommandApps: appsData.recommandApps,
          hotApps: appsData.hotApps,
          recentApps: appsData.recentApps,
          iosApps: appsData.iosApps,
          androidApps: appsData.androidApps
        }
        const res = await fetch('/api/apps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error(await res.text())
        alert('已保存到服务器 /api/apps')
      } catch (e: any) {
        alert('保存失败: ' + e.message)
      }
    }

    const downloadJson = () => {
      const payload = {
        recommandApps: appsData.recommandApps,
        hotApps: appsData.hotApps,
        recentApps: appsData.recentApps,
        iosApps: appsData.iosApps,
        androidApps: appsData.androidApps
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'apps.json'
      a.click()
      URL.revokeObjectURL(url)
    }

    const importFromFile = (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files && target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string)
          normalizeData(data)
          updateJsonStrings()
          alert('导入成功')
        } catch (err: any) {
          alert('JSON 解析失败: ' + err.message)
        }
      }
      reader.readAsText(file)
      target.value = ''
    }

    const fileInput = ref<HTMLInputElement | null>(null)
    const pendingUpload = ref<{ tabKey: TabKey; index: number; field: 'url' | 'image'; accept: string } | null>(null)
    const isUploading = ref(false)

    const startUpload = (tabKey: TabKey, index: number, field: 'url' | 'image') => {
      const input = fileInput.value
      if (!input) return
      pendingUpload.value = {
        tabKey,
        index,
        field,
        accept: field === 'image' ? 'image/*' : '*/*'
      }
      input.accept = pendingUpload.value.accept
      input.value = ''
      input.click()
    }

    const handleFileChange = async (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files && target.files[0]
      if (!file || !pendingUpload.value) return
      isUploading.value = true
      try {
        const url = await uploadFile(file)
        const arr = getCurrentData(pendingUpload.value.tabKey)
        arr[pendingUpload.value.index][pendingUpload.value.field] = url
        updateJsonStrings()
      } catch (err: any) {
        alert(err?.message || '文件上传失败')
      } finally {
        isUploading.value = false
        pendingUpload.value = null
        target.value = ''
      }
    }

    const uploadFile = async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      if (!res.ok) {
        throw new Error(await res.text())
      }
      const data = await res.json()
      if (!data?.url) {
        throw new Error('上传结果缺少 URL')
      }
      return data.url as string
    }

    onMounted(() => {
      loadData()
    })

    return {
      tabs,
      activeTab,
      appsData,
      jsonEditorMode,
      jsonStrings,
      getTabLabel,
      getCurrentData,
      addRow,
      removeRow,
      toggleJsonEditor,
      parseJsonString,
      saveToServer,
      downloadJson,
      importFromFile,
      fileInput,
      startUpload,
      handleFileChange,
      isUploading
    }
  }
})
</script>
