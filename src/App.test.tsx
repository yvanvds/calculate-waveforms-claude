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

describe('Bewerkingen', () => {
  function bar() {
    return screen.getByRole('region', { name: 'Bewerkingen' });
  }
  function panel(name: string) {
    return within(bar()).getByRole('group', { name });
  }

  it('voegt W2 toe met "Nieuwe golf"', () => {
    render(<App />);
    fireEvent.click(within(bar()).getByRole('button', { name: 'Nieuwe golf' }));
    const card = screen.getByRole('article', { name: 'Golf W2' });
    expect(within(card).getByText('Sinus, 440 Hz')).toBeInTheDocument();
    expect(within(card).getByLabelText('Frequentie van W2 (Hz)')).toBeInTheDocument();
  });

  it('vermenigvuldigt W1 met 0,5 en toont de beschrijving, zonder instellingen', () => {
    render(<App />);
    fireEvent.click(within(bar()).getByRole('button', { name: 'Nieuwe golf' }));
    const scale = panel('Golf vermenigvuldigen met een getal');
    fireEvent.change(within(scale).getByLabelText('Golf om te vermenigvuldigen'), {
      target: { value: 'W1' },
    });
    fireEvent.change(within(scale).getByLabelText('Getal'), { target: { value: '0,5' } });
    fireEvent.click(within(scale).getByRole('button', { name: 'Vermenigvuldig' }));
    const card = screen.getByRole('article', { name: 'Golf W3' });
    expect(within(card).getByText('W3 = 0,5 × W1')).toBeInTheDocument();
    expect(within(card).queryByLabelText(/Frequentie/)).not.toBeInTheDocument();
    expect(within(card).getByRole('button', { name: 'Speel W3 af' })).toBeInTheDocument();
    const w1 = screen.getByRole('article', { name: 'Golf W1' });
    expect(within(w1).getByText('Sinus, 440 Hz')).toBeInTheDocument();
  });

  it('aanvaardt ook een punt als decimaalteken', () => {
    render(<App />);
    const scale = panel('Golf vermenigvuldigen met een getal');
    fireEvent.change(within(scale).getByLabelText('Getal'), { target: { value: '-2.5' } });
    fireEvent.click(within(scale).getByRole('button', { name: 'Vermenigvuldig' }));
    expect(screen.getByText('W2 = -2,5 × W1')).toBeInTheDocument();
  });

  it.each(['', 'abc'])('maakt geen golf met het ongeldige getal "%s"', (value) => {
    render(<App />);
    const scale = panel('Golf vermenigvuldigen met een getal');
    fireEvent.change(within(scale).getByLabelText('Getal'), { target: { value } });
    fireEvent.click(within(scale).getByRole('button', { name: 'Vermenigvuldig' }));
    expect(within(scale).getByRole('alert')).toHaveTextContent(
      'Vul een getal in, bijvoorbeeld 0,5 of -2.',
    );
    expect(within(scale).getByLabelText('Getal')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getAllByRole('article')).toHaveLength(1);
  });

  it('telt W1 en W2 op en meldt dat de golf buiten het bereik gaat', () => {
    render(<App />);
    fireEvent.click(within(bar()).getByRole('button', { name: 'Nieuwe golf' }));
    const sum = panel('Twee golven optellen');
    expect(within(sum).getByLabelText('Eerste golf')).toHaveValue('W1');
    expect(within(sum).getByLabelText('Tweede golf')).toHaveValue('W2');
    fireEvent.click(within(sum).getByRole('button', { name: 'Tel op' }));
    const card = screen.getByRole('article', { name: 'Golf W3' });
    expect(within(card).getByText('W3 = W1 + W2')).toBeInTheDocument();
    expect(within(card).getByText('Buiten het bereik -1 tot 1')).toBeInTheDocument();
    expect(
      within(screen.getByRole('article', { name: 'Golf W1' })).queryByText(
        'Buiten het bereik -1 tot 1',
      ),
    ).not.toBeInTheDocument();
  });

  it('houdt een berekende golf als je W1 verwijdert, en hergebruikt geen naam', () => {
    render(<App />);
    const scale = panel('Golf vermenigvuldigen met een getal');
    fireEvent.click(within(scale).getByRole('button', { name: 'Vermenigvuldig' }));
    fireEvent.click(screen.getByRole('button', { name: 'Verwijder W1' }));
    expect(screen.getByRole('article', { name: 'Golf W2' })).toHaveTextContent('W2 = 0,5 × W1');
    expect(within(scale).getByLabelText('Golf om te vermenigvuldigen')).toHaveValue('W2');
    fireEvent.click(within(bar()).getByRole('button', { name: 'Nieuwe golf' }));
    expect(screen.getByRole('article', { name: 'Golf W3' })).toBeInTheDocument();
  });

  it('schakelt de bewerkingen uit als er geen golven zijn', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Verwijder W1' }));
    expect(within(bar()).getByRole('button', { name: 'Vermenigvuldig' })).toBeDisabled();
    expect(within(bar()).getByRole('button', { name: 'Tel op' })).toBeDisabled();
    expect(within(bar()).getByRole('button', { name: 'Nieuwe golf' })).toBeEnabled();
  });
});
