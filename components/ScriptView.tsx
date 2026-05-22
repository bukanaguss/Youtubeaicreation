import React, { useState, useEffect, useRef } from 'react';
import type { Idea, Scene, PreProductionAssets, Niche, Language, AspectRatio } from '../types';
import { generateScript, generatePreProductionAssets, generateImageForScene } from '../services/geminiService';
import SceneCard from './SceneCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface ScriptViewProps {
  selectedIdea: Idea;
  selectedNiche: Niche;
  selectedLanguage: Language;
  onBack: () => void;
}

// Gunakan ID unik untuk setiap opsi agar dropdown tidak reset/snapping ke Siti
const voiceOptions = [
  // Pria
  { id: 'v-denny', name: 'Pria (Berat & Dramatis) - Denny', voice: 'Fenrir', style: 'heavy and dramatic' },
  { id: 'v-doni', name: 'Pria (Jelas & Enerjik) - Doni', voice: 'Puck', style: 'clear and energetic' },
  { id: 'v-budi', name: 'Pria (Tenang & Informatif) - Budi', voice: 'Charon', style: 'calm and informative' },
  { id: 'v-andi', name: 'Pria (Formal & Otoritatif) - Andi', voice: 'Zephyr', style: 'formal and authoritative' },
  // Wanita
  { id: 'v-siti', name: 'Wanita (Lembut & Ramah) - Siti', voice: 'Kore', style: 'soft and friendly' },
  { id: 'v-ani', name: 'Wanita (Ceria & Jelas) - Ani', voice: 'Kore', style: 'cheerful and clear' },
  { id: 'v-ratna', name: 'Wanita (Hangat & Keibuan) - Ibu Ratna', voice: 'Kore', style: 'warm and motherly' },
  { id: 'v-sari', name: 'Wanita (Tenang & Bijak) - Ibu Sari', voice: 'Kore', style: 'calm and wise' },
];

const aspectRatios: { label: string; value: AspectRatio }[] = [
  { label: 'Kotak (1:1)', value: '1:1' },
  { label: 'Lanskap (16:9)', value: '16:9' },
  { label: 'Potret (9:16)', value: '9:16' },
  { label: 'Klasik (4:3)', value: '4:3' },
  { label: 'Vertikal (3:4)', value: '3:4' },
];

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ScriptView: React.FC<ScriptViewProps> = ({ selectedIdea, selectedNiche, selectedLanguage, onBack }) => {
  const [duration, setDuration] = useState('10');
  const [script, setScript] = useState<Scene[] | null>(null);
  const [isLoadingScript, setIsLoadingScript] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);

  const [assets, setAssets] = useState<PreProductionAssets | null>(null);
  const [editableThumbnailPrompt, setEditableThumbnailPrompt] = useState('');
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  const [assetsError, setAssetsError] = useState<string | null>(null);

  const [thumbnailImage, setThumbnailImage] = useState<string | null>(null);
  const [isGeneratingThumbnail, setIsLoadingThumbnail] = useState(false);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [thumbnailRatio, setThumbnailRatio] = useState<AspectRatio>('16:9');

  const [thumbnailRefImage, setThumbnailRefImage] = useState<string | null>(null);
  const thumbFileInputRef = useRef<HTMLInputElement>(null);

  // Simpan ID pilihan suara, bukan value mentahnya
  const [selectedVoiceId, setSelectedVoiceId] = useState(voiceOptions[0].id);
  const [customStyle, setCustomStyle] = useState('');

  const [copiedDescription, setCopiedDescription] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [copiedThumbText, setCopiedThumbText] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoadingAssets(true);
      setAssetsError(null);
      try {
        const generatedAssets = await generatePreProductionAssets(selectedIdea, selectedNiche.id, selectedLanguage);
        setAssets(generatedAssets);
        setEditableThumbnailPrompt(generatedAssets.thumbnail_prompt);
      } catch (err) {
        setAssetsError(err instanceof Error ? err.message : "Gagal memuat aset pra-produksi.");
      } finally {
        setIsLoadingAssets(false);
      }
    };
    fetchAssets();
  }, [selectedIdea, selectedNiche, selectedLanguage]);

  const handleGenerateScript = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingScript(true);
    setScriptError(null);
    setScript(null);
    try {
      const generatedScript = await generateScript(selectedIdea, duration, selectedNiche.id, selectedLanguage);
      setScript(generatedScript);
    } catch (err) {
      setScriptError(err instanceof Error ? err.message : "Gagal membuat naskah.");
    } finally {
      setIsLoadingScript(false);
    }
  };

  const handleThumbImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailRefImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbRefImage = () => {
    setThumbnailRefImage(null);
    if (thumbFileInputRef.current) thumbFileInputRef.current.value = '';
  };

  const handleGenerateThumbnail = async () => {
    if (!editableThumbnailPrompt) return;
    setIsLoadingThumbnail(true);
    setThumbnailImage(null);
    setThumbnailError(null);
    try {
        let prompt = editableThumbnailPrompt;
        if (selectedNiche.id === 'animasi-anak' && !prompt.includes('3D Disney Pixar')) {
             prompt += ", 3D Disney Pixar Animation style, cute, vibrant, high quality";
        }
        const base64Image = await generateImageForScene(prompt, thumbnailRatio, thumbnailRefImage || undefined);
        setThumbnailImage(`data:image/jpeg;base64,${base64Image}`);
    } catch (err) {
        setThumbnailError(err instanceof Error ? err.message : "Gagal menghasilkan thumbnail.");
    } finally {
        setIsLoadingThumbnail(false);
    }
  };

  const handleCopyText = (text: string, type: 'desc' | 'tag' | 'thumb') => {
    navigator.clipboard.writeText(text);
    if (type === 'desc') {
        setCopiedDescription(true);
        setTimeout(() => setCopiedDescription(false), 2000);
    } else if (type === 'tag') {
        setCopiedHashtags(true);
        setTimeout(() => setCopiedHashtags(false), 2000);
    } else if (type === 'thumb') {
        setCopiedThumbText(true);
        setTimeout(() => setCopiedThumbText(false), 2000);
    }
  };

  // Cari data suara berdasarkan ID yang dipilih
  const currentVoiceConfig = voiceOptions.find(v => v.id === selectedVoiceId) || voiceOptions[0];

  return (
    <div className="animate-fade-in">
      <button 
        onClick={onBack} 
        className="mb-6 flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Kembali ke Ide
      </button>
      
      <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-8 space-y-4">
        <div>
          <p className="text-sm text-blue-400 font-semibold uppercase tracking-wider">Ide Terpilih</p>
          <h2 className="text-2xl font-bold text-slate-100 mt-1">{selectedIdea.title}</h2>
        </div>
        
        <div>
          <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider">Angle Penceritaan</p>
          <p className="text-slate-300 mt-1 text-sm leading-relaxed">{selectedIdea.angle}</p>
        </div>

        <div className="pt-2 border-t border-slate-700/50">
          <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider">Hook Pembuka</p>
          <p className="text-slate-100 mt-1 text-md font-medium italic">"{selectedIdea.hook}"</p>
        </div>
      </div>

      {isLoadingAssets && <LoadingSpinner />}
      {assetsError && <ErrorMessage message={assetsError} />}
      {assets && (
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 mb-8 animate-fade-in">
            <h3 className="text-xl font-bold text-slate-100 mb-4 border-b border-slate-700 pb-2">Aset Pra-Produksi</h3>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-purple-400 mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                          Alternatif Judul
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-slate-300 bg-slate-900/40 p-3 rounded-md border border-slate-700/50">
                            {assets.titles.map((title, i) => <li key={i}>{title}</li>)}
                        </ul>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                           <h4 className="font-semibold text-purple-400 flex items-center">
                             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                             Deskripsi Video
                           </h4>
                           <button onClick={() => handleCopyText(assets.description, 'desc')} className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded transition-colors">
                             {copiedDescription ? 'Tersalin!' : 'Salin'}
                           </button>
                        </div>
                        <div className="p-3 bg-slate-900/70 rounded-md border border-slate-600 max-h-40 overflow-y-auto text-sm text-slate-300">
                            {assets.description}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                           <h4 className="font-semibold text-purple-400 flex items-center">
                             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path></svg>
                             Hashtag
                           </h4>
                           <button onClick={() => handleCopyText(assets.hashtags.join(' '), 'tag')} className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded transition-colors">
                             {copiedHashtags ? 'Tersalin!' : 'Salin'}
                           </button>
                        </div>
                        <div className="p-2 bg-slate-900/70 rounded-md border border-slate-600 text-sm text-blue-400 font-mono">
                            {assets.hashtags.join(' ')}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="font-semibold text-purple-400 mb-2">Thumbnail</h4>
                    
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Judul Teks Thumbnail</label>
                            <button onClick={() => handleCopyText(assets.thumbnail_text, 'thumb')} className="text-[10px] bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-0.5 rounded transition-colors">
                                {copiedThumbText ? 'Tersalin!' : 'Salin'}
                            </button>
                        </div>
                        <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-md text-blue-100 font-black text-center text-lg shadow-inner italic">
                            "{assets.thumbnail_text}"
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 italic">* Gunakan teks ini di dalam desain gambar thumbnail Anda.</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gambar Referensi (Opsi)</label>
                            {thumbnailRefImage && (
                                <button onClick={removeThumbRefImage} className="text-[10px] text-red-400 hover:text-red-300">Hapus</button>
                            )}
                        </div>
                        {!thumbnailRefImage ? (
                            <button 
                                onClick={() => thumbFileInputRef.current?.click()}
                                className="w-full py-3 px-4 border-2 border-dashed border-slate-600 rounded-md text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all flex flex-col items-center gap-1 group"
                            >
                                <ImageIcon />
                                <span className="text-xs font-medium">Upload referensi tokoh/karakter</span>
                                <input 
                                    type="file" 
                                    ref={thumbFileInputRef} 
                                    onChange={handleThumbImageUpload} 
                                    accept="image/*" 
                                    className="hidden" 
                                />
                            </button>
                        ) : (
                            <div className="relative group aspect-video w-full overflow-hidden rounded-md border border-blue-500/50 shadow-lg shadow-blue-500/10">
                                <img src={thumbnailRefImage} alt="Thumbnail Reference" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button onClick={() => thumbFileInputRef.current?.click()} className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/30">Ganti</button>
                                    <input type="file" ref={thumbFileInputRef} onChange={handleThumbImageUpload} accept="image/*" className="hidden" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prompt Visual</label>
                        <textarea
                            value={editableThumbnailPrompt}
                            onChange={(e) => setEditableThumbnailPrompt(e.target.value)}
                            className="w-full p-3 bg-slate-900/70 rounded-md border border-slate-600 text-slate-300 text-sm min-h-[100px] outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rasio Aspek</label>
                      <div className="flex flex-wrap gap-2">
                        {aspectRatios.map((ratio) => (
                          <button
                            key={ratio.value}
                            onClick={() => setThumbnailRatio(ratio.value)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                              thumbnailRatio === ratio.value
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                          >
                            {ratio.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button onClick={handleGenerateThumbnail} disabled={isGeneratingThumbnail} className="w-full text-sm py-2 px-4 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 transition-colors">
                        {isGeneratingThumbnail ? 'Membuat Gambar...' : 'Hasilkan Thumbnail'}
                    </button>
                    
                    <div className="mt-2 aspect-video bg-slate-900 rounded-md flex items-center justify-center border border-slate-700 relative overflow-hidden group">
                        {isGeneratingThumbnail && <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>}
                        {thumbnailError && <p className="text-xs text-red-400 p-2 text-center">{thumbnailError}</p>}
                        {thumbnailImage && (
                          <>
                            <img src={thumbnailImage} alt="Thumbnail" className="w-full h-full object-contain"/>
                            <a href={thumbnailImage} download="thumbnail.jpg" className="absolute top-2 right-2 p-2 bg-slate-900/60 rounded-full text-white">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </a>
                          </>
                        )}
                        {!isGeneratingThumbnail && !thumbnailImage && !thumbnailError && <p className="text-slate-500 text-sm">Pratinjau Gambar</p>}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* GLOBAL VOICE SETTINGS */}
      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-8 backdrop-blur-sm shadow-lg animate-fade-in">
          <h4 className="text-md font-bold text-slate-100 mb-3 text-center">Pengaturan Narasi</h4>
          <div className="max-w-md mx-auto grid grid-cols-1 gap-4">
              <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Suara Narator</label>
                  <select 
                    value={selectedVoiceId} 
                    onChange={e => setSelectedVoiceId(e.target.value)} 
                    className="w-full text-sm p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100"
                  >
                    <optgroup label="Suara Pria">
                      {voiceOptions.slice(0, 4).map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                    </optgroup>
                    <optgroup label="Suara Wanita">
                      {voiceOptions.slice(4).map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                    </optgroup>
                  </select>
              </div>
              <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Gaya Bicara Tambahan (Opsi)</label>
                  <input 
                    type="text" 
                    value={customStyle} 
                    onChange={e => setCustomStyle(e.target.value)} 
                    placeholder="Contoh: sedih, penuh amarah" 
                    className="w-full text-sm p-2 bg-slate-700 border border-slate-600 rounded-md text-slate-100" 
                  />
                  <p className="text-[10px] text-slate-500 mt-1 italic">Sistem akan menggabungkan gaya pilihan karakter dengan input ini.</p>
              </div>
          </div>
      </div>

      {!script && !isLoadingScript && (
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-xl">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Buat Naskah Lengkap</h3>
          <form onSubmit={handleGenerateScript} className="space-y-4">
            <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-slate-100">
              <option value="1">1 menit (Shorts)</option>
              <option value="5">5 menit</option>
              <option value="10">10 menit</option>
              <option value="15">15 menit</option>
              <option value="20">20 menit</option>
              <option value="30">30 menit</option>
            </select>
            <button type="submit" className="w-full py-3 px-4 rounded-md font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors">
              Buat Naskah Video
            </button>
          </form>
        </div>
      )}

      {isLoadingScript && <LoadingSpinner />}
      {scriptError && <ErrorMessage message={scriptError} />}

      {script && (
        <div className="space-y-8 mt-10">
          <h3 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">Naskah Video</h3>
          <div className="bg-yellow-900/40 border border-yellow-700 text-yellow-100 px-6 py-4 rounded-lg flex items-center gap-3 animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 flex-shrink-0 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.662 1.57-3.098L13.132 4.098c-.932-1.436-2.97-1.436-3.9 0L2.66 16.902c-.932 1.436.04 3.098 1.57 3.098z" />
              </svg>
              <div>
                  <p className="font-bold text-md mb-1">⚠️ Wajib Dibaca</p>
                  <p className="text-sm">Jangan generate gambar & voice over untuk semua adegan sekaligus. Lakukan per adegan (scene-by-scene) dan beri jeda 30-60 detik sebelum lanjut ke adegan berikutnya.</p>
              </div>
          </div>
          {script.map((scene, index) => (
            <SceneCard 
              key={scene.scene_number} 
              scene={scene} 
              index={index} 
              voice={currentVoiceConfig.voice} 
              style={`${currentVoiceConfig.style}${customStyle ? ', ' + customStyle : ''}`} 
              nicheId={selectedNiche.id} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ScriptView;