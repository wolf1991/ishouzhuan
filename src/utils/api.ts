export async function fetchJson<T = any>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, options)
    if (!res.ok) return null
    return (await res.json()) as T
  } catch (e) {
    console.error(`请求 ${url} 失败:`, e)
    return null
  }
}
