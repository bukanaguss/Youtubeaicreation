import React, { useState, useCallback, useEffect } from 'react';
import type { Idea, Niche, Language } from './types';
import { generateContentIdeas } from './services/geminiService';
import Header from './components/Header';
import InputForm from './components/InputForm';
import IdeaCard from './components/IdeaCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import ScriptView from './components/ScriptView';
import PasswordScreen from './components/PasswordScreen';
import NicheSelector from './components/NicheSelector';
import { niches } from './nicheData';

const WelcomeMessage: React.FC = () => (
  <div className="text-center p-8 bg-slate-800/50 rounded-lg border border-slate-700 animate-fade-in">
    <h2 className="text-2xl font-bold text-slate-100 mb-2">Selamat Datang di CineMind AI!</h2>
    <p className="text-slate-400">
      Masukkan tema video Anda di atas dan biarkan AI kami merancang 3 angle cerita yang unik dan menarik, khusus untuk niche channel YouTube Anda.
    </p>
  </div>
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'niche-selector' | 'ideas' | 'script'>('niche-selector');
  const [selectedNiche, setSelectedNiche] = useState<Niche | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('id');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to handle navigation state consistency safely
  useEffect(() => {
    if (currentView === 'ideas' && !selectedNiche) {
      setCurrentView('niche-selector');
    }
    if (currentView === 'script' && (!selectedIdea || !selectedNiche)) {
      setCurrentView(selectedNiche ? 'ideas' : 'niche-selector');
    }
  }, [currentView, selectedNiche, selectedIdea]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  
  const handleNicheSelect = (niche: Niche) => {
    setSelectedNiche(niche);
    setError(null);
    setIdeas([]);
    setSelectedIdea(null);
    setCurrentView('ideas');
  };

  const handleBackToNiches = () => {
    setSelectedNiche(null);
    setSelectedIdea(null);
    setIdeas([]);
    setCurrentView('niche-selector');
  };

  const handleGenerateIdeas = useCallback(async (theme: string, language: Language) => {
    if (!selectedNiche) {
        setError("Silakan pilih niche terlebih dahulu.");
        return;
    }
    if (!theme.trim()) {
      setError("Tema tidak boleh kosong.");
      return;
    }
    
    setIsLoadingIdeas(true);
    setError(null);
    setIdeas([]);
    setSelectedLanguage(language);

    try {
      const generatedIdeas = await generateContentIdeas(theme, selectedNiche.id, language);
      setIdeas(generatedIdeas);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui.";
      setError(errorMessage);
    } finally {
      setIsLoadingIdeas(false);
    }
  }, [selectedNiche]);
  
  const handleSelectIdea = (idea: Idea) => {
    setSelectedIdea(idea);
    setCurrentView('script');
  };

  const handleBackToIdeas = () => {
    setSelectedIdea(null);
    setCurrentView('ideas');
  };
  
  const renderContent = () => {
    switch (currentView) {
      case 'niche-selector':
        return <NicheSelector niches={niches} onSelect={handleNicheSelect} />;
      case 'ideas':
        if (!selectedNiche) return null;
        return (
            <div className="animate-fade-in">
                <InputForm 
                    onGenerate={handleGenerateIdeas} 
                    isLoading={isLoadingIdeas}
                    selectedNicheName={selectedNiche.name}
                    selectedNicheId={selectedNiche.id}
                    onBackToNiches={handleBackToNiches}
                />
                
                <div className="mt-10">
                    {isLoadingIdeas && <LoadingSpinner />}
                    {error && <ErrorMessage message={error} />}
                    
                    {!isLoadingIdeas && !error && ideas.length === 0 && <WelcomeMessage />}

                    {!isLoadingIdeas && !error && ideas.length > 0 && (
                        <div className="space-y-6">
                            {ideas.map((idea, index) => (
                                <IdeaCard key={index} idea={idea} index={index} onSelect={handleSelectIdea} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
      case 'script':
        if (selectedIdea && selectedNiche) {
          return <ScriptView selectedIdea={selectedIdea} selectedNiche={selectedNiche} selectedLanguage={selectedLanguage} onBack={handleBackToIdeas} />;
        }
        return null;
      default:
        return null;
    }
  };


  if (!isAuthenticated) {
    return <PasswordScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />
        <main>
            {renderContent()}
        </main>
        
        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>Powered by Ipta Apipah - Mediacuan.com</p>
        </footer>
      </div>
    </div>
  );
}