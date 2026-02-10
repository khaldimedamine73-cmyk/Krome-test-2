
import React, { useState, useEffect, useCallback } from 'react';
import { midiService } from './services/midiService';
import { NOTE_LABELS } from './types';
import { MAQAM_PRESETS } from './constants';
import PianoKeyboard from './components/PianoKeyboard';
import RibbonController from './components/RibbonController';
import MaqamAssistant from './components/MaqamAssistant';

const App: React.FC = () => {
  const [midiOutputs, setMidiOutputs] = useState<MIDIOutput[]>([]);
  const [selectedOutput, setSelectedOutput] = useState<string>('');
  const [tuning, setTuning] = useState<{ [key: number]: number }>({
    0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0
  });
  const [transpose, setTranspose] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        if (!navigator.requestMIDIAccess) {
          setError("Le MIDI n'est pas supporté par ce navigateur ou nécessite une connexion HTTPS.");
          setLoading(false);
          return;
        }

        const outputs = await midiService.initialize();
        setMidiOutputs(outputs);
        if (outputs.length > 0) {
          setSelectedOutput(outputs[0].id);
          midiService.setOutput(outputs[0].id);
        }
      } catch (err) {
        setError("Erreur lors de l'accès aux périphériques MIDI.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleOutputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedOutput(id);
    midiService.setOutput(id);
  };

  const handleToggleQuarterTone = useCallback((noteIndex: number) => {
    setTuning(prev => {
      const newTuning = { ...prev };
      newTuning[noteIndex] = newTuning[noteIndex] === 0 ? -50 : 0;
      const tuningArray = Array.from({ length: 12 }).map((_, i) => newTuning[i]);
      midiService.sendScaleTuning(tuningArray);
      return newTuning;
    });
  }, []);

  const applyMaqamTuning = (newTunings: { [key: string]: number }) => {
    const resetTuning = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0 };
    Object.entries(newTunings).forEach(([noteName, offset]) => {
      const idx = NOTE_LABELS.indexOf(noteName);
      if (idx !== -1) {
        resetTuning[idx as keyof typeof resetTuning] = offset;
      }
    });
    setTuning(resetTuning);
    const tuningArray = Array.from({ length: 12 }).map((_, i) => resetTuning[i as keyof typeof resetTuning]);
    midiService.sendScaleTuning(tuningArray);
  };

  const handleResetTuning = () => {
    const resetTuning = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0, 11:0 };
    setTuning(resetTuning);
    midiService.sendScaleTuning(Array(12).fill(0));
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-slate-950 flex items-center justify-center text-amber-500 font-bold">
        LANCEMENT...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-white font-bold mb-2">Problème de Compatibilité</h2>
        <p className="text-slate-400 text-sm mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-amber-500 text-slate-950 font-black px-6 py-2 rounded-full text-xs uppercase"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-200 flex flex-col p-4 gap-3 max-w-md mx-auto overflow-hidden">
      {/* Header Compact */}
      <header className="flex items-center justify-between bg-slate-900 p-3 rounded-2xl border border-slate-800 shadow-xl">
        <h1 className="text-xs font-black tracking-widest text-amber-500 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          KROME EX
        </h1>
        <select 
          value={selectedOutput}
          onChange={handleOutputChange}
          className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[9px] font-bold text-amber-100 focus:outline-none max-w-[130px]"
        >
          {midiOutputs.length === 0 ? (
            <option disabled>SÉLECT. SORTIE</option>
          ) : (
            midiOutputs.map(out => (
              <option key={out.id} value={out.id}>{out.name}</option>
            ))
          )}
        </select>
      </header>

      {/* RAST Quick Controls */}
      <div className="grid grid-cols-3 gap-2">
        {MAQAM_PRESETS.map(m => (
          <button 
            key={m.name}
            onClick={() => applyMaqamTuning(m.tunings)}
            className="bg-slate-900 active:bg-amber-600 active:text-slate-950 text-[10px] font-black py-4 rounded-xl border border-slate-800 transition-all uppercase shadow-md"
          >
            {m.name.split(' ')[1] || m.name}
          </button>
        ))}
      </div>

      {/* Main Piano Unit */}
      <div className="flex-1 flex flex-col justify-center items-center gap-4 bg-slate-900/40 rounded-3xl border border-slate-900/60 p-2 shadow-inner">
        <div className="flex items-center justify-between w-full px-4">
           <div className="flex items-center gap-3">
              <button onClick={() => setTranspose(p => Math.max(-12, p-1))} className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 active:bg-amber-500 text-xl font-bold">-</button>
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-black text-slate-500">TRP</span>
                <span className="text-sm font-mono font-black text-amber-500">{transpose > 0 ? `+${transpose}` : transpose}</span>
              </div>
              <button onClick={() => setTranspose(p => Math.min(12, p+1))} className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 active:bg-amber-500 text-xl font-bold">+</button>
           </div>
           <button onClick={handleResetTuning} className="bg-slate-800 px-4 py-2 rounded-lg text-[9px] font-black text-slate-400 border border-slate-700 active:text-white uppercase">Reset All</button>
        </div>

        <PianoKeyboard 
          tuning={tuning} 
          onToggleQuarterTone={handleToggleQuarterTone}
          transpose={transpose}
        />
      </div>

      {/* Control Strip */}
      <div className="flex flex-col gap-3">
        <RibbonController />
        <div className="h-32">
          <MaqamAssistant onApplyTuning={applyMaqamTuning} />
        </div>
      </div>

      <div className="text-[7px] text-center text-slate-700 font-black uppercase tracking-[0.5em] mt-1">
        Professional SysEx Controller for Korg Krome
      </div>
    </div>
  );
};

export default App;
