import React from 'react'
import type { SynthesisMode } from '../types'

interface Props {
  active: SynthesisMode
  onChange: (mode: SynthesisMode) => void
}

const tabs: { mode: SynthesisMode; label: string; desc: string }[] = [
  { mode: 'preset', label: '预设音色', desc: '选用内置精品音色' },
  { mode: 'design', label: '音色设计', desc: '用文字描述创造新音色' },
  { mode: 'clone', label: '音色复刻', desc: '上传音频克隆真人音色' },
]

const TabBar: React.FC<Props> = ({ active, onChange }) => (
  <div className="tab-bar">
    {tabs.map((t) => (
      <button
        key={t.mode}
        className={`tab ${active === t.mode ? 'tab-active' : ''}`}
        onClick={() => onChange(t.mode)}
      >
        <span className="tab-label">{t.label}</span>
        <span className="tab-desc">{t.desc}</span>
      </button>
    ))}
  </div>
)

export default TabBar
