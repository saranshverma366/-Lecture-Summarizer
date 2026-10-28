export class SpeechReader {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;

  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public static speak(
    text: string,
    rate: number = 1.0,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    if (!this.synth) return;

    this.stop();

    // Clean markdown symbols for natural speech
    const cleanText = text
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/- /g, '')
      .replace(/>/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = Math.max(0.7, Math.min(rate, 2.0));
    utterance.pitch = 1.0;

    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Alex'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      onError?.(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public static pause() {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  public static resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public static stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public static isSpeaking(): boolean {
    return !!(this.synth && this.synth.speaking && !this.synth.paused);
  }

  public static isPaused(): boolean {
    return !!(this.synth && this.synth.paused);
  }
}
