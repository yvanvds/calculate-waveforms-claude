import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App.tsx';

// uPlot tekent op een canvas, en dat bestaat niet in de testomgeving.
// De grafiek wordt getest met de echte app (e2e/golf.spec.ts).
vi.mock('./components/WaveChart.tsx', () => ({
  WaveChart: ({ name }: { name: string }) => <div role="img" aria-label={`Grafiek van ${name}`} />,
}));

describe('App', () => {
  it('toont de titel op de startpagina', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Rekenen met waveforms' }),
    ).toBeInTheDocument();
  });

  it('begint met W1, een sinus van 440 Hz, met een grafiek', () => {
    render(<App />);
    const card = screen.getByRole('article', { name: 'Golf W1' });
    expect(within(card).getByRole('heading', { name: 'W1' })).toBeInTheDocument();
    expect(within(card).getByText('Sinus, 440 Hz')).toBeInTheDocument();
    expect(within(card).getByLabelText('Frequentie van W1 (Hz)')).toHaveValue(440);
    expect(within(card).getByLabelText('Vorm van W1')).toHaveValue('sine');
    expect(within(card).getByRole('img', { name: 'Grafiek van W1' })).toBeInTheDocument();
  });

  it('past de beschrijving aan als je vorm en frequentie verandert', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Vorm van W1'), { target: { value: 'square' } });
    fireEvent.change(screen.getByLabelText('Frequentie van W1 (Hz)'), { target: { value: '2' } });
    expect(screen.getByText('Blok, 2 Hz')).toBeInTheDocument();
  });

  it('meldt een ongeldige frequentie en houdt de vorige golf', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Frequentie van W1 (Hz)'), { target: { value: '0' } });
    expect(screen.getByText(/Kies een frequentie tussen/)).toBeInTheDocument();
    expect(screen.getByText('Sinus, 440 Hz')).toBeInTheDocument();
  });

  it('verwijdert W1', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Verwijder W1' }));
    expect(screen.queryByRole('article', { name: 'Golf W1' })).not.toBeInTheDocument();
    expect(screen.getByText('Er zijn geen golven.')).toBeInTheDocument();
  });
});
