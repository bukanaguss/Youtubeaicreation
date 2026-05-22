
import React from 'react';
import type { Idea } from '../types';

interface IdeaCardProps {
  idea: Idea;
  index: number;
  onSelect: (idea: Idea) => void;
}

const AngleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5.5 16.5a1.5 1.5 0 01-1.415-1.031l-1.36-4.083a.5.5 0 01.15-.503l4.083-3.702a1.5 1.5 0 012.06.206l4.246 6.368a1.5 1.5 0 01-.206 2.06l-3.702 4.083a.5.5 0 01-.503.15l-4.083-1.36A1.5 1.5 0 015.5 16.5z" />
        <path d="M12.5 3.5a1.5 1.5 0 011.415 1.031l1.36 4.083a.5.5 0 01-.15.503l-4.083 3.702a1.5 1.5 0 01-2.06-.206L4.246 6.368a1.5 1.5 0 01.206-2.06l3.702-4.083a.5.5 0 01.503-.15l4.083 1.36A1.5 1.5 0 0112.5 3.5z" />
    </svg>
);

const HookIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
    </svg>
);

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, index, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(idea)}
      className="w-full text-left bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-lg transition-all duration-300 hover:border-blue-500 hover:shadow-blue-500/10 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
      aria-label={`Pilih ide: ${idea.title}`}
    >
      <h3 className="text-xl font-bold text-slate-100 mb-4">{idea.title}</h3>
      
      <div className="space-y-4">
        <div className="flex items-start">
            <AngleIcon/>
            <div>
                <p className="text-sm font-semibold text-purple-400">Angle Penceritaan</p>
                <p className="text-slate-300">{idea.angle}</p>
            </div>
        </div>
        
        <div className="flex items-start">
            <HookIcon/>
            <div>
                <p className="text-sm font-semibold text-blue-400">Hook Pembuka</p>
                <p className="text-slate-300 italic">"{idea.hook}"</p>
            </div>
        </div>
      </div>
       <div className="text-right text-xs text-blue-400 mt-4 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          Klik untuk membuat naskah &rarr;
       </div>
    </button>
  );
};

export default IdeaCard;
