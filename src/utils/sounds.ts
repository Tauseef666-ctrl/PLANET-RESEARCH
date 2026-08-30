type SoundType = 'click' | 'hover' | 'navigate' | 'select' | 'search' | 'notification'

class SoundManager {
  private ctx: AudioContext | null = null
  private enabled: boolean = true
  private initialized = false

  init() {
    if (this.initialized) return
    try {
      const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtor()
      this.initialized = true
    } catch {
      console.warn('Web Audio API not available')
    }
  }

  play(type: SoundType) {
    if (!this.enabled || !this.ctx) return
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    switch (type) {
      case 'click':
        this.playClick()
        break
      case 'hover':
        this.playHover()
        break
      case 'navigate':
        this.playNavigate()
        break
      case 'select':
        this.playSelect()
        break
      case 'search':
        this.playSearch()
        break
      case 'notification':
        this.playNotification()
        break
    }
  }

  private playClick() {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.05)
    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
    osc.connect(gain).connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.05)
  }

  private playHover() {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1200, now)
    gain.gain.setValueAtTime(0.03, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)
    osc.connect(gain).connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.03)
  }

  private playNavigate() {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, now)
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.2)
    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
    osc.connect(gain).connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.2)
  }

  private playSelect() {
    if (!this.ctx) return
    const now = this.ctx.currentTime

    const osc1 = this.ctx.createOscillator()
    const gain1 = this.ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(600, now)
    gain1.gain.setValueAtTime(0.1, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
    osc1.connect(gain1).connect(this.ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.15)

    const osc2 = this.ctx.createOscillator()
    const gain2 = this.ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(900, now + 0.06)
    gain2.gain.setValueAtTime(0, now)
    gain2.gain.setValueAtTime(0.1, now + 0.06)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
    osc2.connect(gain2).connect(this.ctx.destination)
    osc2.start(now + 0.06)
    osc2.stop(now + 0.15)
  }

  private playSearch() {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1000, now)
    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
    osc.connect(gain).connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.04)
  }

  private playNotification() {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const notes = [523, 659, 784]
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      osc.type = 'sine'
      const start = now + i * 0.12
      osc.frequency.setValueAtTime(freq, start)
      gain.gain.setValueAtTime(0, now)
      gain.gain.setValueAtTime(0.1, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2)
      osc.connect(gain).connect(this.ctx!.destination)
      osc.start(start)
      osc.stop(start + 0.2)
    })
  }

  setEnabled(v: boolean) {
    this.enabled = v
  }

  isEnabled() {
    return this.enabled
  }
}

export const sounds = new SoundManager()
