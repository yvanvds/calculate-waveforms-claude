import { useEffect, useRef, useState } from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import { SAMPLE_COUNT, timeOf, type Samples } from '../audio/index.ts';
import { FULL_RANGE, isFullRange, panRange, zoomRange, type TimeRange } from '../chart/zoom.ts';
import { formatNumber } from '../workspace/labels.ts';
import './WaveChart.css';

const HEIGHT = 240;

let times: Float64Array | null = null;
/** De tijd van elke sample, voor alle golven dezelfde. */
function sampleTimes(): Float64Array {
  if (!times) {
    times = new Float64Array(SAMPLE_COUNT);
    for (let i = 0; i < SAMPLE_COUNT; i++) times[i] = timeOf(i);
  }
  return times;
}

/** Leest een kleur uit de tokens van het design system. */
function token(name: string): string {
  return getComputedStyle(document.body).getPropertyValue(`--${name}`).trim();
}

interface WaveChartProps {
  /** Naam van de golf, voor schermlezers. */
  name: string;
  samples: Samples;
}

/** Grafiek van een golf. Inzoomen kan door te slepen of met de knoppen eronder. */
export function WaveChart({ name, samples }: WaveChartProps) {
  const holderRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<uPlot | null>(null);
  const rangeRef = useRef<TimeRange>(FULL_RANGE);
  const [range, setRange] = useState<TimeRange>(FULL_RANGE);

  // De grafiek één keer aanmaken; nieuwe samples komen via setData hieronder.
  useEffect(() => {
    const holder = holderRef.current;
    if (!holder) return;

    const muted = token('ink-muted');
    const line = token('line');
    const axis = { stroke: muted, grid: { stroke: line, width: 1 }, ticks: { stroke: line, width: 1 } };

    const plot = new uPlot(
      {
        width: Math.max(holder.clientWidth, 200),
        height: HEIGHT,
        legend: { show: false },
        cursor: { drag: { x: true, y: false } },
        scales: {
          x: { time: false, auto: false },
          y: {
            // Altijd minstens -1 tot 1 tonen, en meer als de golf verder gaat.
            range: (_u, min, max) => [Math.min(-1, min) * 1.1, Math.max(1, max) * 1.1],
          },
        },
        axes: [
          { ...axis, label: 'Tijd (s)', values: (_u, ticks) => ticks.map((t) => formatNumber(t)) },
          { ...axis, label: 'Waarde', values: (_u, ticks) => ticks.map((t) => formatNumber(t)) },
        ],
        series: [{}, { label: name, stroke: token('brand-text'), width: 1.5, points: { show: false } }],
        hooks: {
          setScale: [
            (u, key) => {
              if (key !== 'x') return;
              const next = { min: u.scales.x.min ?? 0, max: u.scales.x.max ?? FULL_RANGE.max };
              rangeRef.current = next;
              setRange(next);
            },
          ],
        },
      },
      [sampleTimes(), new Float32Array(SAMPLE_COUNT)],
      holder,
    );
    plotRef.current = plot;

    const observer = new ResizeObserver(() => {
      plot.setSize({ width: Math.max(holder.clientWidth, 200), height: HEIGHT });
    });
    observer.observe(holder);

    return () => {
      observer.disconnect();
      plot.destroy();
      plotRef.current = null;
    };
  }, [name]);

  useEffect(() => {
    const plot = plotRef.current;
    if (!plot) return;
    const keep = rangeRef.current;
    plot.setData([sampleTimes(), samples]);
    plot.setScale('x', keep);
  }, [samples, name]);

  const show = (next: TimeRange) => plotRef.current?.setScale('x', next);

  return (
    <div className="wave-chart">
      <div ref={holderRef} className="wave-chart__plot" role="img" aria-label={`Grafiek van ${name}`} />
      <div className="ai-row wave-chart__tools">
        <button type="button" className="ai-btn ai-btn--secondary ai-btn--sm" onClick={() => show(zoomRange(range, 0.25))}>
          Inzoomen
        </button>
        <button type="button" className="ai-btn ai-btn--secondary ai-btn--sm" disabled={isFullRange(range)} onClick={() => show(zoomRange(range, 4))}>
          Uitzoomen
        </button>
        <button type="button" className="ai-btn ai-btn--secondary ai-btn--sm" disabled={range.min <= 0} onClick={() => show(panRange(range, -0.5))}>
          Naar links
        </button>
        <button type="button" className="ai-btn ai-btn--secondary ai-btn--sm" disabled={range.max >= FULL_RANGE.max} onClick={() => show(panRange(range, 0.5))}>
          Naar rechts
        </button>
        <button type="button" className="ai-btn ai-btn--secondary ai-btn--sm" disabled={isFullRange(range)} onClick={() => show(FULL_RANGE)}>
          Volledig beeld
        </button>
      </div>
      <p className="wave-chart__hint" data-testid="zichtbaar-bereik">
        Zichtbaar: {formatNumber(range.min)} s tot {formatNumber(range.max)} s. Sleep over de grafiek
        om in te zoomen.
      </p>
    </div>
  );
}
