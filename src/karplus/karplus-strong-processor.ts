
class KarplusStrongProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [
            { name: 'damping', defaultValue: 0.5, minValue: 0, maxValue: 1 },
            { name: 'frequency', defaultValue: 440, minValue: 20, maxValue: 5000 },
            { name: 'sampleRate', defaultValue: 44100 }
        ];
    }


    n: number;
    b: number;
    buffer: Float32Array | null;
    constructor() {
        super();

        this.buffer = null;
        this.n = 0;
        this.b = 0;

    }
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
        const frequency = parameters.frequency.length > 0 ? parameters.frequency[0] : 440;
        const sampleRate = parameters.sampleRate.length > 0 ? parameters.sampleRate[0] : 44100;


        if (!this.buffer) {
            const bufferSize = Math.round(sampleRate / frequency);
            this.buffer = new Float32Array(bufferSize);
        }

        const N = this.buffer.length;
        const gain = 0.995;
        const output = outputs[0][0];
        for (let i = 0; i < output.length; i++) {
            const noise = this.b < N ? Math.random() * 2 - 1 : 0;
            const sample = gain * (noise + (this.buffer[this.n] + this.buffer[(this.n + 1) % N])) / 2;

            output[i] = sample;

            this.buffer[this.n] = sample;
            this.n = (this.n + 1) % N
            this.b++;
        }

        return true;
    }
}

registerProcessor('karplus-strong-processor', KarplusStrongProcessor);