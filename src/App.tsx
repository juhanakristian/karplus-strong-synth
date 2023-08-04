import "./styles.css";

import React, { useState } from "react";

import { generateKarplusStrongNote, playKarplusStrong } from "./karplus/pluck";

import { InstrumentPanel, Knob } from "react-ableton/dist/index";

const MAX_FREQUENCY = 493.88;
const MIN_FREQUENCY = 261.63;

function pitchToFrequency(pitch: string) {
  const pitchMap: Record<string, number> = {
    C: 261.63,
    "C#": 277.18,
    Db: 277.18,
    D: 293.66,
    "D#": 311.13,
    Eb: 311.13,
    E: 329.63,
    F: 349.23,
    "F#": 369.99,
    Gb: 369.99,
    G: 392.0,
    "G#": 415.3,
    Ab: 415.3,
    A: 440.0,
    "A#": 466.16,
    Bb: 466.16,
    B: 493.88,
  };

  const note = pitch.charAt(0).toUpperCase();
  const octave = parseInt(pitch.charAt(pitch.length - 1));
  const accidental = pitch.slice(1, -1);

  let frequency = pitchMap[note];
  if (accidental === "#") {
    frequency *= Math.pow(2, 1 / 12);
  } else if (accidental === "b") {
    frequency /= Math.pow(2, 1 / 12);
  }

  return frequency * Math.pow(2, octave - 4);
}

function scalarToFrequency(scalar: number) {
  return scalar * (MAX_FREQUENCY - MIN_FREQUENCY) + MIN_FREQUENCY;
}

const Synthesizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequencyValue, setFrequencyValue] = useState(0.5);

  const handlePlayNote = () => {
    // Convert the pitch to frequency
    const frequency = scalarToFrequency(frequencyValue);

    // Generate the Karplus-Strong note
    const duration = 2; // Change this to desired duration
    const volume = 0.5; // Change this to desired volume
    const buffer = generateKarplusStrongNote(frequency, duration, volume);

    // Play the note
    playKarplusStrong(buffer);
    setIsPlaying(true);
  };

  return (
    <div>
      <InstrumentPanel title="Karplus-Strong Synthesizer">
        <Knob
          title="Frequency"
          value={frequencyValue}
          onChange={setFrequencyValue}
        />
        <br />
        <button onClick={handlePlayNote}>
          {isPlaying ? "Playing..." : "Play Note"}
        </button>
      </InstrumentPanel>
    </div>
  );
};

export default function App() {
  return (
    <div className="App">
      <Synthesizer />
    </div>
  );
}
