import { useId, useState } from 'react';
import { WAVE_SHAPES, type WaveShape } from '../audio/index.ts';
import { SHAPE_LABELS, formatNumber } from '../workspace/labels.ts';
import { isValidFrequency, MAX_FREQUENCY, MIN_FREQUENCY } from '../workspace/workspace.ts';

interface WaveSettingsProps {
  name: string;
  frequency: number;
  shape: WaveShape;
  onChange: (frequency: number, shape: WaveShape) => void;
}

/** Frequentie en vorm kiezen voor een zelfgemaakte golf. */
export function WaveSettings({ name, frequency, shape, onChange }: WaveSettingsProps) {
  const id = useId();
  // Wat er in het veld staat, ook als het (nog) geen geldige frequentie is.
  const [text, setText] = useState(String(frequency));
  const parsed = Number(text.replace(',', '.'));
  const valid = text.trim() !== '' && isValidFrequency(parsed);

  return (
    <div className="wave-settings">
      <div className="ai-field">
        <label className="ai-field__label" htmlFor={`${id}-freq`}>
          Frequentie van {name} (Hz)
        </label>
        <input
          id={`${id}-freq`}
          className="ai-input"
          type="number"
          inputMode="decimal"
          min={MIN_FREQUENCY}
          max={MAX_FREQUENCY}
          step="any"
          value={text}
          aria-invalid={!valid}
          aria-describedby={valid ? undefined : `${id}-freq-error`}
          onChange={(event) => {
            const next = event.target.value;
            setText(next);
            const value = Number(next.replace(',', '.'));
            if (next.trim() !== '' && isValidFrequency(value)) onChange(value, shape);
          }}
        />
        {!valid && (
          <p id={`${id}-freq-error`} className="wave-settings__error">
            Kies een frequentie tussen {formatNumber(MIN_FREQUENCY)} en {formatNumber(MAX_FREQUENCY)} Hz.
          </p>
        )}
      </div>
      <div className="ai-field">
        <label className="ai-field__label" htmlFor={`${id}-shape`}>
          Vorm van {name}
        </label>
        <select
          id={`${id}-shape`}
          className="ai-input"
          value={shape}
          onChange={(event) => onChange(frequency, event.target.value as WaveShape)}
        >
          {WAVE_SHAPES.map((option) => (
            <option key={option} value={option}>
              {SHAPE_LABELS[option]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
