import type { ReactNode } from 'react';
import './OperationsBar.css';

/**
 * De balk met bewerkingen onder de golven.
 * Elke bewerking is een eigen onderdeel (een `OperationPanel`); een nieuwe bewerking voeg je
 * toe door er nog een in de balk te zetten.
 */
export function OperationsBar({ children }: { children: ReactNode }) {
  return (
    <section className="operations" aria-labelledby="operations-title">
      <h2 id="operations-title" className="h2 operations__title">
        Bewerkingen
      </h2>
      <div className="operations__grid">{children}</div>
    </section>
  );
}

interface OperationPanelProps {
  title: string;
  children: ReactNode;
}

/** Eén bewerking in de balk, met een titel. */
export function OperationPanel({ title, children }: OperationPanelProps) {
  return (
    <div className="ai-card operations__panel" role="group" aria-label={title}>
      <h3 className="ai-card__title operations__panel-title">{title}</h3>
      {children}
    </div>
  );
}
