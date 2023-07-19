const audioContext = new AudioContext();

export function generateKarplusStrongNote(
  frequency: number,
  duration: number,
  volume: number
): Float32Array {
  const sampleRate = audioContext.sampleRate;
  const bufferSize = Math.ceil(duration * sampleRate);
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

  // Apply volume scaling
  for (let i = 0; i < bufferSize; i++) {
    buffer[i] *= volume;
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
