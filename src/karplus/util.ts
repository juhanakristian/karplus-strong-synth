import { Envelope } from "./types";

export function calculateEnvelope(
  envelope: Envelope,
  volume: number,
  sampleRate: number
) {
  const duration = envelope.attack + envelope.release;

  const bufferSize = Math.ceil((duration / 1000) * sampleRate);
  const buffer = new Float32Array(bufferSize);

  const attackIncrement = volume / ((envelope.attack / 1000) * sampleRate);
  const attackTime = (envelope.attack / 1000) * sampleRate;

  // const sustainLevel = envelope.sustain / 100 * volume;
  // const decayTime = ((envelope.decay / 1000) * sampleRate)
  // const decayDecrement = (volume - sustainLevel) / decayTime;

  // const sustainTime = ((envelope.sustain / 1000) * sampleRate);
  const releaseTime = (envelope.release / 1000) * sampleRate;
  const releaseDecrement = volume / releaseTime;

  let volumeLevel = 0;
  for (let i = 0; i < bufferSize; i++) {
    if (i < attackTime) {
      volumeLevel += attackIncrement;
      buffer[i] = volumeLevel;
    } else {
      volumeLevel -= releaseDecrement;
      buffer[i] = volumeLevel;
    }
  }

  return buffer;
}
