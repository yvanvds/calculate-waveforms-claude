import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App.tsx';

describe('App', () => {
  it('toont de titel op de startpagina', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Rekenen met waveforms' }),
    ).toBeInTheDocument();
  });
});
