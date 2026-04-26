export interface SynthesisRequest {
  text: string
  format: AudioFormat
  context?: string
  voice?: string
  voiceDescription?: string
  referenceAudio?: string
}

export type AudioFormat = 'wav' | 'mp3'

export interface SynthesisResult {
  audioData: string
  format: string
}

export interface VoiceOption {
  id: string
  name: string
  description: string
}

export const PRESET_VOICES: VoiceOption[] = [
  { id: '冰糖', name: '冰糖', description: '甜美女声' },
  { id: '茉莉', name: '茉莉', description: '清新女声' },
  { id: '苏打', name: '苏打', description: '活泼男声' },
  { id: '白桦', name: '白桦', description: '沉稳男声' },
  { id: 'Mia', name: 'Mia', description: 'English female' },
  { id: 'Chloe', name: 'Chloe', description: 'English female' },
  { id: 'Milo', name: 'Milo', description: 'English male' },
  { id: 'Dean', name: 'Dean', description: 'English male' },
]

export const AUDIO_FORMATS: { value: AudioFormat; label: string }[] = [
  { value: 'mp3', label: 'MP3' },
  { value: 'wav', label: 'WAV' },
]

export const STYLE_TAGS = [
  { tag: '开心', category: '情绪' },
  { tag: '悲伤', category: '情绪' },
  { tag: '生气', category: '情绪' },
  { tag: '变快', category: '语速' },
  { tag: '变慢', category: '语速' },
  { tag: '悄悄话', category: '风格' },
  { tag: '夹子音', category: '风格' },
  { tag: '台湾腔', category: '风格' },
  { tag: '东北话', category: '方言' },
  { tag: '四川话', category: '方言' },
  { tag: '河南话', category: '方言' },
  { tag: '粤语', category: '方言' },
  { tag: '孙悟空', category: '角色' },
  { tag: '林黛玉', category: '角色' },
  { tag: '唱歌', category: '特殊' },
]

export type SynthesisMode = 'preset' | 'design' | 'clone'

export interface BaseUrlOption {
  value: string
  label: string
  description: string
}

export const BASE_URLS: BaseUrlOption[] = [
  {
    value: 'https://api.xiaomimimo.com/v1',
    label: '按量付费',
    description: 'api.xiaomimimo.com',
  },
  {
    value: 'https://token-plan-cn.xiaomimimo.com/v1',
    label: 'Token Plan',
    description: 'token-plan-cn.xiaomimimo.com',
  },
]

export const DEFAULT_BASE_URL = BASE_URLS[0].value
