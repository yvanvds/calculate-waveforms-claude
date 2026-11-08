import { OperationPanel } from './OperationsBar.tsx';

interface NewEnvelopeOperationProps {
  /** De naam die de nieuwe envelope krijgt, zoals "E1". */
  nextName: string;
  onAdd: () => void;
}

/** Voegt een nieuwe envelope toe, met schuifjes voor attack, decay, sustain en release. */
export function NewEnvelopeOperation({ nextName, onAdd }: NewEnvelopeOperationProps) {
  return (
    <OperationPanel title="Envelope toevoegen">
      <p className="operations__hint">
        Maakt {nextName}: een volumeverloop dat je met schuifjes aanpast.
      </p>
      <button type="button" className="ai-btn ai-btn--secondary" onClick={onAdd}>
        Envelope toevoegen
      </button>
    </OperationPanel>
  );
}
