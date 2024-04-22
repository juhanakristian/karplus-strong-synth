import { Envelope } from "./types";
import { calculateEnvelope } from "./util";

const audioContext = new AudioContext();

class KarplusStrongNode extends AudioWorkletProcessor {
  frequency: number;
  n: number;
  buffer: Float32Array;
  constructor(frequency: number, sampleRate: number) {
    super();

    this.frequency = frequency;
    this.n = 0;

    const bufferSize = Math.round(sampleRate / frequency);
    const impulseLength = 0.001 * sampleRate;
    this.buffer = this.createBuffer(bufferSize, impulseLength);
  }
  process(inputs: Float32Array, outputs: Float32Array[], parameters: Record<string, Float32Array>) {

    const N = this.buffer.length;
    const output = outputs[0];
    for (let i = 0; i < output.length; i++) {
      output[i] = 0.5 * (this.buffer[this.n] + this.buffer[this.n + 1 % N]);

      this.n++;
      if (this.n >= N) this.n = 0;
    }

    return true;
  }

  createBuffer(size: number = 2048, delaySamples: number) {
    const buffer = new Float32Array(size);

    // Initialize the buffer with random noise
    for (let i = 0; i < delaySamples; i++) {
      buffer[i] = Math.random() * 2 - 1;
    }

    return buffer;
  }
}

class Pluck {
  context: AudioContext;
  gain: GainNode;
  decay: number;

  constructor(context: AudioContext) {
    this.context = context;

    this.gain = new GainNode(this.context);
    this.decay = 0.1;
  }


  play(frequency: number) {
    const node = new KarplusStrongNode(frequency, this.context.sampleRate);
    registerProcessor("karplus-strong", KarplusStrongNode)
  }

  setDecay(decay: number) {

  }
}

export function generateKarplusStrongNote(
  frequency: number,
  envelope: Envelope
): Float32Array {
  const duration = envelope.attack + envelope.release;

  const sampleRate = audioContext.sampleRate;
  const bufferSize = Math.ceil((duration / 1000) * sampleRate);
  const buffer = new Float32Array(bufferSize);
  const delay = Math.round(sampleRate / frequency);

  // Initialize the buffer with random noise
  for (let i = 0; i < bufferSize; i++) {
    buffer[i] = Math.random() * 2 - 1;
  }

  // Apply the Karplus-Strong algorithm
  for (let i = delay; i < bufferSize; i++) {
    buffer[i] = 0.5 * (buffer[i - delay] + buffer[i - delay + 1]);
  }

  const volumeBuffer = calculateEnvelope(envelope, 1, sampleRate);
  for (let i = 0; i < bufferSize; i++) {
    buffer[i] *= volumeBuffer[i];
  }

  return buffer;
}

export function playKarplusStrong(buffer: Float32Array) {
  // Create an AudioBuffer with the generated data
  const audioBuffer = audioContext.createBuffer(
    1,
    buffer.length,
    audioContext.sampleRate
  );

  const channelData = audioBuffer.getChannelData(0);
  channelData.set(buffer);

  // Create an AudioBufferSourceNode to play the AudioBuffer
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);

  // Start playing the note
  source.start();
}
