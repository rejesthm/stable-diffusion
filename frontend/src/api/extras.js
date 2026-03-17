import { apiPost } from './client'

export async function extraSingleImage(params) {
  return apiPost('/sdapi/v1/extra-single-image', params)
}

export async function extraBatchImages(params) {
  return apiPost('/sdapi/v1/extra-batch-images', params)
}
