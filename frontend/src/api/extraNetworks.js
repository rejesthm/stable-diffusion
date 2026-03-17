const BASE = import.meta.env.VITE_API_URL || ''

export function getMetadataUrl(page, item) {
  return `${BASE}/sd_extra_networks/metadata?page=${encodeURIComponent(page)}&item=${encodeURIComponent(item)}`
}

export function getThumbUrl(filename, mtime) {
  return `${BASE}/sd_extra_networks/thumb?filename=${encodeURIComponent(filename)}&mtime=${mtime}`
}
