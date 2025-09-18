//Configuración de sonidos para el juego
export const SOUNDS = {
  correct: "/sounds/correcta.mp3",
  wrong: "/sounds/Incorrecta.mp3",
  tension: "/sounds/Fondo.mp3",
  question: "/sounds/InicioPregunta.mp3",
}

export class SoundManager {
  private static instance: SoundManager;
  private sounds: { [key: string]: HTMLAudioElement | null } = {}
  private enabled = true

  private constructor() {
    if (typeof window !== 'undefined') {
      // Inicializar los sonidos
      Object.keys(SOUNDS).forEach(key => {
        this.sounds[key] = new Audio(SOUNDS[key as keyof typeof SOUNDS]);
        if (key === 'tension') {
          this.sounds[key]!.loop = true;
        }
      });
    }
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  playTension() {
    if (!this.enabled) return;
    const sound = this.sounds.tension;
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.log("Error playing tension sound:", e));
    }
  }

  stopTension() {
    const sound = this.sounds.tension;
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  playQuestion() {
    if (!this.enabled) return;
    const sound = this.sounds.question;
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.log("Error playing question sound:", e));
    }
  }

  playCorrect() {
    if (!this.enabled) return;
    this.stopTension(); // Detener la música de tensión
    const sound = this.sounds.correct;
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.log("Error playing correct sound:", e));
    }
  }

  playWrong() {
    if (!this.enabled) return;
    this.stopTension(); // Detener la música de tensión
    const sound = this.sounds.wrong;
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.log("Error playing wrong sound:", e));
    }
  }

  stopAll() {
    Object.values(this.sounds).forEach(sound => {
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
      }
    });
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
  }

  isEnabled() {
    return this.enabled;
  }
}

export const soundManager = SoundManager.getInstance();
