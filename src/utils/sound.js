export const playAlertSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    // "Fast Whoop" / Digital Piezo Siren
    // Genuine, distinct electronic emergency sound.
    // LOUD and CLEAR.

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle'; // Piercing but clean
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Volume
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.linearRampToValueAtTime(0, now + 4.0);
    
    // The "Whoop" Modulation
    // We want a rapid sweep from ~600Hz to ~1500Hz, repeating ~4 times a second
    
    const lfo = ctx.createOscillator();
    lfo.type = 'sawtooth'; // Ramps up
    lfo.frequency.value = 4; // 4 "Whoops" per second
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 800; // Modulate by +/- 800Hz range
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    
    osc.frequency.setValueAtTime(1000, now); // Base frequency
    
    lfo.start(now);
    osc.start(now);
    
    lfo.stop(now + 4.0);
    osc.stop(now + 4.0);

  } catch (e) {
    console.error("Audio play failed", e);
  }
};
