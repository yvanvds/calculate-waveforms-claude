import { OperationPanel } from './OperationsBar.tsx';

interface NewWaveOperationProps {
  /** De naam die de nieuwe golf krijgt, zoals "W2". */
  nextName: string;
  onAdd: () => void;
}

/** Voegt een nieuwe golf toe: standaard een sinus van 440 Hz. */
export function NewWaveOperation({ nextName, onAdd }: NewWaveOperationProps) {
  return (
    <OperationPanel title="Nieuwe golf">
      <p className="operations__hint">
        Maakt {nextName}: een sinus van 440 Hz die je daarna kan aanpassen.
      </p>
      <button type="button" className="ai-btn ai-btn--secondary" onClick={onAdd}>
        Nieuwe golf
      </button>
    </OperationPanel>
  );
}
