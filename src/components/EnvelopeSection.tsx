import { Knob } from "react-ableton";
import { Envelope } from "../karplus/types";

type Props = {
  envelope: Envelope;
  onChange: (envelope: Envelope) => void;
};

export default function EnvelopeSection({ envelope, onChange }: Props) {
  function msFormatter(value: number) {
    return `${value.toFixed(0)}ms`;
  }

  return (
    <div className="flex">
      <Knob
        title="Attack"
        value={envelope.attack}
        range={[0, 1000]}
        formatter={msFormatter}
        onChange={(value) => onChange({ ...envelope, attack: value })}
      />
      <Knob
        title="Release"
        value={envelope.release}
        range={[0, 5000]}
        formatter={msFormatter}
        onChange={(value) => onChange({ ...envelope, release: value })}
      />
    </div>
  );
}
