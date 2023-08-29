import { Envelope } from "./types";

export function calculateEnvelope(
  envelope: Envelope,
  volume: number,
  sampleRate: number
) {
  const duration =
    envelope.attack + envelope.decay + envelope.sustain + envelope.release;

  const bufferSize = Math.ceil((duration / 1000) * sampleRate);

  const buffer = new Float32Array(bufferSize);
  for (let i = 0; i < bufferSize; i++) {
    if (i < (envelope.attack / 1000) * sampleRate) {
      buffer[i] = volume * (i / ((envelope.attack / 1000) * sampleRate));
    } else {
      buffer[i] = Math.random() * 2 - 1;
    }
  }

  return buffer;
}
