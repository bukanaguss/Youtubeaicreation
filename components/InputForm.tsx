import React, { useState } from 'react';
import type { Language } from '../types';

interface InputFormProps {
  onGenerate: (theme: string, language: Language) => void;
  isLoading: boolean;
  selectedNicheName: string;
  selectedNicheId: string;
  onBackToNiches: () => void;
}

const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading, selectedNicheName, selectedNicheId, onBackToNiches }) => {
  const [theme, setTheme] = useState<string>('');
  const [language, setLanguage] = useState<Language>('id');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onGenerate(theme, language);
  };

  const getPlaceholderForNiche = (nicheId: string): string => {
    switch (nicheId) {
      case 'edukasi-agama':
        return 'Contoh: "Konsep sabar dalam Islam" atau "Makna karma dalam ajaran Buddha"';
      case 'edukasi-kesehatan':
        return 'Contoh: "Dampak posisi tidur bagi kesehatan jantung"';
      case 'cerita-horor':
        return 'Contoh: "Misteri suara tangisan di gudang sekolah tua"';
      case 'dracin':
        return 'Contoh: "CEO dingin yang jatuh cinta pada gadis miskin"';
      case 'animasi-anak':
        return 'Contoh: "Petualangan Kiki si Kelinci Cerdik"';
      case 'kisah-islami':
        return 'Contoh: "Kisah Nabi Musa membelah lautan"';
      case 'sport-olahraga':
        return 'Contoh: "Analisis Taktik Kemenangan Real Madrid di Final UCL"';
      case 'edukasi-sains':
        return 'Contoh: "Bagaimana cara kerja Black Hole?"';
      case 'psikologi-selfdev':
        return 'Contoh: "5 Cara Mengatasi Kebiasaan Overthinking"';
      case 'bisnis-marketing':
        return 'Contoh: "Strategi Marketing Jenius di Balik Apple"';
      case 'biografi':
        return 'Contoh: "Sisi lain dari kehidupan Albert Einstein"';
      case 'misteri-konspirasi':
      default:
        return 'Contoh: "Misteri Peradaban Anunnaki"';
    }
  };

  const placeholder = getPlaceholderForNiche(selectedNicheId);

  return (
    <>
      <div className="flex justify-between items-center mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
        <p className="text-sm text-slate-300">
            Niche Terpilih: <span className="font-bold text-blue-400">{selectedNicheName}</span>
        </p>
        <button 
          onClick={onBackToNiches} 
          className="text-sm text-slate-400 hover:text-slate-200 transition-colors px-3 py-1 rounded-md hover:bg-slate-700"
          aria-label="Kembali untuk ganti niche"
        >
            Ganti Niche
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-slate-300 mb-2">
            Masukkan Tema Spesifik Video Anda
          </label>
          <input
            id="theme"
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-slate-100 placeholder-slate-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-slate-300 mb-2">
            Pilih Bahasa Konten
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-slate-100 disabled:opacity-50"
          >
            <option value="id">Bahasa Indonesia 🇮🇩</option>
            <option value="en">English 🇺🇸</option>
            <option value="ms">Bahasa Melayu 🇲🇾</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading || !theme}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </>
          ) : (
            'Buat Ide Konten'
          )}
        </button>
      </form>
    </>
  );
};

export default InputForm;