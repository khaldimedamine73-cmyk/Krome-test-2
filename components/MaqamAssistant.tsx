
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface MaqamAssistantProps {
  onApplyTuning: (tunings: { [key: string]: number }) => void;
}

const MaqamAssistant: React.FC<MaqamAssistantProps> = ({ onApplyTuning }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleAskAI = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `User wants to know about this oriental scale: "${query}". 
      Explain its mood and quarter-tones. Be very concise for mobile. 
      JSON tuning format: {"tuning": {"E": -50, "B": -50}}.`;

      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });

      setResponse(result.text || "No response.");
    } catch (err) {
      setResponse("Error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 h-full flex flex-col gap-2">
      <div className="flex gap-2">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Scale help..."
          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
        />
        <button 
          onClick={handleAskAI}
          disabled={loading}
          className="bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
        >
          {loading ? '...' : 'Ask'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto text-[10px] text-slate-400 italic">
        {response ? (
          <div className="p-2 bg-slate-950 rounded border border-slate-800">
            {response}
          </div>
        ) : (
          "Need a custom scale? Ask AI."
        )}
      </div>
    </div>
  );
};

export default MaqamAssistant;
