import { useState } from "react";
import { Knob } from "react-ableton";
import { Envelope } from "../karplus/types";

type Props = {
  envelope: Envelope;
  onChange: (envelope: Envelope) => void;
};

export default function EnvelopeSection({ envelope, onChange }: Props) {
  function msFormatter(value: number) {
    return `${value}ms`;
  }

  return (
    <div className="flex">
      <Knob
        title="Attack"
        value={envelope.attack}
        range={[0, 500]}
        formatter={msFormatter}
        onChange={(value) => onChange({ ...envelope, attack: value })}
      />
      <Knob
        title="Decay"
        value={envelope.decay}
        range={[0, 500]}
        formatter={msFormatter}
        onChange={(value) => onChange({ ...envelope, decay: value })}
      />
      <Knob
        title="Sustain"
        value={envelope.sustain}
        range={[0, 500]}
        formatter={msFormatter}
        onChange={(value) => onChange({ ...envelope, sustain: value })}
      />
      <Knob
        title="Release"
        value={envelope.release}
        range={[0, 500]}
        formatter={msFormatter}
        onChange={(value) => onChange({ ...envelope, release: value })}
      />
    </div>
  );
}
