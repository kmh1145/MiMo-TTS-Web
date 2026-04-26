import type { AudioFormat, SynthesisResult } from '../types'

interface TTSRequest {
  model: string
  messages: { role: string; content: string }[]
  audio: {
    format: string
    voice?: string
  }
}

function buildMessages(text: string, context?: string): { role: string; content: string }[] {
  const messages: { role: string; content: string }[] = []
  if (context) {
    messages.push({ role: 'user', content: context })
  }
  messages.push({ role: 'assistant', content: text })
  return messages
}

async function callMimoAPI(
  baseUrl: string,
  apiKey: string,
  body: TTSRequest,
): Promise<SynthesisResult> {
  const url = `${baseUrl}/chat/completions`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    let message: string
    try {
      const errJson = JSON.parse(errorText)
      message = errJson.error?.message || errJson.message || errorText
    } catch {
      message = errorText
    }
    throw new Error(`API Error (${response.status}): ${message}`)
  }

  const data = await response.json()
  const audioData = data?.choices?.[0]?.message?.audio?.data
  if (!audioData) {
    throw new Error('No audio data in response')
  }

  return {
    audioData,
    format: data.choices[0].message.audio.format || body.audio.format,
  }
}

export async function synthesizePreset(
  baseUrl: string,
  apiKey: string,
  text: string,
  voice: string,
  format: AudioFormat,
  context?: string,
): Promise<SynthesisResult> {
  return callMimoAPI(baseUrl, apiKey, {
    model: 'mimo-v2.5-tts',
    messages: buildMessages(text, context),
    audio: { format, voice },
  })
}

export async function synthesizeVoiceDesign(
  baseUrl: string,
  apiKey: string,
  text: string,
  voiceDescription: string,
  format: AudioFormat,
): Promise<SynthesisResult> {
  return callMimoAPI(baseUrl, apiKey, {
    model: 'mimo-v2.5-tts-voicedesign',
    messages: buildMessages(text, voiceDescription),
    audio: { format },
  })
}

export async function synthesizeVoiceClone(
  baseUrl: string,
  apiKey: string,
  text: string,
  referenceAudio: string,
  format: AudioFormat,
  context?: string,
): Promise<SynthesisResult> {
  return callMimoAPI(baseUrl, apiKey, {
    model: 'mimo-v2.5-tts-voiceclone',
    messages: buildMessages(text, context),
    audio: { format, voice: referenceAudio },
  })
}
