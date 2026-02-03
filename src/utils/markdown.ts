import MarkdownIt from 'markdown-it'

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
})

const ASSET_ATTR_RE =
  /(src|href|poster)=\"(?!https?:|data:|\/\/)([^\"#]+)(#[^\"]*)?\"/g

export type AssetUrlMap = Record<string, string>

export function resolveMarkdownAssets(
  html: string,
  basePath: string | undefined,
  assetMap: AssetUrlMap,
) {
  if (!basePath) return html
  const baseUrl = new URL(basePath, window.location.origin).href

  return html.replace(ASSET_ATTR_RE, (_match, attr, url, hash = '') => {
    const resolvedPath = new URL(url, baseUrl).pathname
    const mapped = assetMap[resolvedPath]
    if (mapped) {
      return `${attr}="${mapped}${hash}"`
    }
    const fallback = new URL(url, baseUrl).href
    return `${attr}="${fallback}${hash}"`
  })
}

export function renderMarkdown(source: string) {
  return markdown.render(source || '')
}
