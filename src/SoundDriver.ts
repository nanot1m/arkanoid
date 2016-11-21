export class SoundDriver {
  private static audio: AudioContext =
    new (window['AudioContext'] || window['webkitAudioContext'])()

  static play(key: number) {
    let oscillator = SoundDriver.audio.createOscillator();
    oscillator.connect(SoundDriver.audio.destination);
    oscillator.type = 'sine';
    oscillator.frequency.value = Math.pow(2, (key - 49) / 12) * 440;
    oscillator.start();
    oscillator.stop(SoundDriver.audio.currentTime + 0.100);
  }
}
