import { apiGet, apiPost } from './client'

export async function getSamplers() {
  return apiGet('/sdapi/v1/samplers')
}

export async function getSchedulers() {
  return apiGet('/sdapi/v1/schedulers')
}

export async function getSdModels() {
  return apiGet('/sdapi/v1/sd-models')
}

export async function getSdVae() {
  return apiGet('/sdapi/v1/sd-vae')
}

export async function getOptions() {
  return apiGet('/sdapi/v1/options')
}

export async function setOptions(options) {
  return apiPost('/sdapi/v1/options', options)
}

export async function getUpscalers() {
  return apiGet('/sdapi/v1/upscalers')
}

export async function getFaceRestorers() {
  return apiGet('/sdapi/v1/face-restorers')
}
