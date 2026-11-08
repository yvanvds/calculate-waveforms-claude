import { useState } from 'react';
import { EnvelopeCard } from './components/EnvelopeCard.tsx';
import { WaveCard } from './components/WaveCard.tsx';
import { WaveSettings } from './components/WaveSettings.tsx';
import { describeWave } from './workspace/labels.ts';
import {
  addEnvelope,
  addEnvelopedWave,
  addGeneratedWave,
  addScaledWave,
  addSummedWave,
  DEFAULT_FREQUENCY,
  DEFAULT_SHAPE,
  initialWorkspace,
  nextEnvelopeName,
  nextWaveName,
  removeEnvelope,
  removeWave,
  updateEnvelope,
  updateGeneratedWave,
} from './workspace/workspace.ts';
import { EnvelopeOperation } from './components/operations/EnvelopeOperation.tsx';
import { NewEnvelopeOperation } from './components/operations/NewEnvelopeOperation.tsx';
import { NewWaveOperation } from './components/operations/NewWaveOperation.tsx';
import { OperationsBar } from './components/operations/OperationsBar.tsx';
import { ScaleOperation } from './components/operations/ScaleOperation.tsx';
import { SumOperation } from './components/operations/SumOperation.tsx';

function App() {
  const [workspace, setWorkspace] = useState(initialWorkspace);
  const names = workspace.waves.map((wave) => wave.name);

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

      {workspace.envelopes.length > 0 && (
        <section className="app__waves" aria-label="Envelopes">
          {workspace.envelopes.map((envelope) => (
            <EnvelopeCard
              key={envelope.name}
              name={envelope.name}
              settings={envelope.settings}
              samples={envelope.samples}
              onChange={(settings) =>
                setWorkspace((ws) => updateEnvelope(ws, envelope.name, settings))
              }
              onRemove={() => setWorkspace((ws) => removeEnvelope(ws, envelope.name))}
            />
          ))}
        </section>
      )}

      <OperationsBar>
        <NewWaveOperation
          nextName={nextWaveName(workspace)}
          onAdd={() =>
            setWorkspace((ws) => addGeneratedWave(ws, DEFAULT_FREQUENCY, DEFAULT_SHAPE))
          }
        />
        <ScaleOperation
          names={names}
          onScale={(name, factor) => setWorkspace((ws) => addScaledWave(ws, name, factor))}
        />
        <SumOperation
          names={names}
          onSum={(first, second) => setWorkspace((ws) => addSummedWave(ws, first, second))}
        />
        <NewEnvelopeOperation
          nextName={nextEnvelopeName(workspace)}
          onAdd={() => setWorkspace((ws) => addEnvelope(ws))}
        />
        <EnvelopeOperation
          names={names}
          envelopeNames={workspace.envelopes.map((envelope) => envelope.name)}
          onApply={(wave, envelope) =>
            setWorkspace((ws) => addEnvelopedWave(ws, wave, envelope))
          }
        />
      </OperationsBar>
    </main>
  );
}

export default App;
