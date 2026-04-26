import React, { useState, useRef } from 'react'
import type { AudioFormat, SynthesisResult } from '../types'
import { synthesizeVoiceClone } from '../api/mimo'
import { AUDIO_FORMATS, STYLE_TAGS } from '../types'

interface Props {
  apiKey: string
  baseUrl: string
  onResult: (result: SynthesisResult) => void
}

const VoiceClone: React.FC<Props> = ({ apiKey, baseUrl, onResult }) => {
  const [text, setText] = useState('')
  const [format, setFormat] = useState<AudioFormat>('mp3')
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [refAudio, setRefAudio] = useState<{ name: string; dataUrl: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      setError('参考音频文件大小不能超过 10MB')
      return
    }

    const mimeType = file.type
    if (mimeType !== 'audio/mpeg' && mimeType !== 'audio/wav' && mimeType !== 'audio/x-wav') {
      setError('仅支持 MP3 和 WAV 格式的音频文件')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      const mime = mimeType === 'audio/x-wav' ? 'audio/wav' : mimeType
      setRefAudio({
        name: file.name,
        dataUrl: `data:${mime};base64,${base64}`,
      })
      setError('')
    }
    reader.onerror = () => setError('文件读取失败')
    reader.readAsDataURL(file)
  }

  const handleSynthesize = async () => {
    if (!text.trim() || !refAudio) return
    setLoading(true)
    setError('')
    try {
      const result = await synthesizeVoiceClone(
        baseUrl,
        apiKey,
        text.trim(),
        refAudio.dataUrl,
        format,
        context.trim() || undefined,
      )
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
        <label className="form-label">参考音频 *</label>
        <p className="form-help">
          上传一段数秒的真人语音作为音色参考（支持 MP3、WAV 格式，最大 10MB）。
          系统将复刻该声音的音色特征进行合成。
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="audio/mpeg,audio/wav"
          onChange={handleFileChange}
          className="file-input-hidden"
        />
        <div className="file-upload-area" onClick={() => fileRef.current?.click()}>
          {refAudio ? (
            <div className="file-selected">
              <span className="file-icon">🎵</span>
              <span className="file-name">{refAudio.name}</span>
              <button
                className="btn btn-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setRefAudio(null)
                  if (fileRef.current) fileRef.current.value = ''
                }}
              >
                重新选择
              </button>
            </div>
          ) : (
            <div className="file-placeholder">
              <span className="file-upload-icon">+</span>
              <span>点击选择参考音频文件</span>
            </div>
          )}
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

      <div className="form-row">
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
          <span className="form-hint"> — 对克隆后的声音进行语气、情绪等方面的微调</span>
        </label>
        <input
          className="input"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="例：温柔、语速稍慢..."
        />
        <div className="style-tags">
          {STYLE_TAGS.slice(0, 7).map((st) => (
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
        disabled={!text.trim() || !refAudio || loading}
      >
        {loading ? <span className="spinner" /> : null}
        {loading ? '合成中...' : '合成语音'}
      </button>
    </div>
  )
}

export default VoiceClone
