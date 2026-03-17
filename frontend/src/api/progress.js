import { apiGet, apiPost } from './client'

export async function getProgress(idTask, livePreview = true, idLivePreview = -1) {
  return apiPost('/internal/progress', {
    id_task: idTask,
    live_preview: livePreview,
    id_live_preview: idLivePreview,
  })
}

export async function getPendingTasks() {
  return apiGet('/internal/pending-tasks')
}
