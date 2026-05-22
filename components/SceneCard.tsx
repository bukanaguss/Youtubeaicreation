import React, { useState, useEffect, useRef } from 'react';
import type { Scene, AspectRatio } from '../types';
import { generateImageForScene, generateAudioForScene } from '../services/geminiService';
import { decode, decodeAudioData, audioBufferToUrl } from '../utils/audioUtils';

interface SceneCardProps {
  scene: Scene;
  index: number;
  voice: string;
  style: string;
  nicheId: string;
}

let audioContext: AudioContext | null = null;
const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  }
  return audioContext;
};

const aspectRatios: { label: string; value: AspectRatio }[] = [
  { label: 'Kotak (1:1)', value: '1:1' },
  { label: 'Lanskap (16:9)', value: '16:9' },
  { label: 'Potret (9:16)', value: '9:16' },
  { label: 'Klasik (4:3)', value: '4:3' },
  { label: 'Vertikal (3:4)', value: '3:4' },
];

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const SceneCard: React.FC<SceneCardProps> = ({ scene, index, voice, style, nicheId }) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [sceneRatio, setSceneRatio] = useState<AspectRatio>('16:9');

  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);

  const [visualPrompt, setVisualPrompt] = useState(scene.visual_prompt);
  const [voiceOverScript, setVoiceOverScript] = useState(scene.voice_over_script);
  
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Reference Image State
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setVisualPrompt(scene.visual_prompt);
    setVoiceOverScript(scene.voice_over_script);
  }, [scene]);

  const handleCopy = (text: string, type: 'prompt' | 'script') => {
    navigator.clipboard.writeText(text);
    if (type === 'prompt') {
        setCopiedPrompt(true);
        setTimeout(() => setCopiedPrompt(false), 2000);
    } else {
        setCopiedScript(true);
        setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReferenceImage = () => {
    setReferenceImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    setGeneratedImage(null);
    setImageError(null);
    try {
      let finalPrompt = visualPrompt;
      if (nicheId === 'animasi-anak' && !finalPrompt.includes('3D Disney Pixar')) {
          finalPrompt += ", 3D Disney Pixar style, cute, vibrant";
      }
      const base64Image = await generateImageForScene(finalPrompt, sceneRatio, referenceImage || undefined);
      setGeneratedImage(`data:image/jpeg;base64,${base64Image}`);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Gagal menghasilkan gambar.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateAudio = async () => {
    setIsGeneratingAudio(true);
    setGeneratedAudioUrl(null);
    setAudioError(null);
    try {
      const base64Audio = await generateAudioForScene(voiceOverScript, voice, style);
      const audioBytes = decode(base64Audio);
      const ctx = getAudioContext();
      const audioBuffer = await decodeAudioData(audioBytes, ctx, 24000, 1);
      const url = audioBufferToUrl(audioBuffer);
      setGeneratedAudioUrl(url);
    } catch (err) {
      setAudioError(err instanceof Error ? err.message : "Gagal menghasilkan audio.");
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden animate-fade-in">
      <div className="p-4 bg-slate-800/50 flex justify-between items-center border-b border-slate-700">
        <div>
          <h4 className="text-xs font-bold text-purple-400">ADEGAN {scene.scene_number}</h4>
          <p className="text-lg font-semibold text-slate-100 mt-1">{scene.scene_title}</p>
        </div>
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-8">
        {/* KOLOM VISUAL */}
        <div className="space-y-4">
          <div className="space-y-2">
             <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gambar Referensi (Opsi)</label>
                {referenceImage && (
                   <button onClick={removeReferenceImage} className="text-[10px] text-red-400 hover:text-red-300">Hapus</button>
                )}
             </div>
             
             {!referenceImage ? (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 border-2 border-dashed border-slate-600 rounded-md text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all flex flex-col items-center gap-1 group"
                >
                  <ImageIcon />
                  <span className="text-xs font-medium">Upload referensi tokoh/karakter</span>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </button>
             ) : (
                <div className="relative group aspect-video w-full overflow-hidden rounded-md border border-blue-500/50 shadow-lg shadow-blue-500/10">
                   <img src={referenceImage} alt="Reference" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => fileInputRef.current?.click()} className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/30">Ganti</button>
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                   </div>
                </div>
             )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visual Prompt</label>
               <button onClick={() => handleCopy(visualPrompt, 'prompt')} className="text-slate-400 hover:text-white transition-colors p-1">
                  {copiedPrompt ? <CheckIcon /> : <CopyIcon />}
               </button>
            </div>
            <textarea 
              value={visualPrompt} 
              onChange={(e) => setVisualPrompt(e.target.value)} 
              className="w-full p-3 bg-slate-900/70 rounded-md border border-slate-600 text-slate-300 text-sm italic min-h-[100px] outline-none focus:border-blue-500 transition-colors" 
              placeholder="Deskripsikan visual adegan..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rasio Aspek</label>
            <div className="flex flex-wrap gap-2">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.value}
                  onClick={() => setSceneRatio(ratio.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    sceneRatio === ratio.value
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleGenerateImage} 
            disabled={isGeneratingImage} 
            className="w-full py-2.5 px-4 rounded-md font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 shadow-md transition-all active:scale-[0.98]"
          >
            {isGeneratingImage ? 'Sedang Melukis...' : 'Hasilkan Gambar'}
          </button>

          <div className="mt-2 aspect-video bg-slate-900 rounded-md flex items-center justify-center border border-slate-700 relative overflow-hidden shadow-inner">
            {isGeneratingImage && (
               <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-3 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[10px] text-slate-500 font-mono">RENDERING...</span>
               </div>
            )}
            {imageError && <p className="text-[10px] text-red-400 p-2 text-center">{imageError}</p>}
            {generatedImage && (
              <>
                <img src={generatedImage} alt="Scene" className="w-full h-full object-contain"/>
                <div className="absolute top-2 right-2 flex gap-2">
                    <a href={generatedImage} download={`scene_${scene.scene_number}.jpg`} className="p-1.5 bg-slate-900/70 backdrop-blur-md rounded-full text-white hover:bg-blue-600 transition-colors">
                      <DownloadIcon />
                    </a>
                </div>
              </>
            )}
            {!isGeneratingImage && !generatedImage && !imageError && <p className="text-slate-600 text-xs font-medium italic">Hasil gambar akan muncul di sini</p>}
          </div>
        </div>

        {/* KOLOM NARASI */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Narasi Voice-Over</label>
               <button onClick={() => handleCopy(voiceOverScript, 'script')} className="text-slate-400 hover:text-white transition-colors p-1">
                  {copiedScript ? <CheckIcon /> : <CopyIcon />}
               </button>
            </div>
            <textarea 
              value={voiceOverScript} 
              onChange={(e) => setVoiceOverScript(e.target.value)} 
              className="w-full p-3 bg-slate-900/70 rounded-md border border-slate-600 text-slate-100 text-sm min-h-[140px] outline-none focus:border-green-500 transition-colors" 
              placeholder="Tulis naskah yang akan dibacakan..."
            />
          </div>

          <button 
            onClick={handleGenerateAudio} 
            disabled={isGeneratingAudio} 
            className="w-full py-2.5 px-4 rounded-md font-bold text-white bg-green-600 hover:bg-green-700 disabled:bg-slate-700 shadow-md transition-all active:scale-[0.98]"
          >
            {isGeneratingAudio ? 'Merekam Suara...' : 'Hasilkan Audio'}
          </button>

          {generatedAudioUrl && (
             <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700 animate-fade-in">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Audio Pratinjau</span>
                    <a href={generatedAudioUrl} download={`audio_scene_${scene.scene_number}.wav`} className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1">
                        <DownloadIcon /> Download
                    </a>
                 </div>
                 <audio controls src={generatedAudioUrl} className="w-full h-8 rounded-md"></audio>
             </div>
          )}
          {!isGeneratingAudio && !generatedAudioUrl && !audioError && (
             <div className="p-8 border border-dashed border-slate-700 rounded-lg flex items-center justify-center">
                 <p className="text-slate-600 text-xs italic">Siap untuk menghasilkan audio narasi</p>
             </div>
          )}
          {isGeneratingAudio && (
             <div className="p-8 bg-slate-900/30 rounded-lg border border-slate-700 flex flex-col items-center gap-3">
                <div className="flex gap-1 h-4 items-center">
                   {[1,2,3,4,5].map(i => <div key={i} className="w-1 bg-green-500 rounded-full animate-bounce" style={{animationDelay: `${i*0.1}s`, height: `${Math.random()*100 + 20}%`}}></div>)}
                </div>
                <span className="text-[10px] text-green-500 font-mono animate-pulse">GENERATING AUDIO...</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SceneCard;