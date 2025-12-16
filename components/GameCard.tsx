import React, { useState, useEffect, useRef } from 'react';
import { Task } from '../types';

interface GameCardProps {
  task: Task;
  onComplete: () => void;
  onSkip: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ task, onComplete, onSkip }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset internal state when task changes (level up)
  useEffect(() => {
    setImagePreview(null);
    setIsCompleting(false);
  }, [task.id]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteClick = () => {
    setIsCompleting(true);
    
    // Simulate a brief "processing" or "savoring" moment
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <div className={`w-full max-w-md mx-auto p-8 bg-white/60 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/80 transition-all duration-1000 flex flex-col items-center text-center space-y-6 ${isCompleting ? 'scale-95 opacity-50 blur-[1px]' : 'fade-in'}`}>
      
      {/* Header Info */}
      <div className="space-y-2">
        <div className="flex justify-center items-center space-x-2">
          <span className="h-px w-8 bg-stone-300"></span>
          <span className="text-xs uppercase tracking-[0.2em] text-stone-400 font-semibold">
            Level {task.id}
          </span>
          <span className="h-px w-8 bg-stone-300"></span>
        </div>
        <h2 className="text-2xl md:text-3xl text-stone-800 font-serif leading-relaxed italic">
          "{task.narrative}"
        </h2>
      </div>

      {/* Task Instruction */}
      <div className="py-2">
        <p className="text-lg md:text-xl text-stone-700 font-medium leading-relaxed">
          {task.instruction}
        </p>
      </div>

      {/* Image Upload Area */}
      <div className="w-full relative group transition-all duration-500">
        {imagePreview ? (
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-md rotate-1 transition-transform duration-500 hover:rotate-0">
            <img src={imagePreview} alt="Proof of task" className="w-full h-full object-cover" />
            <button 
              onClick={() => setImagePreview(null)}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs backdrop-blur-sm hover:bg-black/70 transition-colors"
            >
              ✕
            </button>
          </div>
        ) : (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-8 border-2 border-dashed border-stone-300/60 rounded-xl text-stone-400 hover:border-stone-400 hover:text-stone-600 hover:bg-white/40 transition-all flex flex-col items-center gap-2 group-hover:scale-[1.01]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            <span className="text-sm font-serif italic">Add a photo (optional)</span>
          </button>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleImageUpload} 
          className="hidden" 
        />
        {/* Privacy Note */}
        {!imagePreview && (
          <p className="text-[10px] text-stone-300 mt-2">
            Photos stay on your device. Nothing is uploaded.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col gap-4 pt-2">
        <button
          onClick={handleCompleteClick}
          disabled={isCompleting}
          className="w-full py-4 bg-stone-800 text-stone-50 rounded-xl hover:bg-stone-700 transition-all font-serif text-lg tracking-wide shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
        >
          {isCompleting ? (
            <span className="animate-pulse flex items-center justify-center gap-2">
               <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"></span>
               <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-100"></span>
               <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce delay-200"></span>
            </span>
          ) : (
            imagePreview ? "I Capture This Moment" : "I Choose to DO This"
          )}
        </button>
        
        <button
          onClick={onSkip}
          disabled={isCompleting}
          className="w-full py-3 text-stone-400 hover:text-stone-600 transition-colors text-sm font-serif italic"
        >
          Skip for today
        </button>
      </div>
    </div>
  );
};