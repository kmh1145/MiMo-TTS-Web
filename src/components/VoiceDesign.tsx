import React, { useState } from 'react'
import type { AudioFormat, SynthesisResult } from '../types'
import { synthesizeVoiceDesign } from '../api/mimo'
import { AUDIO_FORMATS } from '../types'

interface Props {
  apiKey: string
  baseUrl: string
  onResult: (result: SynthesisResult) => void
}

const VoiceDesign: React.FC<Props> = ({ apiKey, baseUrl, onResult }) => {
  const [text, setText] = useState('')
  const [voiceDescription, setVoiceDescription] = useState('')
  const [format, setFormat] = useState<AudioFormat>('mp3')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSynthesize = async () => {
    if (!text.trim() || !voiceDescription.trim()) return
    setLoading(true)
    setError('')
    try {
      const result = await synthesizeVoiceDesign(baseUrl, apiKey, text.trim(), voiceDescription.trim(), format)
      onResult(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Synthesis failed')
    } finally {
      setLoading(false)
    }
  }

  const examples = [
    '温柔知性的女声，25岁左右，标准普通话，娓娓道来',
    '低沉浑厚的男声，40岁，带磁性，播音腔',
    '活泼可爱的少女音，语速稍快，元气满满',
    '慈祥温和的老人声音，语速稍慢，带点南方口音',
  ]

  return (
    <div className="synthesis-panel">
      <div className="form-group">
        <label className="form-label">音色描述 *</label>
        <p className="form-help">
          用自然语言描述你想要的声音：包括年龄、性别、口音、语气、语速等特征。
        </p>
        <textarea
          className="input textarea"
          value={voiceDescription}
          onChange={(e) => setVoiceDescription(e.target.value)}
          placeholder="例：温柔知性的女声，25岁左右，标准普通话，娓娓道来"
          rows={3}
          maxLength={500}
        />
        <span className="char-count">{voiceDescription.length}/500</span>
        <div className="style-tags">
          {examples.map((ex) => (
            <button key={ex} className="tag tag-example" onClick={() => setVoiceDescription(ex)}>
              {ex}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">合成文本 *</label>
        <textarea
          className="input textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="请输入要合成的文本内容..."
          rows={4}
          maxLength={2000}
        />
        <span className="char-count">{text.length}/2000</span>
      </div>

      <div className="form-group">
        <label className="form-label">音频格式</label>
        <div className="format-selector">
          {AUDIO_FORMATS.map((f) => (
            <button
              key={f.value}
              className={`btn btn-option ${format === f.value ? 'btn-option-active' : ''}`}
              onClick={() => setFormat(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <button
        className="btn btn-primary btn-lg btn-synthesize"
        onClick={handleSynthesize}
        disabled={!text.trim() || !voiceDescription.trim() || loading}
      >
        {loading ? <span className="spinner" /> : null}
        {loading ? '合成中...' : '合成语音'}
      </button>
    </div>
  )
}

export default VoiceDesign
