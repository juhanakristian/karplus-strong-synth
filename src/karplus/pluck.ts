
// @ts-ignore
import KarplusStringProcessorUrl from "./karplus-strong-processor?url"

export class Pluck {
  context: AudioContext;
  gain: GainNode;
  decay: number;

  constructor(context: AudioContext) {
    this.context = context;

    this.gain = new GainNode(this.context);
    this.decay = 0.1;

    this.context.audioWorklet.addModule(KarplusStringProcessorUrl);
  }


  play(frequency: number) {
    const node: AudioWorkletNode = new AudioWorkletNode(this.context, 'karplus-strong-processor');
    // @ts-ignore
    node.parameters.get('frequency')!.setValueAtTime(frequency, this.context.currentTime);
    node.parameters.get('sampleRate')!.setValueAtTime(this.context.sampleRate, this.context.currentTime);
    node.connect(this.context.destination);
  }

  setDecay(decay: number) {

  }
}
