import { computed, unref, type MaybeRef } from 'vue'
import { renderMarkdown, resolveMarkdownAssets } from '../utils/markdown'

const serviceMarkdown = import.meta.glob(
  '../assets/data-src/services/content/*.md',
  {
    as: 'raw',
    eager: true,
  },
) as Record<string, string>

const blogMarkdown = import.meta.glob(
  '../assets/data-src/blog/content/*.md',
  {
    as: 'raw',
    eager: true,
  },
) as Record<string, string>

const assetMap = {
  ...import.meta.glob('../assets/imgs-src/**/*.{png,jpg,jpeg,webp,svg}', {
    eager: true,
    as: 'url',
  }),
  ...import.meta.glob('../assets/videos-src/**/*.{mp4,webm,ogg}', {
    eager: true,
    as: 'url',
  }),
} as Record<string, string>

const categoryMap = {
  services: serviceMarkdown,
  blog: blogMarkdown,
} as const

export type MarkdownCategory = keyof typeof categoryMap

export function useMarkdownContent(
  category: MarkdownCategory,
  key: MaybeRef<string>,
) {
  const sources = categoryMap[category]

  const html = computed(() => {
    const resolvedKey = unref(key).trim()
    const entry = Object.entries(sources).find(([path]) =>
      path.toLowerCase().endsWith(`/${resolvedKey.toLowerCase()}.md`),
    )
    const raw =
      entry?.[1] ??
      `# Материал не найден\n\nФайл ${resolvedKey}.md отсутствует.`
    const basePath = entry?.[0]
    return resolveMarkdownAssets(renderMarkdown(raw), basePath, assetMap)
  })

  return {
    html,
  }
}
