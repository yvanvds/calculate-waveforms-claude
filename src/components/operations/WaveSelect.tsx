interface WaveSelectProps {
  id: string;
  label: string;
  names: readonly string[];
  value: string;
  onChange: (name: string) => void;
}

/** Een keuzelijst met de namen van de golven. */
export function WaveSelect({ id, label, names, value, onChange }: WaveSelectProps) {
  return (
    <div className="ai-field">
      <label className="ai-field__label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="ai-input"
        value={value}
        disabled={names.length === 0}
        onChange={(event) => onChange(event.target.value)}
      >
        {names.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
