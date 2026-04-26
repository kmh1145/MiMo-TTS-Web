import React, { useState } from 'react'
import { useCookie } from './hooks/useCookie'
import ApiKeyInput from './components/ApiKeyInput'
import TabBar from './components/TabBar'
import PresetVoice from './components/PresetVoice'
import VoiceDesign from './components/VoiceDesign'
import VoiceClone from './components/VoiceClone'
import AudioPlayer from './components/AudioPlayer'
import { DEFAULT_BASE_URL } from './types'
import type { SynthesisMode, SynthesisResult } from './types'

const App: React.FC = () => {
  const [apiKey, setApiKey] = useCookie('mimo_api_key', '')
  const [baseUrl, setBaseUrl] = useCookie('mimo_base_url', DEFAULT_BASE_URL)
  const [mode, setMode] = useState<SynthesisMode>('preset')
  const [result, setResult] = useState<SynthesisResult | null>(null)

  const handleSaveKey = (key: string, url: string) => {
    setApiKey(key)
    setBaseUrl(url)
  }

  const handleResult = (r: SynthesisResult) => {
    setResult(r)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">MiMo TTS</h1>
          <span className="header-subtitle">语音合成服务</span>
          <span className="header-powered">Powered by MiMo-V2.5-TTS</span>
        </div>
        <ApiKeyInput apiKey={apiKey} baseUrl={baseUrl} onSave={handleSaveKey} />
      </header>

      {!apiKey ? (
        <div className="empty-state">
          <div className="empty-icon">🔑</div>
          <h2>请输入 API Key</h2>
          <p>
            在{' '}
            <a href="https://platform.xiaomimimo.com" target="_blank" rel="noopener noreferrer">
              MiMo 开放平台
            </a>{' '}
            获取 API Key 后填入上方输入框，即可开始使用语音合成服务。
          </p>
        </div>
      ) : (
        <>
          <TabBar active={mode} onChange={setMode} />

          <main className="main-content">
            {mode === 'preset' && (
              <PresetVoice apiKey={apiKey} baseUrl={baseUrl} onResult={handleResult} />
            )}
            {mode === 'design' && (
              <VoiceDesign apiKey={apiKey} baseUrl={baseUrl} onResult={handleResult} />
            )}
            {mode === 'clone' && (
              <VoiceClone apiKey={apiKey} baseUrl={baseUrl} onResult={handleResult} />
            )}
          </main>
        </>
      )}

      {result && (
        <AudioPlayer
          audioData={result.audioData}
          format={result.format}
          onClose={() => setResult(null)}
        />
      )}

      <footer className="footer">
        <span>本网页托管于 Cloudflare</span>
        <span className="footer-sep">|</span>
        <span>API Key 保存于浏览器 Cookie 中，无需担心泄露风险</span>
         <span className="footer-sep">|</span>
        <a
          href="https://github.com/kmh1145/MiMo-TTS-Web"
          target="_blank"
          rel="noopener noreferrer"
        >
          项目开源地址
        </a>
      </footer>
    </div>
  )
}

export default App
