import { Knob } from "react-ableton";
import { Envelope } from "../karplus/types";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export default function Sequencer({ value, onChange }: Props) {
  function noteFormatter(value: number) {
    return `${value.toFixed(0)}`;
  }

  return (
    <div className="flex">
      <Knob
        title="Transpose"
        value={value}
        range={[0, 8]}
        formatter={noteFormatter}
        onChange={(value) => onChange(value)}
      />
    </div>
  );
}
