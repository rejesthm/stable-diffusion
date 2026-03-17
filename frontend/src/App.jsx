import { useState } from 'react'
import Txt2Img from './components/Txt2Img/Txt2Img'
import Img2Img from './components/Img2Img/Img2Img'
import Extras from './components/Extras/Extras'
import Settings from './components/Settings/Settings'
import ExtraNetworks from './components/ExtraNetworks/ExtraNetworks'
import ProgressBar, { ProgressProvider } from './components/ProgressBar/ProgressBar'

const TABS = [
  { id: 'txt2img', label: 'Text to Image' },
  { id: 'img2img', label: 'Image to Image' },
  { id: 'extras', label: 'Extras' },
  { id: 'extra_networks', label: 'Extra Networks' },
  { id: 'settings', label: 'Settings' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('txt2img')

  return (
    <ProgressProvider>
      <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
        <header className="border-b px-6 py-4" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)' }}>
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-accent)' }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--color-text)' }}>
              Stable Diffusion WebUI
            </h1>
          </div>
        </header>

        <nav className="border-b px-6" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)' }}>
          <div className="max-w-7xl mx-auto flex gap-1 py-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-150"
                style={{
                  background: activeTab === tab.id ? 'var(--color-accent)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--color-text-muted)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        <ProgressBar />

        <main className="max-w-7xl mx-auto px-6 py-6">
          {activeTab === 'txt2img' && <Txt2Img />}
          {activeTab === 'img2img' && <Img2Img />}
          {activeTab === 'extras' && <Extras />}
          {activeTab === 'extra_networks' && <ExtraNetworks />}
          {activeTab === 'settings' && <Settings />}
        </main>
      </div>
    </ProgressProvider>
  )
}
