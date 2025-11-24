import React, { useState, useEffect } from 'react';
import { Check, X, RefreshCw } from 'lucide-react';

interface JsonInputProps {
  value: any;
  onApply: (val: any) => void;
}

export const JsonInput: React.FC<JsonInputProps> = ({ value, onApply }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    try {
      setText(JSON.stringify(value, null, 2));
      setIsDirty(false);
      setError(null);
    } catch (e) {
      setText(String(value));
    }
  }, [value]);

  const handleChange = (newText: string) => {
    setText(newText);
    setIsDirty(true);
    try {
      JSON.parse(newText);
      setError(null);
    } catch (e) {
      // Don't set error immediately on typing, only invalid JSON prevents apply
    }
  };

  const handleApply = () => {
    try {
      const parsed = JSON.parse(text);
      setError(null);
      onApply(parsed);
      setIsDirty(false);
    } catch (e) {
      setError('Invalid JSON: Cannot apply changes.');
    }
  };

  const handleDiscard = () => {
    try {
      setText(JSON.stringify(value, null, 2));
      setIsDirty(false);
      setError(null);
    } catch (e) {
      setText('');
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full min-h-[400px]">
      <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono px-1">
        <span>JSON CONFIGURATION</span>
        {isDirty && <span className="text-amber-500 font-bold">• Unsaved Changes</span>}
      </div>
      
      <div className="relative flex-1 group">
        <textarea
            value={text}
            onChange={(e) => handleChange(e.target.value)}
            className={`w-full h-full bg-[#1e1e1e] border ${error ? 'border-red-500' : 'border-gray-800'} text-[#d4d4d4] font-mono text-[12px] leading-5 p-3 rounded-md outline-none focus:border-accent-500 resize-none shadow-inner`}
            spellCheck={false}
            style={{ tabSize: 2 }}
        />
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-900/50 text-red-400 text-[11px] p-2 rounded flex items-center">
            <span className="font-bold mr-2">Error:</span> {error}
        </div>
      )}

      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-800">
        <button 
            onClick={handleDiscard}
            disabled={!isDirty}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-xs font-semibold transition-colors
                ${isDirty 
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                    : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'}
            `}
        >
            <RefreshCw size={14} /> Discard
        </button>
        <button 
            onClick={handleApply}
            disabled={!isDirty}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-xs font-semibold transition-colors
                ${isDirty 
                    ? 'bg-accent-600 hover:bg-accent-500 text-white shadow-lg shadow-accent-900/20' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'}
            `}
        >
            <Check size={14} /> Apply Changes
        </button>
      </div>
    </div>
  );
};