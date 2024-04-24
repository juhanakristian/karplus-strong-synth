import "./index.css";

import React from "react";
import { useState } from "react";

import {Pluck} from "./karplus/pluck";

import {DevicePanel, Knob, RoundedButton, Keyboard, ToggleButton} from "react-ableton";

import EnvelopeSection from "./components/EnvelopeSection";
import Sequencer from "./components/Sequencer";

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

function midiToFrequency(note: number) {
  return Math.pow(2, (note - 69) / 12) * 440;
}

let audioContext : AudioContext | null = null;
let pluck: Pluck | null = null;

const Synthesizer = () => {
  const [frequencyValue, setFrequencyValue] = useState(0.5);
  const [note, setNote] = useState(0);
  const [onOff, setOnOff] = React.useState(false);
  const [envelope, setEnvelope] = useState({
    attack: 0,
    decay: 0,
    sustain: 0,
    release: 0,
  });

  async function handleKeyDown(key: number) {
    // Convert the pitch to frequency
    const frequency = midiToFrequency(key);
    if (!pluck) return;

    pluck.play(frequency);
  }

  async function handleOnOff() {
    if (!audioContext || !pluck) {
      audioContext = new AudioContext();
      pluck = new Pluck(audioContext);
    }

    setOnOff(!onOff);
  }

  return (
    <div >
      <DevicePanel title="Karplus-Strong Synthesizer">
        <ToggleButton state={onOff} onClick={handleOnOff} >On/Off</ToggleButton>
        <EnvelopeSection envelope={envelope} onChange={setEnvelope} />
        <div className="pt-1">
          <Keyboard onKeyDown={handleKeyDown}/>
        </div>
      </DevicePanel>
    </div>
  );
};

export default function App() {
  return (
    <div className="flex flex-col items-center pt-20">
      <Synthesizer />
    </div>
  );
}
