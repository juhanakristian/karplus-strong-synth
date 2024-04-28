import "./index.css";

import React from "react";
import { useState } from "react";

import {Pluck} from "./karplus/pluck";

import {DevicePanel, Knob, RoundedButton, Keyboard, ToggleButton, Dropdown, DropdownItem} from "react-ableton";

import EnvelopeSection from "./components/EnvelopeSection";
import Sequencer from "./components/Sequencer";
import {NoteMessageEvent, WebMidi} from "webmidi";

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
  const [midiInput, setMidiInput] = React.useState("")

  function handleMidiEnabled() {
    if (WebMidi.inputs.length === 0) console.log("No midi inputs")

    for (const input of WebMidi.inputs) {
      console.log(input.name)
    }
  }

  React.useEffect(() => {
    WebMidi.enable()
        .then(handleMidiEnabled)
        .catch(e => console.log(e))
  }, [])

  function handleNoteOn(event: NoteMessageEvent) {
    if (!pluck) return;
    // Convert the pitch to frequency
    const frequency = midiToFrequency(event.note.number);
    pluck.play(frequency);

  }

  React.useEffect(() => {
    const input = WebMidi.inputs.find(i => i.id == midiInput)
    if (!input) return;
    input.channels[1].addListener("noteon", handleNoteOn)
  }, [midiInput])

  async function handleKeyDown(key: number) {
    if (!pluck) return;
    // Convert the pitch to frequency
    const frequency = midiToFrequency(key);
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
        <div>
        {WebMidi.enabled && (
            <Dropdown value={midiInput} onChange={(v) => setMidiInput(v)}>
              <DropdownItem value="">Choose Midi input</DropdownItem>
              {WebMidi.inputs.map(input =>
                  <DropdownItem key={input.id} value={input.id}>{input.name}</DropdownItem>
              )}
            </Dropdown>
        )}
        </div>
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
