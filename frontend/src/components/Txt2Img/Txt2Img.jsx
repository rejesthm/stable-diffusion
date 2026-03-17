import { useState } from 'react'
import { txt2img } from '../../api/txt2img'
import { useModels } from '../../hooks/useModels'
import { useProgressContext } from '../ProgressBar/ProgressBar'

export default function Txt2Img() {
  const { samplers, loading, error } = useModels()
  const { setActiveTask } = useProgressContext()
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [steps, setSteps] = useState(20)
  const [cfgScale, setCfgScale] = useState(7)
  const [width, setWidth] = useState(512)
  const [height, setHeight] = useState(512)
  const [seed, setSeed] = useState(-1)
  const [samplerName, setSamplerName] = useState('Euler')
  const [images, setImages] = useState([])
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState(null)

  async function handleGenerate() {
    setGenerating(true)
    setGenError(null)
    const taskId = `task(txt2img-${Date.now().toString(36)})`

    try {
      setActiveTask(taskId)

      const res = await txt2img({
        prompt,
        negative_prompt: negativePrompt,
        steps,
        cfg_scale: cfgScale,
        width,
        height,
        seed: seed === -1 ? -1 : seed,
        sampler_index: samplerName,
        sampler_name: samplerName,
        force_task_id: taskId,
      })

      setImages(res.images || [])
      setActiveTask(null)
    } catch (err) {
      setGenError(err.message)
      setActiveTask(null)
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-accent)' }} />
          <span style={{ color: 'var(--color-text-muted)' }}>Loading models...</span>
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      <div className="xl:col-span-2 space-y-5">
        <div className="card space-y-5">
          <div>
            <label className="label">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="input-field resize-none"
              rows={4}
              placeholder="Describe the image you want to generate..."
            />
          </div>
          <div>
            <label className="label">Negative prompt</label>
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="input-field resize-none"
              rows={2}
              placeholder="What to avoid in the image..."
            />
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Generation settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Steps</label>
              <input
                type="number"
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="input-field"
                min={1}
                max={150}
              />
            </div>
            <div>
              <label className="label">CFG Scale</label>
              <input
                type="number"
                step="0.5"
                value={cfgScale}
                onChange={(e) => setCfgScale(Number(e.target.value))}
                className="input-field"
                min={1}
                max={30}
              />
            </div>
            <div>
              <label className="label">Width</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="input-field"
                min={64}
                max={2048}
                step={64}
              />
            </div>
            <div>
              <label className="label">Height</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="input-field"
                min={64}
                max={2048}
                step={64}
              />
            </div>
            <div>
              <label className="label">Sampler</label>
              <select
                value={samplerName}
                onChange={(e) => setSamplerName(e.target.value)}
                className="input-field"
              >
                {samplers.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Seed</label>
              <input
                type="number"
                value={seed === -1 ? '' : seed}
                onChange={(e) => setSeed(e.target.value === '' ? -1 : Number(e.target.value))}
                placeholder="-1 (random)"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {genError && (
          <div className="card py-3" style={{ borderColor: 'var(--color-error)', background: 'rgba(239, 68, 68, 0.1)' }}>
            <span className="text-sm" style={{ color: 'var(--color-error)' }}>{genError}</span>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary w-full py-3 text-base"
        >
          {generating ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </span>
          ) : (
            'Generate'
          )}
        </button>
      </div>

      <div className="xl:col-span-3">
        <div className="card min-h-[400px]">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Output</h3>
          {images.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {images.map((img, i) => (
                <div key={i} className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
                  <img
                    src={`data:image/png;base64,${img}`}
                    alt={`Generated ${i + 1}`}
                    className="w-full h-auto block"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center" style={{ color: 'var(--color-text-dim)' }}>
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Generated images will appear here</p>
              <p className="text-xs mt-1">Enter a prompt and click Generate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
