import { useId, useState, type FormEvent } from 'react';
import { OperationPanel } from './OperationsBar.tsx';
import { pickWave } from './pickWave.ts';
import { WaveSelect } from './WaveSelect.tsx';

interface EnvelopeOperationProps {
  /** Namen van de golven. */
  names: readonly string[];
  /** Namen van de envelopes. */
  envelopeNames: readonly string[];
  onApply: (wave: string, envelope: string) => void;
}

/** Vermenigvuldigt een golf met een envelope. */
export function EnvelopeOperation({ names, envelopeNames, onApply }: EnvelopeOperationProps) {
  const id = useId();
  const [chosenWave, setChosenWave] = useState('');
  const [chosenEnvelope, setChosenEnvelope] = useState('');
  const wave = pickWave(names, chosenWave);
  const envelope = pickWave(envelopeNames, chosenEnvelope);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (wave && envelope) onApply(wave, envelope);
  };

  return (
    <OperationPanel title="Golf vermenigvuldigen met een envelope">
      <form className="operations__form" onSubmit={submit}>
        <WaveSelect
          id={`${id}-wave`}
          label="Golf"
          names={names}
          value={wave}
          onChange={setChosenWave}
        />
        <WaveSelect
          id={`${id}-envelope`}
          label="Envelope"
          names={envelopeNames}
          value={envelope}
          onChange={setChosenEnvelope}
        />
        <button type="submit" className="ai-btn ai-btn--secondary" disabled={!wave || !envelope}>
          Pas envelope toe
        </button>
      </form>
      {envelopeNames.length === 0 && (
        <p className="operations__hint">Voeg eerst een envelope toe.</p>
      )}
    </OperationPanel>
  );
}
