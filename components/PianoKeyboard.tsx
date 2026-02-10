
import React from 'react';
import { NOTE_LABELS } from '../types';

interface PianoKeyboardProps {
  tuning: { [key: number]: number };
  onToggleQuarterTone: (noteIndex: number) => void;
  transpose: number;
}

const PianoKeyboard: React.FC<PianoKeyboardProps> = ({ tuning, onToggleQuarterTone, transpose }) => {
  const renderKey = (index: number) => {
    const notePos = index % 12;
    const isBlack = [1, 3, 6, 8, 10].includes(notePos);
    const isTuned = tuning[notePos] !== 0;
    
    const baseClasses = isBlack 
      ? "w-7 h-20 -mx-3.5 z-10 rounded-b-sm shadow-md" 
      : "w-10 h-32 border border-slate-700 rounded-b-md shadow-sm";
    
    const colorClasses = isBlack 
      ? (isTuned ? "bg-amber-500" : "bg-slate-900")
      : (isTuned ? "bg-amber-100" : "bg-white");

    const textClasses = isBlack ? "text-[8px] text-white/30" : "text-[10px] text-slate-400 font-bold";

    return (
      <div 
        key={index}
        onClick={() => onToggleQuarterTone(notePos)}
        className={`${baseClasses} ${colorClasses} flex flex-col items-center justify-end pb-2 cursor-pointer transition-all duration-100 select-none active:brightness-75`}
      >
        <span className={textClasses}>{NOTE_LABELS[notePos]}</span>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-start bg-slate-900/50 p-4 rounded-xl border border-slate-800 shadow-inner w-full overflow-hidden">
      <div className="flex relative">
        {Array.from({ length: 12 }).map((_, i) => renderKey(i))}
      </div>
    </div>
  );
};

export default PianoKeyboard;
