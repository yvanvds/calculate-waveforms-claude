import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { createWave, scaleWave } from '../audio/index.ts';
import { WaveCard } from './WaveCard.tsx';

vi.mock('./WaveChart.tsx', () => ({
  WaveChart: ({ name }: { name: string }) => <div role="img" aria-label={`Grafiek van ${name}`} />,
}));

const playWave = vi.hoisted(() => vi.fn(() => Promise.resolve()));
vi.mock('../playback/player.ts', () => ({ playWave, stopPlayback: vi.fn() }));

describe('WaveCard', () => {
  it('toont een berekende golf met beschrijving en zonder instellingen', () => {
    render(
      <WaveCard name="W3" description="W1 + W2" samples={createWave(1, 'sine')} onRemove={() => {}} />,
    );
    expect(screen.getByRole('heading', { name: 'W3' })).toBeInTheDocument();
    expect(screen.getByText('W1 + W2')).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('waarschuwt als de golf buiten -1 tot 1 gaat', () => {
    render(
      <WaveCard
        name="W2"
        description="W1 × 2,5"
        samples={scaleWave(createWave(1, 'square'), 2.5)}
        onRemove={() => {}}
      />,
    );
    expect(screen.getByText('Buiten het bereik -1 tot 1')).toBeInTheDocument();
    expect(screen.getByText(/gaat tot 2,5/)).toBeInTheDocument();
  });

  it('geeft geen waarschuwing binnen het bereik', () => {
    render(<WaveCard name="W1" description="Sinus" samples={createWave(1, 'sine')} onRemove={() => {}} />);
    expect(screen.queryByText('Buiten het bereik -1 tot 1')).not.toBeInTheDocument();
  });

  it('speelt de golf af en kan verwijderd worden', () => {
    const samples = createWave(440, 'sine');
    const onRemove = vi.fn();
    render(<WaveCard name="W1" description="Sinus" samples={samples} onRemove={onRemove} />);
    fireEvent.click(screen.getByRole('button', { name: 'Speel W1 af' }));
    expect(playWave).toHaveBeenCalledWith(samples);
    fireEvent.click(screen.getByRole('button', { name: 'Verwijder W1' }));
    expect(onRemove).toHaveBeenCalled();
  });

  it('toont tijdens het afspelen wat je kan nakijken als je niets hoort', async () => {
    let finish = () => {};
    playWave.mockImplementationOnce(() => new Promise<void>((resolve) => (finish = resolve)));
    render(<WaveCard name="W1" description="Sinus" samples={createWave(440, 'sine')} onRemove={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Speel W1 af' }));
    expect(screen.getByText(/Hoor je niets\?/)).toBeInTheDocument();
    // Een browser die al lang openstaat, kan zijn verbinding met de geluidskaart kwijt zijn.
    expect(screen.getByText(/sluit de browser dan helemaal af en start hem opnieuw/)).toBeInTheDocument();
    finish();
    expect(await screen.findByRole('button', { name: 'Speel W1 af' })).toBeInTheDocument();
    expect(screen.queryByText(/Hoor je niets\?/)).not.toBeInTheDocument();
  });

  it('toont een melding als afspelen mislukt', async () => {
    playWave.mockImplementationOnce(() => Promise.reject(new Error('tegengehouden')));
    render(<WaveCard name="W1" description="Sinus" samples={createWave(440, 'sine')} onRemove={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: 'Speel W1 af' }));
    const melding = await screen.findByRole('alert');
    expect(melding).toHaveTextContent('Afspelen lukte niet');
    expect(melding).toHaveTextContent('De browser houdt het geluid tegen.');
    expect(melding.querySelector('svg')).not.toBeNull();
  });
});
