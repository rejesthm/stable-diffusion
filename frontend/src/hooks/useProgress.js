import { useState, useEffect, useCallback } from 'react'
import { getProgress } from '../api/progress'

export function useProgress(taskId) {
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState(null)

  const poll = useCallback(async () => {
    if (!taskId) return
    try {
      const data = await getProgress(taskId, true, -1)
      setProgress(data)
      setError(null)
      return data
    } catch (err) {
      setError(err.message)
      return null
    }
  }, [taskId])

  useEffect(() => {
    if (!taskId) {
      setProgress(null)
      return
    }

    const interval = setInterval(poll, 500)
    poll()

    return () => clearInterval(interval)
  }, [taskId, poll])

  return { progress, error, poll }
}
