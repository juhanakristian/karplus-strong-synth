
class KarplusStrongProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [
            { name: 'damping', defaultValue: 0.5, minValue: 0, maxValue: 1 },
            { name: 'frequency', defaultValue: 440, minValue: 20, maxValue: 5000 }
        ];
    }


    n: number;
    buffer: Float32Array | null;
    constructor() {
        super();

        this.buffer = null;
        this.n = 0;

    }
    process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
        const frequency = parameters.frequency.length > 0 ? parameters.frequency[0] : 440;


        if (!this.buffer) {
            const bufferSize = Math.round(44100 / frequency);
            this.buffer = this.createBuffer(bufferSize);
        }

        const N = this.buffer.length;
        const gain = 0.995;
        const output = outputs[0][0];
        const impulse = Math.round(0.0001 * 44100);
        for (let i = 0; i < output.length; i++) {
            const sample = gain * (this.buffer[this.n] + this.buffer[(this.n + 1) % N]) / 2;

            output[i] = this.buffer[this.n];

            this.buffer[this.n] = sample;
            this.n = (this.n + 1) % N
        }

        return true;
    }

    createBuffer(size: number = 2048) {
        const buffer = new Float32Array(size);

        const impulse = Math.round(0.0001 * 44100);
        // Initialize the buffer with random noise
        for (let i = 0; i < size; i++) {
            buffer[i] = i < impulse ? Math.random() * 2 - 1 : 0;
        }

        return buffer;
    }
}

registerProcessor('karplus-strong-processor', KarplusStrongProcessor);