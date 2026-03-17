import { apiPost } from './client'

export async function img2img(params) {
  return apiPost('/sdapi/v1/img2img', params)
}
