/**
 * Base API client for Stable Diffusion backend.
 * Uses relative URLs in dev (Vite proxy) or VITE_API_URL in production.
 */

const BASE_URL = import.meta.env.VITE_API_URL || ''

export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  return res.json()
}

export async function apiPost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  return res.json()
}
