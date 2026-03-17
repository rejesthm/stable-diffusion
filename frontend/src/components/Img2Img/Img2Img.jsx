import { useState, useCallback, useEffect } from 'react'
import { img2img } from '../../api/img2img'
import { useModels } from '../../hooks/useModels'
import { useProgressContext } from '../ProgressBar/ProgressBar'
import { setOptions } from '../../api/models'

export default function Img2Img() {
  const { samplers, sdModels, options, loading, error } = useModels()
  const { setActiveTask } = useProgressContext()
  const [sdModel, setSdModel] = useState('')
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [initImage, setInitImage] = useState(null)
  const [steps, setSteps] = useState(20)
  const [cfgScale, setCfgScale] = useState(7)
  const [denoisingStrength, setDenoisingStrength] = useState(0.75)
  const [seed, setSeed] = useState(-1)
  const [samplerName, setSamplerName] = useState('Euler')
  const [images, setImages] = useState([])
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState(null)

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => setInitImage(reader.result)
      reader.readAsDataURL(file)
    }
  }, [])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setInitImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (options?.sd_model_checkpoint) {
      setSdModel(options.sd_model_checkpoint)
    } else if (sdModels.length > 0) {
      setSdModel((prev) => prev || sdModels[0].title)
    }
  }, [options, sdModels])

  async function handleModelChange(value) {
    setSdModel(value)
    try {
      await setOptions({ sd_model_checkpoint: value })
    } catch (err) {
      setGenError(err.message)
    }
  }

  async function handleGenerate() {
    if (!initImage) {
      setGenError('Please select an image first')
      return
    }

    setGenerating(true)
    setGenError(null)
    const taskId = `task(img2img-${Date.now().toString(36)})`

    try {
      setActiveTask(taskId)

      const base64 = initImage.includes(',') ? initImage.split(',')[1] : initImage

      const res = await img2img({
        init_images: [base64],
        prompt,
        negative_prompt: negativePrompt,
        steps,
        cfg_scale: cfgScale,
        denoising_strength: denoisingStrength,
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
        <div className="card">
          <label className="label">Source image</label>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('img2img-file').click()}
            className="rounded-lg border-2 border-dashed cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[180px] p-6"
            style={{
              borderColor: initImage ? 'var(--color-border)' : 'var(--color-text-dim)',
              background: initImage ? 'transparent' : 'rgba(45, 58, 79, 0.3)',
            }}
          >
            <input
              id="img2img-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            {initImage ? (
              <img src={initImage} alt="Source" className="max-h-48 rounded-lg" />
            ) : (
              <>
                <svg className="w-12 h-12 mb-2 opacity-60" style={{ color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                </svg>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Drop image or click to select</span>
              </>
            )}
          </div>
        </div>

        <div className="card space-y-4">
          <div>
            <label className="label">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="input-field resize-none"
              rows={3}
              placeholder="Describe the desired changes..."
            />
          </div>
          <div>
            <label className="label">Negative prompt</label>
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="input-field resize-none"
              rows={2}
            />
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Settings</h3>
          <div className="mb-4">
            <label className="label">Model</label>
            <select
              value={sdModel}
              onChange={(e) => handleModelChange(e.target.value)}
              className="input-field"
            >
              {sdModels.map((m) => (
                <option key={m.title} value={m.title}>{m.title}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="label">Steps</label>
              <input type="number" value={steps} onChange={(e) => setSteps(Number(e.target.value))} className="input-field" />
            </div>
            <div>
              <label className="label">CFG</label>
              <input type="number" step="0.5" value={cfgScale} onChange={(e) => setCfgScale(Number(e.target.value))} className="input-field" />
            </div>
            <div>
              <label className="label">Denoising</label>
              <input type="number" step="0.05" min="0" max="1" value={denoisingStrength} onChange={(e) => setDenoisingStrength(Number(e.target.value))} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Sampler</label>
              <select value={samplerName} onChange={(e) => setSamplerName(e.target.value)} className="input-field">
                {samplers.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Seed</label>
              <input type="number" value={seed === -1 ? '' : seed} onChange={(e) => setSeed(e.target.value === '' ? -1 : Number(e.target.value))} placeholder="-1" className="input-field" />
            </div>
          </div>
        </div>

        {genError && (
          <div className="card py-3" style={{ borderColor: 'var(--color-error)', background: 'rgba(239, 68, 68, 0.1)' }}>
            <span className="text-sm" style={{ color: 'var(--color-error)' }}>{genError}</span>
          </div>
        )}

        <button onClick={handleGenerate} disabled={generating} className="btn-primary w-full py-3 text-base">
          {generating ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Generating...</span> : 'Generate'}
        </button>
      </div>

      <div className="xl:col-span-3">
        <div className="card min-h-[400px]">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Output</h3>
          {images.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {images.map((img, i) => (
                <div key={i} className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
                  <img src={`data:image/png;base64,${img}`} alt={`Generated ${i + 1}`} className="w-full h-auto block" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center" style={{ color: 'var(--color-text-dim)' }}>
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
              </svg>
              <p className="text-sm">Generated images will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
