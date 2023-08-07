import { Knob } from "react-ableton";

export default function EnvelopeSection() {
  return (
    <div className="flex">
      <Knob title="Attack" value={0.5} onChange={() => {}} />
      <Knob title="Decay" value={0.5} onChange={() => {}} />
      <Knob title="Sustain" value={0.5} onChange={() => {}} />
      <Knob title="Release" value={0.5} onChange={() => {}} />
    </div>
  );
}
