import { createContext, useContext, useState, useCallback } from 'react'
import { useProgress } from '../../hooks/useProgress'

const ProgressContext = createContext(null)

export function ProgressProvider({ children }) {
  const [taskId, setTaskId] = useState(null)
  const { progress } = useProgress(taskId)

  const setActiveTask = useCallback((id) => {
    setTaskId(id)
  }, [])

  return (
    <ProgressContext.Provider value={{ progress, setActiveTask, taskId }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgressContext() {
  return useContext(ProgressContext)
}

export default function ProgressBar() {
  const ctx = useProgressContext()
  const progress = ctx?.progress

  if (!progress || (!progress.active && !progress.queued && !progress.completed)) {
    return null
  }

  const pct = progress.progress != null ? Math.round(progress.progress * 100) : 0

  return (
    <div className="px-6 py-3 border-b" style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}>
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-card)' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${pct}%`, background: 'var(--color-progress)' }}
          />
        </div>
        <span className="text-sm font-semibold tabular-nums min-w-[3rem]" style={{ color: 'var(--color-text)' }}>{pct}%</span>
        <span className="text-sm truncate max-w-[200px]" style={{ color: 'var(--color-text-muted)' }}>{progress.textinfo || ''}</span>
      </div>
    </div>
  )
}
