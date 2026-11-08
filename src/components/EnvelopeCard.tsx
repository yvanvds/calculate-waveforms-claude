import { useId } from 'react';
import { DURATION, ENVELOPE_PRESETS, type AdsrSettings, type Samples } from '../audio/index.ts';
import { formatNumber } from '../workspace/labels.ts';
import { MAX_ADSR_TIME } from '../workspace/workspace.ts';
import { WaveChart } from './WaveChart.tsx';
import './WaveCard.css';

interface EnvelopeCardProps {
  name: string;
  settings: AdsrSettings;
  samples: Samples;
  onChange: (settings: AdsrSettings) => void;
  onRemove: () => void;
}

interface SliderSpec {
  key: keyof AdsrSettings;
  label: string;
  max: number;
  unit: string;
}

const SLIDERS: readonly SliderSpec[] = [
  { key: 'attack', label: 'Attack', max: MAX_ADSR_TIME, unit: ' s' },
  { key: 'decay', label: 'Decay', max: MAX_ADSR_TIME, unit: ' s' },
  { key: 'sustain', label: 'Sustain', max: 1, unit: '' },
  { key: 'release', label: 'Release', max: MAX_ADSR_TIME, unit: ' s' },
];

/** Of twee instellingen gelijk zijn, om de gekozen voorbeeldinstelling aan te duiden. */
function sameSettings(a: AdsrSettings, b: AdsrSettings): boolean {
  return (
    a.attack === b.attack && a.decay === b.decay && a.sustain === b.sustain && a.release === b.release
  );
}

/**
 * Kaart van één envelope: vier schuifjes, voorbeeldinstellingen, een grafiek en verwijderen.
 * Een envelope is een volumeverloop, geen geluid, dus je kan ze niet afspelen.
 */
export function EnvelopeCard({ name, settings, samples, onChange, onRemove }: EnvelopeCardProps) {
  const id = useId();
  const tooLong = settings.attack + settings.decay + settings.release > DURATION;

  return (
    <article className="ai-card wave-card" aria-label={`Envelope ${name}`}>
      <div className="ai-card__top">
        <h2 className="ai-card__title">{name}</h2>
        <span className="ai-tag">Envelope</span>
      </div>

      <div className="envelope-presets" role="group" aria-label={`Voorbeeldinstellingen voor ${name}`}>
        {ENVELOPE_PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            className="ai-btn ai-btn--secondary ai-btn--sm"
            aria-pressed={sameSettings(settings, preset.settings)}
            onClick={() => onChange({ ...preset.settings })}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="envelope-sliders">
        {SLIDERS.map(({ key, label, max, unit }) => (
          <div className="ai-field" key={key}>
            <label className="ai-field__label" htmlFor={`${id}-${key}`}>
              {label} van {name}
            </label>
            <div className="envelope-slider">
              <input
                id={`${id}-${key}`}
                className="envelope-slider__input"
                type="range"
                min={0}
                max={max}
                step={0.001}
                value={settings[key]}
                onChange={(event) => onChange({ ...settings, [key]: Number(event.target.value) })}
              />
              <output className="envelope-slider__value" htmlFor={`${id}-${key}`}>
                {formatNumber(settings[key], 3)}
                {unit}
              </output>
            </div>
          </div>
        ))}
      </div>

      {tooLong && (
        <p className="wave-card__note">
          Attack, decay en release duren samen langer dan 2 seconden. In de grafiek worden ze
          evenredig ingekort.
        </p>
      )}

      <WaveChart name={name} samples={samples} variant="envelope" />

      <p className="wave-card__note">
        Een envelope is een volumeverloop, geen geluid. Vermenigvuldig er een golf mee om het te
        horen.
      </p>

      <div className="ai-row wave-card__actions">
        <button type="button" className="ai-btn ai-btn--ghost" onClick={onRemove}>
          Verwijder {name}
        </button>
      </div>
    </article>
  );
}
