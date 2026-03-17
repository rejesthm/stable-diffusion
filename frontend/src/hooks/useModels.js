import { useState, useEffect } from 'react'
import {
  getSamplers,
  getSdModels,
  getSdVae,
  getOptions,
  getUpscalers,
  getFaceRestorers,
} from '../api/models'

export function useModels() {
  const [samplers, setSamplers] = useState([])
  const [sdModels, setSdModels] = useState([])
  const [sdVae, setSdVae] = useState([])
  const [options, setOptions] = useState(null)
  const [upscalers, setUpscalers] = useState([])
  const [faceRestorers, setFaceRestorers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [s, m, v, o, u, f] = await Promise.all([
          getSamplers(),
          getSdModels(),
          getSdVae(),
          getOptions(),
          getUpscalers(),
          getFaceRestorers(),
        ])
        setSamplers(s)
        setSdModels(m)
        setSdVae(v)
        setOptions(o)
        setUpscalers(u)
        setFaceRestorers(f)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return {
    samplers,
    sdModels,
    sdVae,
    options,
    upscalers,
    faceRestorers,
    loading,
    error,
  }
}
