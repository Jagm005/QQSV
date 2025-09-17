// Sound configuration for the millionaire game
// In a real implementation, you would use Howler.js to load and play these sounds

export const SOUNDS = {
  correct: "/sounds/correct.mp3",
  wrong: "/sounds/wrong.mp3",
  background: "/sounds/background.mp3",
  tick: "/sounds/tick.mp3",
  lifeline: "/sounds/lifeline.mp3",
}

export class SoundManager {
  private sounds: { [key: string]: any } = {}
  private enabled = true

  constructor() {
    // In a real implementation, initialize Howler.js here
    // this.loadSounds()
  }

  private loadSounds() {
    // Load all sound files using Howler.js
    // Example:
    // this.sounds.correct = new Howl({ src: [SOUNDS.correct] })
    // this.sounds.wrong = new Howl({ src: [SOUNDS.wrong] })
    // etc.
  }

  play(soundName: keyof typeof SOUNDS) {
    if (!this.enabled) return

    // In a real implementation:
    // if (this.sounds[soundName]) {
    //   this.sounds[soundName].play()
    // }

    console.log(`Playing sound: ${soundName}`)
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  isEnabled() {
    return this.enabled
  }
}

export const soundManager = new SoundManager()
