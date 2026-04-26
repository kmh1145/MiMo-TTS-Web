import React, { useState } from 'react'
import { BASE_URLS, DEFAULT_BASE_URL } from '../types'

interface Props {
  apiKey: string
  baseUrl: string
  onSave: (key: string, baseUrl: string) => void
}

const ApiKeyInput: React.FC<Props> = ({ apiKey, baseUrl, onSave }) => {
  const [editing, setEditing] = useState(!apiKey)
  const [draft, setDraft] = useState(apiKey)
  const [draftUrl, setDraftUrl] = useState(baseUrl || DEFAULT_BASE_URL)

  const handleSave = () => {
    const trimmed = draft.trim()
    if (trimmed) {
      onSave(trimmed, draftUrl)
      setEditing(false)
    }
  }

  const handleClear = () => {
    setDraft('')
    onSave('', draftUrl)
    setEditing(true)
  }

  const selectedLabel = BASE_URLS.find((b) => b.value === baseUrl)?.label || ''

  if (!editing && apiKey) {
    return (
      <div className="apikey-display">
        <span className="apikey-key-group">
          <span className="apikey-label">API Key:</span>
          <span className="apikey-masked">{apiKey.slice(0, 4)}****{apiKey.slice(-4)}</span>
          <span className="apikey-plan-badge">{selectedLabel}</span>
        </span>
        <button className="btn btn-sm" onClick={() => setEditing(true)}>
          修改
        </button>
        <button className="btn btn-sm btn-danger" onClick={handleClear}>
          清除
        </button>
      </div>
    )
  }

  return (
    <div className="apikey-input">
      <div className="apikey-input-row">
        <input
          type="password"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="请输入 MiMo API Key"
          className="input apikey-field"
          autoFocus
        />
        <select
          className="input apikey-plan-select"
          value={draftUrl}
          onChange={(e) => setDraftUrl(e.target.value)}
        >
          {BASE_URLS.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label} ({b.description})
            </option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={handleSave} disabled={!draft.trim()}>
          保存
        </button>
      </div>
    </div>
  )
}

export default ApiKeyInput
