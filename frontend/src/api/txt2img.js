import { apiPost } from './client'

export async function txt2img(params) {
  return apiPost('/sdapi/v1/txt2img', params)
}
