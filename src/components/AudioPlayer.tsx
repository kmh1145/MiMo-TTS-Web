import React from 'react'

interface Props {
  audioData: string
  format: string
  onClose: () => void
}

const AudioPlayer: React.FC<Props> = ({ audioData, format, onClose }) => {
  const mimeType = format === 'mp3' ? 'audio/mpeg' : 'audio/wav'
  const src = `data:${mimeType};base64,${audioData}`

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = src
    link.download = `mimo-tts-${Date.now()}.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="audio-player">
      <div className="audio-player-header">
        <span className="audio-format-badge">{format.toUpperCase()}</span>
        <div className="audio-player-actions">
          <button className="btn btn-primary" onClick={handleDownload}>
            下载音频
          </button>
          <button className="btn btn-sm" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
      <audio className="audio-element" controls src={src} />
    </div>
  )
}

export default AudioPlayer
