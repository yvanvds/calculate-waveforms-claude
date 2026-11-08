import { useId, useState, type FormEvent } from 'react';
import { OperationPanel } from './OperationsBar.tsx';
import { pickWave } from './pickWave.ts';
import { WaveSelect } from './WaveSelect.tsx';

interface SumOperationProps {
  names: readonly string[];
  onSum: (first: string, second: string) => void;
}

/** Telt twee golven op. */
export function SumOperation({ names, onSum }: SumOperationProps) {
  const id = useId();
  const [chosenFirst, setChosenFirst] = useState('');
  const [chosenSecond, setChosenSecond] = useState('');
  const first = pickWave(names, chosenFirst, 0);
  const second = pickWave(names, chosenSecond, 1);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (first && second) onSum(first, second);
  };

  return (
    <OperationPanel title="Twee golven optellen">
      <form className="operations__form" onSubmit={submit}>
        <WaveSelect
          id={`${id}-first`}
          label="Eerste golf"
          names={names}
          value={first}
          onChange={setChosenFirst}
        />
        <WaveSelect
          id={`${id}-second`}
          label="Tweede golf"
          names={names}
          value={second}
          onChange={setChosenSecond}
        />
        <button type="submit" className="ai-btn ai-btn--secondary" disabled={!first || !second}>
          Tel op
        </button>
      </form>
    </OperationPanel>
  );
}
