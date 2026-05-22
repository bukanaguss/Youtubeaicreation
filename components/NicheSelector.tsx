import React from 'react';
import type { Niche } from '../types';

interface NicheSelectorProps {
  niches: Niche[];
  onSelect: (niche: Niche) => void;
}

const NicheCard: React.FC<{ niche: Niche; onSelect: () => void }> = ({ niche, onSelect }) => (
  <button
    onClick={onSelect}
    className="group flex flex-col items-center text-center p-4 md:p-6 bg-slate-800 border border-slate-700 rounded-lg shadow-lg transition-all duration-300 hover:border-blue-500 hover:shadow-blue-500/10 hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
    aria-label={`Pilih niche: ${niche.name}`}
  >
    <div className="mb-4 text-blue-400 transition-colors group-hover:text-blue-300">
      <niche.icon className="h-12 w-12" />
    </div>
    <h3 className="text-md font-bold text-slate-100">{niche.name}</h3>
    <p className="text-xs text-slate-400 mt-1">{niche.description}</p>
  </button>
);

const NicheSelector: React.FC<NicheSelectorProps> = ({ niches, onSelect }) => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-100">Pilih Niche Tema Anda</h2>
        <p className="text-slate-400 mt-2">Pilih kategori untuk menyesuaikan gaya ide yang akan dihasilkan.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {niches.map(niche => (
          <NicheCard key={niche.id} niche={niche} onSelect={() => onSelect(niche)} />
        ))}
      </div>
    </div>
  );
};

export default NicheSelector;