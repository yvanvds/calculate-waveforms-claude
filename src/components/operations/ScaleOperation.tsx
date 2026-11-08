import { useId, useState, type FormEvent } from 'react';
import { parseDecimal } from '../../workspace/labels.ts';
import { OperationPanel } from './OperationsBar.tsx';
import { pickWave } from './pickWave.ts';
import { WaveSelect } from './WaveSelect.tsx';

interface ScaleOperationProps {
  names: readonly string[];
  onScale: (name: string, factor: number) => void;
}

/** Vermenigvuldigt een golf met een decimaal getal, zoals 0,5 of -2. */
export function ScaleOperation({ names, onScale }: ScaleOperationProps) {
  const id = useId();
  const [chosen, setChosen] = useState('');
  const [text, setText] = useState('0,5');
  const [error, setError] = useState(false);
  const wave = pickWave(names, chosen);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const factor = parseDecimal(text);
    if (factor === null) {
      setError(true);
      return;
    }
    setError(false);
    if (wave) onScale(wave, factor);
  };

  return (
    <OperationPanel title="Golf vermenigvuldigen met een getal">
      <form className="operations__form" onSubmit={submit} noValidate>
        <WaveSelect
          id={`${id}-wave`}
          label="Golf om te vermenigvuldigen"
          names={names}
          value={wave}
          onChange={setChosen}
        />
        <div className="ai-field">
          <label className="ai-field__label" htmlFor={`${id}-factor`}>
            Getal
          </label>
          <input
            id={`${id}-factor`}
            className="ai-input"
            type="text"
            inputMode="decimal"
            value={text}
            aria-invalid={error}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(event) => {
              setText(event.target.value);
              setError(false);
            }}
          />
          {error && (
            <p id={`${id}-error`} className="operations__error" role="alert">
              Vul een getal in, bijvoorbeeld 0,5 of -2.
            </p>
          )}
        </div>
        <button type="submit" className="ai-btn ai-btn--secondary" disabled={!wave}>
          Vermenigvuldig
        </button>
      </form>
    </OperationPanel>
  );
}
