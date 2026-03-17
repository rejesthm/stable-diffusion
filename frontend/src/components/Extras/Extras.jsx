import { useState } from 'react'
import { extraSingleImage } from '../../api/extras'
import { useModels } from '../../hooks/useModels'

export default function Extras() {
  const { upscalers, loading, error } = useModels()
  const [sourceImage, setSourceImage] = useState(null)
  const [upscaler1, setUpscaler1] = useState('None')
  const [upscaleFactor, setUpscaleFactor] = useState(2)
  const [gfpganVisibility, setGfpganVisibility] = useState(0)
  const [codeformerVisibility, setCodeformerVisibility] = useState(0)
  const [images, setImages] = useState([])
  const [processing, setProcessing] = useState(false)
  const [procError, setProcError] = useState(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setSourceImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  async function handleProcess() {
    if (!sourceImage) {
      setProcError('Please select an image first')
      return
    }

    setProcessing(true)
    setProcError(null)

    try {
      const base64 = sourceImage.includes(',') ? sourceImage.split(',')[1] : sourceImage

      const res = await extraSingleImage({
        image: base64,
        upscaler_1: upscaler1,
        upscaling_resize: upscaleFactor,
        gfpgan_visibility: gfpganVisibility,
        codeformer_visibility: codeformerVisibility,
      })

      if (res.image) {
        setImages([res.image])
      }
    } catch (err) {
      setProcError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-accent)' }} />
          <span style={{ color: 'var(--color-text-muted)' }}>Loading...</span>
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
            className="rounded-lg border-2 border-dashed cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[180px] p-6"
            style={{ borderColor: 'var(--color-text-dim)', background: 'rgba(45, 58, 79, 0.3)' }}
            onClick={() => document.getElementById('extras-file').click()}
          >
            <input id="extras-file" type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            {sourceImage ? (
              <img src={sourceImage} alt="Source" className="max-h-48 rounded-lg" />
            ) : (
              <>
                <svg className="w-12 h-12 mb-2 opacity-60" style={{ color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
                </svg>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Click to select image</span>
              </>
            )}
          </div>
        </div>

        <div className="card space-y-5">
          <div>
            <label className="label">Upscaler</label>
            <select value={upscaler1} onChange={(e) => setUpscaler1(e.target.value)} className="input-field">
              {upscalers.map((u) => <option key={u.name} value={u.name}>{u.name}</option>)}
            </select>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="label mb-0">Upscale factor</label>
              <span className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>{upscaleFactor}x</span>
            </div>
            <input type="range" min="1" max="4" step="0.5" value={upscaleFactor} onChange={(e) => setUpscaleFactor(Number(e.target.value))} className="w-full" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="label mb-0">GFPGAN visibility</label>
              <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{Math.round(gfpganVisibility * 100)}%</span>
            </div>
            <input type="range" min="0" max="1" step="0.1" value={gfpganVisibility} onChange={(e) => setGfpganVisibility(Number(e.target.value))} className="w-full" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="label mb-0">CodeFormer visibility</label>
              <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{Math.round(codeformerVisibility * 100)}%</span>
            </div>
            <input type="range" min="0" max="1" step="0.1" value={codeformerVisibility} onChange={(e) => setCodeformerVisibility(Number(e.target.value))} className="w-full" />
          </div>
        </div>

        {procError && (
          <div className="card py-3" style={{ borderColor: 'var(--color-error)', background: 'rgba(239, 68, 68, 0.1)' }}>
            <span className="text-sm" style={{ color: 'var(--color-error)' }}>{procError}</span>
          </div>
        )}

        <button onClick={handleProcess} disabled={processing} className="btn-primary w-full py-3 text-base">
          {processing ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</span> : 'Process'}
        </button>
      </div>

      <div className="xl:col-span-3">
        <div className="card min-h-[400px]">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Output</h3>
          {images.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {images.map((img, i) => (
                <div key={i} className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
                  <img src={`data:image/png;base64,${img}`} alt={`Processed ${i + 1}`} className="w-full h-auto block" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center" style={{ color: 'var(--color-text-dim)' }}>
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <p className="text-sm">Processed images will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
