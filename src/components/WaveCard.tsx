import { useState, type ReactNode } from 'react';
import { isOutOfRange, peakOf, type Samples } from '../audio/index.ts';
import { playWave, stopPlayback } from '../playback/player.ts';
import { formatNumber } from '../workspace/labels.ts';
import { WaveChart } from './WaveChart.tsx';
import './WaveCard.css';

interface WaveCardProps {
  name: string;
  /** Korte beschrijving, zoals "Sinus, 440 Hz" of "W1 + W2". */
  description: string;
  samples: Samples;
  /** Instellingen die je kan aanpassen, alleen bij een zelfgemaakte golf. */
  settings?: ReactNode;
  onRemove: () => void;
}

/** Kaart van één golf: naam, beschrijving, grafiek, afspelen en verwijderen. */
export function WaveCard({ name, description, samples, settings, onRemove }: WaveCardProps) {
  const [playing, setPlaying] = useState(false);
  const [playError, setPlayError] = useState(false);
  const outOfRange = isOutOfRange(samples);

  const play = () => {
    setPlaying(true);
    setPlayError(false);
    playWave(samples)
      .catch(() => setPlayError(true))
      .finally(() => setPlaying(false));
  };

  return (
    <article className="ai-card wave-card" aria-label={`Golf ${name}`}>
      <div className="ai-card__top">
        <h2 className="ai-card__title">{name}</h2>
        <span className="ai-tag">{description}</span>
      </div>

      {settings}

      {outOfRange && (
        <div className="ai-callout ai-callout--warning" role="status">
          <svg className="ai-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3 2 21h20L12 3z" />
            <path d="M12 10v5M12 18h.01" />
          </svg>
          <div>
            <p className="ai-callout__title">Buiten het bereik -1 tot 1</p>
            <p className="wave-card__note">
              Deze golf gaat tot {formatNumber(peakOf(samples), 2)}. Bij het afspelen klinkt ze niet
              harder dan een golf tot 1.
            </p>
          </div>
        </div>
      )}

      <WaveChart name={name} samples={samples} />

      <div className="ai-row wave-card__actions">
        {playing ? (
          <button type="button" className="ai-btn ai-btn--primary" onClick={stopPlayback}>
            Stop {name}
          </button>
        ) : (
          <button type="button" className="ai-btn ai-btn--primary" onClick={play}>
            Speel {name} af
          </button>
        )}
        <button type="button" className="ai-btn ai-btn--ghost" onClick={onRemove}>
          Verwijder {name}
        </button>
      </div>
      {playing && (
        <p className="wave-card__note" role="status">
          Hoor je niets? Kijk of dit tabblad, de browser of je computer niet op stil staat. Helpt
          dat niet, sluit de browser dan helemaal af en start hem opnieuw.
        </p>
      )}
      {playError && (
        <div className="ai-callout ai-callout--warning" role="alert">
          <svg className="ai-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11 5 6 9H2v6h4l5 4V5z" />
            <path d="m22 9-6 6M16 9l6 6" />
          </svg>
          <div>
            <p className="ai-callout__title">Afspelen lukte niet</p>
            <p className="wave-card__note">
              De browser houdt het geluid tegen. Klik nog eens op Speel {name} af, of kijk of geluid
              toegestaan is voor deze site.
            </p>
          </div>
        </div>
      )}
    </article>
  );
}
