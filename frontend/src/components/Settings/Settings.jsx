import { useState, useEffect } from 'react'
import { getOptions, setOptions } from '../../api/models'

export default function Settings() {
  const [options, setOptionsState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    getOptions()
      .then(setOptionsState)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    if (!options) return
    setSaving(true)
    setMessage(null)
    try {
      await setOptions(options)
      setMessage('Settings saved')
    } catch (err) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-accent)' }} />
          <span style={{ color: 'var(--color-text-muted)' }}>Loading settings...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card" style={{ borderColor: 'var(--color-error)' }}>
        <span style={{ color: 'var(--color-error)' }}>Error: {error}</span>
      </div>
    )
  }

  if (!options) return null

  const entries = Object.entries(options).filter(([k]) => !k.startsWith('_'))

  return (
    <div className="max-w-2xl space-y-6">
      <div className="card">
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
          Settings are loaded from the API. Key options are shown below.
        </p>
        <div className="space-y-0" style={{ borderTop: '1px solid var(--color-border)' }}>
          {entries.slice(0, 20).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between py-4 gap-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <span className="font-mono text-sm truncate" style={{ color: 'var(--color-text)', maxWidth: '12rem' }}>{key}</span>
              <span className="text-sm truncate" style={{ color: 'var(--color-text-muted)' }}>
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </span>
            </div>
          ))}
        </div>
        {entries.length > 20 && (
          <p className="text-sm mt-4" style={{ color: 'var(--color-text-dim)' }}>... and {entries.length - 20} more options</p>
        )}
      </div>

      {message && (
        <div className="card py-3" style={{
          borderColor: message.startsWith('Error') ? 'var(--color-error)' : 'var(--color-success)',
          background: message.startsWith('Error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
        }}>
          <span className="text-sm" style={{ color: message.startsWith('Error') ? 'var(--color-error)' : 'var(--color-success)' }}>{message}</span>
        </div>
      )}

      <button onClick={handleSave} disabled={saving} className="btn-primary">
        {saving ? 'Saving...' : 'Save settings'}
      </button>
    </div>
  )
}
