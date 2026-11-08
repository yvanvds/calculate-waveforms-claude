import { useState } from 'react';
import { WaveCard } from './components/WaveCard.tsx';
import { WaveSettings } from './components/WaveSettings.tsx';
import { describeWave } from './workspace/labels.ts';
import { initialWorkspace, removeWave, updateGeneratedWave } from './workspace/workspace.ts';

function App() {
  const [workspace, setWorkspace] = useState(initialWorkspace);

  return (
    <main className="app">
      <header className="ai-stack app__intro">
        <p className="ai-eyebrow">Geluid en wiskunde</p>
        <h1 className="h1 app__title">Rekenen met waveforms</h1>
        <p className="lead app__lead">
          Maak geluidsgolven, bekijk ze als grafiek en luister ernaar. Reken er daarna mee en
          hoor meteen wat er met het geluid gebeurt.
        </p>
      </header>

      <section className="app__waves" aria-label="Golven">
        {workspace.waves.length === 0 && <p className="app__empty">Er zijn geen golven.</p>}
        {workspace.waves.map((wave) => (
          <WaveCard
            key={wave.name}
            name={wave.name}
            description={describeWave(wave)}
            samples={wave.samples}
            onRemove={() => setWorkspace((ws) => removeWave(ws, wave.name))}
            settings={
              wave.source.kind === 'generated' ? (
                <WaveSettings
                  name={wave.name}
                  frequency={wave.source.frequency}
                  shape={wave.source.shape}
                  onChange={(frequency, shape) =>
                    setWorkspace((ws) => updateGeneratedWave(ws, wave.name, frequency, shape))
                  }
                />
              ) : undefined
            }
          />
        ))}
      </section>
    </main>
  );
}

export default App;
