import React, { useState } from 'react'
import type { AudioFormat, SynthesisResult } from '../types'
import { synthesizePreset } from '../api/mimo'
import { PRESET_VOICES, AUDIO_FORMATS, STYLE_TAGS } from '../types'

interface Props {
  apiKey: string
  baseUrl: string
  onResult: (result: SynthesisResult) => void
}

const PresetVoice: React.FC<Props> = ({ apiKey, baseUrl, onResult }) => {
  const [text, setText] = useState('')
  const [voice, setVoice] = useState(PRESET_VOICES[0].id)
  const [format, setFormat] = useState<AudioFormat>('mp3')
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSynthesize = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError('')
    try {
      const result = await synthesizePreset(baseUrl, apiKey, text.trim(), voice, format, context.trim() || undefined)
      onResult(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Synthesis failed')
    } finally {
      setLoading(false)
    }
  }

  const insertStyleTag = (tag: string) => {
    setContext((prev) => {
      const trimmed = prev.trimEnd()
      return trimmed ? `${trimmed}、${tag}` : tag
    })
  }

  return (
    <div className="synthesis-panel">
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

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">预置音色</label>
          <select className="input" value={voice} onChange={(e) => setVoice(e.target.value)}>
            {PRESET_VOICES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} — {v.description}
              </option>
            ))}
          </select>
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
      </div>

      <div className="form-group">
        <label className="form-label">
          风格控制（可选）
          <span className="form-hint"> — 通过自然语言描述声音表现，或选择下方预设风格</span>
        </label>
        <input
          className="input"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="例：开心、温柔、粤语、变快..."
        />
        <div className="style-tags">
          {STYLE_TAGS.map((st) => (
            <button
              key={st.tag}
              className="tag"
              onClick={() => insertStyleTag(st.tag)}
              title={st.category}
            >
              {st.tag}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <button
        className="btn btn-primary btn-lg btn-synthesize"
        onClick={handleSynthesize}
        disabled={!text.trim() || loading}
      >
        {loading ? <span className="spinner" /> : null}
        {loading ? '合成中...' : '合成语音'}
      </button>
    </div>
  )
}

export default PresetVoice
