
import React, { useRef, useState, useEffect } from 'react';
import { midiService } from '../services/midiService';

const RibbonController: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(50);

  const handleInteraction = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percent);
    midiService.sendPitchBend(Math.floor((percent / 100) * 16383));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleInteraction(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleInteraction(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => { if (isDragging) handleInteraction(e.clientX); };
  const handleTouchMove = (e: TouchEvent) => { if (isDragging) handleInteraction(e.touches[0].clientX); };

  const handleEnd = () => {
    setIsDragging(false);
    setPosition(50);
    midiService.sendPitchBend(8192);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <div className="w-full flex flex-col gap-1">
      <div className="flex justify-between items-center text-[8px] font-bold text-slate-600 uppercase tracking-widest px-1">
        <span>Pitch Bend Ribbon</span>
        <span className="text-amber-500">{Math.round((position - 50) * 2)}</span>
      </div>
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative w-full h-12 rounded-lg overflow-hidden cursor-crosshair ribbon-gradient border border-slate-800 shadow-inner"
      >
        <div 
          className="absolute h-full w-0.5 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
          style={{ left: `${position}%` }}
        />
        <div className="absolute inset-0 flex justify-between px-4 pointer-events-none items-center opacity-10">
          {[...Array(9)].map((_, i) => <div key={i} className="h-full border-r border-slate-400" />)}
        </div>
      </div>
    </div>
  );
};

export default RibbonController;
