const DETENT_SECONDS = .016;
const PARTIALS = [[980, .0038, .5, 0], [1820, .0024, .3, .65], [3160, .00115, .12, 1.3]] as const;
type AudioConstructor = typeof AudioContext;
interface SoundResource { context: AudioContext; gain: GainNode; buffer: AudioBuffer }
let shared: SoundResource | undefined;
let leases = 0;
function synthesize(context: AudioContext) {
  const length = Math.ceil(context.sampleRate * DETENT_SECONDS);
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const samples = buffer.getChannelData(0);
  let maximum = 0;
  let prior = 0;
  for (let index = 0; index < length; index++) {
    const seconds = index / context.sampleRate;
    const envelope = Math.min(1, seconds / .00012) * Math.min(1, (DETENT_SECONDS - seconds) / .001);
    const noise = Math.random() * 2 - 1;
    let amplitude = (noise - prior) * Math.exp(-seconds / .00038) * .035;
    prior = noise;
    for (const [frequency, decay, gain, phase] of PARTIALS) amplitude += Math.sin(Math.PI * 2 * frequency * seconds + phase) * Math.exp(-seconds / decay) * gain;
    samples[index] = amplitude * envelope;
    maximum = Math.max(maximum, Math.abs(samples[index]));
  }
  if (maximum) for (let index = 0; index < length; index++) samples[index] *= .9 / maximum;
  return buffer;
}
function resource() {
  if (shared) return shared;
  if (typeof window === "undefined") return;
  const Constructor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioConstructor }).webkitAudioContext;
  if (!Constructor) return;
  const context = new Constructor();
  const gain = context.createGain();
  gain.gain.value = .055;
  gain.connect(context.destination);
  return shared = { context, gain, buffer: synthesize(context) };
}
interface TickPlayer { prepare: () => void; play: () => void; dispose: () => void }
export function createTickPlayer(): TickPlayer {
  leases++;
  let disposed = false;
  let active: AudioBufferSourceNode | undefined;
  function prepare() { if (disposed) return; const sound = resource(); if (sound?.context.state === "suspended") void sound.context.resume().catch(() => undefined); return sound; }
  function stop() { active?.stop(); active = undefined; }
  return {
    prepare() { prepare(); },
    play() { const sound = prepare(); if (!sound) return; stop(); const source = sound.context.createBufferSource(); source.buffer = sound.buffer; source.connect(sound.gain); source.onended = () => { source.disconnect(); if (active === source) active = undefined; }; active = source; source.start(); },
    dispose() { if (disposed) return; disposed = true; stop(); leases = Math.max(0, leases - 1); if (leases === 0 && shared) { const sound = shared; shared = undefined; void sound.context.close(); } },
  };
}
