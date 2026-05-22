import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { Idea, Scene, PreProductionAssets, Language, AspectRatio } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ideaSchema = {
  type: Type.OBJECT,
  properties: {
    ideas: {
      type: Type.ARRAY,
      description: "Array dari 3 ide konten video.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { 
            type: Type.STRING, 
            description: 'Judul video yang clickbait tapi elegan.' 
          },
          angle: { 
            type: Type.STRING, 
            description: 'Angle atau fokus penceritaan yang unik dan berbeda dari yang lain.' 
          },
          hook: { 
            type: Type.STRING, 
            description: 'Satu kalimat pembuka yang kuat untuk 5 detik pertama.' 
          }
        },
        required: ["title", "angle", "hook"]
      }
    }
  }
};

const scriptSchema = {
  type: Type.ARRAY,
  description: "Array dari adegan-adegan untuk naskah video.",
  items: {
    type: Type.OBJECT,
    properties: {
      scene_number: {
        type: Type.INTEGER,
        description: 'Nomor urut adegan, dimulai dari 1.'
      },
      scene_title: {
        type: Type.STRING,
        description: 'Judul singkat adegan.'
      },
      visual_prompt: {
        type: Type.STRING,
        description: 'Deskripsi visual yang sangat detail dalam BAHASA INDONESIA untuk AI generator gambar. PENTING: Untuk menjaga konsistensi karakter, ANDA HARUS mendeskripsikan ulang penampilan fisik karakter utama di SETIAP ADEGAN menggunakan kata-kata bahasa Indonesia.'
      },
      voice_over_script: {
        type: Type.STRING,
        description: 'Teks narasi lengkap yang akan dibacakan untuk adegan ini. HARUS dalam bahasa yang diminta. Jaga panjang teks per adegan agar durasi video terpenuhi.'
      }
    },
    required: ["scene_number", "scene_title", "visual_prompt", "voice_over_script"]
  }
};

const preProductionAssetsSchema = {
  type: Type.OBJECT,
  properties: {
    titles: {
      type: Type.ARRAY,
      description: "Array dari 3 alternatif judul video yang sangat menarik dan clickbait.",
      items: { type: Type.STRING }
    },
    thumbnail_prompt: {
      type: Type.STRING,
      description: "Prompt deskriptif dan sinematik dalam BAHASA INDONESIA untuk AI image generator."
    },
    thumbnail_text: {
      type: Type.STRING,
      description: "Teks singkat (2-5 kata) dan kuat untuk diletakkan di atas thumbnail. Harus memancing rasa penasaran."
    },
    description: {
      type: Type.STRING,
      description: "Deskripsi video YouTube yang menarik, SEO-friendly, mengandung kata kunci, dan merangkum isi video secara profesional."
    },
    hashtags: {
      type: Type.ARRAY,
      description: "Array berisi 5-7 hashtag populer dan relevan dengan topik video.",
      items: { type: Type.STRING }
    }
  },
  required: ["titles", "thumbnail_prompt", "thumbnail_text", "description", "hashtags"]
};

const getNicheConfig = (nicheId: string) => {
    const configs: { [key: string]: any } = {
        'berita-politik': {
            idea: {
                persona: "Anda adalah seorang jurnalis senior, analis politik, dan produser dokumenter berita.",
                aturan: "Fokus pada pembuatan ide video liputan atau analisis berita politik yang tajam dan informatif. Hook harus langsung ke inti masalah dengan kalimat yang mengejutkan atau menyoroti konflik utama (misalnya: 'Di tengah memanasnya suhu politik, satu keputusan mengejutkan baru saja diambil...'). Gunakan bahasa Indonesia jurnalistik yang baku."
            },
            script: {
                persona: "Seorang narator berita profesional dengan gaya investigasi/dokumenter.",
                aturan: `Gaya Bahasa: Tegas, lugas, profesional, dan bergaya investigasi/dokumenter. Gunakan Bahasa Indonesia jurnalistik yang baku namun tetap enak didengar. Sampaikan kronologi, analisis, atau dampak secara objektif.
                
                Aturan Khusus Visual Prompt (image_prompt):
                1. WAJIB menggunakan Bahasa Indonesia.
                2. Deskripsi Aksi: Jelaskan suasana, tokoh politik (secara umum), gedung pemerintahan, massa, atau grafis konseptual yang mewakili topik berita.
                3. Setiap image_prompt WAJIB diakhiri dengan kalimat baku ini: ", high-quality photojournalism, documentary style, realistic photography, sharp focus, news broadcast aesthetic, dramatic lighting, highly detailed, 8k resolution, no text, no watermark."`
            }
        },
        'hewan-peliharaan': {
            idea: {
                persona: "Anda adalah pakar psikologi hewan peliharaan dan penulis naskah YouTube.",
                aturan: "Fokus pada pembuatan ide video yang menjelaskan perilaku unik hewan peliharaan (anjing/kucing) dengan cara yang hangat dan berempati. Hook harus sangat memancing rasa penasaran (misalnya: 'Pernahkah kamu bingung kenapa kucingmu suka menatap dinding kosong?'). Gunakan bahasa Indonesia yang mengalir santai."
            },
            script: {
                persona: "Narator pecinta hewan yang hangat, berempati, dan edukatif.",
                aturan: `Gaya Bahasa: Gunakan Bahasa Indonesia yang mengalir santai, hangat, dan mudah dipahami. Anggap audiens sebagai sesama pecinta hewan. Berikan penjelasan ilmiah atau psikologis yang masuk akal di balik perilaku hewan.
                
                Aturan Khusus Visual Prompt (image_prompt):
                1. WAJIB menggunakan Bahasa Indonesia.
                2. Deskripsi Aksi: Jelaskan apa yang dilakukan hewan dan pemiliknya dengan detail yang relevan dengan narasi di scene tersebut.
                3. Setiap image_prompt WAJIB diakhiri dengan kalimat baku ini: ", 2D flat vector illustration, minimalist style, warm and pastel colors, cute and expressive character, mindful paws aesthetic, clean white background, no text, no watermark."`
            }
        },
        'spiritual-indonesia': {
            idea: {
                persona: "Anda adalah seorang budayawan, sejarawan, dan pencerita ulung yang ahli dalam legenda, mitologi, sejarah tersembunyi, dan ilmu spiritual Nusantara kuno (Sunda, Jawa, dsb).",
                aturan: "Fokus pada pembuatan konsep video misteri yang memikat, epik, dan terasa sakral. Judul harus dramatis. Hook WAJIB 5 detik pertama sangat mencekam atau memicu ketegangan (misalnya: 'Jika Anda memiliki salah satu dari 3 tanda ini, Anda bukanlah orang sembarangan. Darah leluhur Pajajaran bangkit dalam diri Anda...'). Gunakan bahasa Indonesia baku namun epik."
            },
            script: {
                persona: "Seorang tetua Nusantara yang bijaksana, pencerita ulung yang sedang menurunkan ilmu luhur kepada generasi penerus.",
                aturan: `Gaya Bahasa: Dramatis, penuh teka-teki, berwibawa, dan sedikit puitis. Gunakan Bahasa Indonesia baku namun epik. Sesekali gunakan istilah-istilah kuno yang relevan (misal: karuhun, pusaka, leluhur).
                
                Aturan Khusus Visual Prompt (image_prompt):
                1. WAJIB menggunakan Bahasa Indonesia.
                2. Deskripsi Aksi: Jelaskan sosok tokoh (seperti pertapa, leluhur, atau harimau putih), benda pusaka, atau latar tempat (candi kuno, hutan gelap) dengan sangat detail.
                3. Setiap image_prompt WAJIB diakhiri dengan kalimat baku ini: ", hyper-realistic, dark cinematic lighting, mysterious aura, highly detailed, Indonesian ancient esoteric aesthetic, glowing eyes, dramatic shadows, mystical atmosphere, 8k resolution, no text, no watermark."`
            }
        },
        'edukasi-agama': {
            idea: {
                persona: "Anda adalah Pakar Edukasi Agama dan Teolog yang bijaksana.",
                aturan: "Fokus pada ilmu, nilai, dan hikmah keagamaan. WAJIB mengikuti agama yang tersirat dalam ide pengguna (Islam/Kristen/Buddha/dll). Jangan mencampur ajaran. Gunakan bahasa yang netral, menenangkan, dan tidak provokatif."
            },
            script: {
                persona: "Narator edukasi agama yang tenang, hormat, dan berefleksi.",
                aturan: "Gunakan narasi SATU ARAH (Voice Over). JANGAN GUNAKAN DIALOG. Gunakan frasa pengaman seperti 'berdasarkan kitab suci' atau 'menurut ajaran agama ini'. Hindari opini ekstrem. Visual Prompt Bahasa Indonesia: deskripsikan arsitektur tempat ibadah yang agung, simbol keagamaan, alam yang tenang, atau orang yang sedang beribadah dengan khidmat."
            }
        },
        'edukasi-kesehatan': {
            idea: {
                persona: "Anda adalah Pakar Edukasi Kesehatan dan Storyteller Medis profesional.",
                aturan: "Fokus pada informasi medis yang informatif, bertanggung jawab, dan mudah dipahami orang awam. Mulai dengan fakta atau kebiasaan sepele yang berdampak besar bagi kesehatan. Hindari klaim berlebihan tanpa penjelasan logis."
            },
            script: {
                persona: "Narator edukasi kesehatan profesional dengan suara tenang, meyakinkan, dan berwibawa.",
                aturan: "Gunakan narasi SATU ARAH (Voice Over). JANGAN GUNAKAN DIALOG. Gunakan frasa seperti 'berdasarkan penjelasan medis' atau 'menurut edukasi kesehatan'. Sertakan penjelasan sebab-akibat medis yang logis. Visual Prompt Bahasa Indonesia: deskripsikan ilustrasi anatomi tubuh yang bersih, gaya hidup sehat (makan buah, olahraga), lingkungan medis yang modern/minimalis, atau visual mikroskopis sel tubuh."
            }
        },
        'cerita-horor': {
            idea: {
                persona: "Anda adalah seorang Content Strategist dan Penulis Cerita Horor profesional.",
                aturan: "Fokus pada atmosfer gelap, mencekam, tegang, dan penuh misteri. Gunakan urban legend atau kisah mistis yang membuat audiens merasa tidak nyaman namun penasaran."
            },
            script: {
                persona: "Narator horor legendaris dengan gaya storytelling mencekam.",
                aturan: "Gunakan narasi SATU ARAH (Voice Over). Hindari dialog antar karakter. Visual Prompt Bahasa Indonesia: deskripsikan bayangan gelap, kabut tebal, cahaya remang-remang, ekspresi wajah ketakutan, dan lokasi yang angker secara detail."
            }
        },
        'dracin': {
            idea: {
                persona: "Anda adalah seorang Content Strategist ahli Drama China (Dracin).",
                aturan: "Fokus pada drama, pengkhianatan, dan kemewahan. Judul harus emosional."
            },
            script: {
                persona: "Penulis naskah rekapan Dracin profesional.",
                aturan: "Visual Prompt WAJIB Bahasa Indonesia. Deskripsikan ekspresi wajah sedih/marah, pakaian mewah tradisional atau modern, dan pencahayaan dramatis."
            }
        },
        'animasi-anak': {
            idea: {
                persona: "Penulis cerita anak dan animator profesional.",
                aturan: "Cerita mendidik, ceria, dan aman. Fokus pada petualangan lucu."
            },
            script: {
                persona: "Penulis naskah animasi anak.",
                aturan: "Visual Prompt Bahasa Indonesia. Deskripsikan karakter hewan atau anak kecil yang lucu, warna-warna cerah (vibrant), dan gaya 3D Disney Pixar."
            }
        },
        'kisah-islami': {
            idea: {
                persona: "Sejarawan dan pakar konten Islami.",
                aturan: "Kisah harus akurat secara sejarah, penuh hikmah, dan menyentuh hati."
            },
            script: {
                persona: "Penulis naskah dokumenter sejarah Islam.",
                aturan: "Visual Prompt Bahasa Indonesia. Deskripsikan suasana gurun, arsitektur kuno, pakaian tradisional Arab/Timur Tengah, dan atmosfer yang agung/epik."
            }
        },
        'misteri-konspirasi': {
            idea: {
                persona: "Penyelidik fenomena misteri dan konspirasi dunia.",
                aturan: "Gunakan teori yang memancing rasa penasaran, gelap, dan sedikit menegangkan."
            },
            script: {
                persona: "Penulis naskah horor/misteri sinematik.",
                aturan: "Visual Prompt Bahasa Indonesia. Deskripsikan bayangan gelap, kabut, cahaya redup, ekspresi terkejut, dan suasana mencekam."
            }
        },
        'psikologi-selfdev': {
          idea: {
              persona: "Pakar psikologi dan pengembangan diri.",
              aturan: "Gunakan pendekatan ilmiah yang mudah dipahami. Fokus pada solusi masalah hidup."
          },
          script: {
              persona: "Narator podcast motivasi.",
              aturan: "Visual Prompt Bahasa Indonesia. Deskripsikan suasana tenang, simbolisme pikiran (seperti cahaya atau awan), dan orang yang sedang merenung atau sukses."
          }
        },
        'edukasi-sains': {
          idea: {
              persona: "Komunikator sains (Science Communicator).",
              aturan: "Menjelaskan konsep rumit dengan analogi sederhana dan menarik."
          },
          script: {
              persona: "Penulis naskah video dokumenter sains.",
              aturan: "Visual Prompt Bahasa Indonesia. Deskripsikan objek mikroskopis, luar angkasa, diagram futuristik, atau laboratorium canggih."
          }
        },
        'bisnis-marketing': {
          idea: {
              persona: "Analis bisnis dan strategi pemasaran global.",
              aturan: "Gunakan data, studi kasus perusahaan besar, dan strategi viral."
          },
          script: {
              persona: "Narator konten bisnis profesional.",
              aturan: "Visual Prompt Bahasa Indonesia. Deskripsikan gedung pencakar langit, orang sukses berpakaian formal, grafik pertumbuhan, dan suasana kantor modern."
          }
        },
        'biografi': {
          idea: {
              persona: "Penulis biografi tokoh dunia.",
              aturan: "Fokus pada sisi manusiawi tokoh, perjuangan mereka, dan warisan yang ditinggalkan."
          },
          script: {
              persona: "Narator sejarah biografi.",
              aturan: "Visual Prompt Bahasa Indonesia. Deskripsikan latar waktu sejarah yang sesuai, potret wajah tokoh yang detail, dan momen krusial dalam hidup mereka."
          }
        },
        'sport-olahraga': {
          idea: {
              persona: "Analis olahraga dan jurnalis sport.",
              aturan: "Fokus pada taktik, momen epik, dan semangat juang atlet."
          },
          script: {
              persona: "Komentator olahraga legendaris.",
              aturan: "Visual Prompt Bahasa Indonesia. Deskripsikan stadion megah, gerakan atlet yang dinamis, ekspresi kemenangan/kecalahan, dan riuh penonton."
          }
        }
    };
    return configs[nicheId] || configs['misteri-konspirasi'];
};

const getTargetSceneCount = (duration: string): number => {
    const d = parseInt(duration);
    if (d === 1) return 4;
    if (d === 5) return 8;
    if (d === 10) return 15;
    if (d === 15) return 23;
    if (d === 20) return 30;
    if (d === 30) return 45;
    return 15; // default
};

export const generateContentIdeas = async (theme: string, nicheId: string, language: Language): Promise<Idea[]> => {
  const config = getNicheConfig(nicheId);
  const langNames = { id: 'Bahasa Indonesia', en: 'English', ms: 'Bahasa Melayu' };
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Tema: "${theme}". Niche: "${nicheId}". Bahasa: ${langNames[language]}.
    ${config.idea.persona}
    Aturan: ${config.idea.aturan}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: ideaSchema,
    },
  });

  const data = JSON.parse(response.text);
  return data.ideas;
};

export const generateScript = async (selectedIdea: Idea, duration: string, nicheId: string, language: Language): Promise<Scene[]> => {
  const config = getNicheConfig(nicheId);
  const langNames = { id: 'Bahasa Indonesia', en: 'English', ms: 'Bahasa Melayu' };
  const sceneCount = getTargetSceneCount(duration);

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `
      Buat naskah video lengkap berdasarkan ide ini:
      Judul: "${selectedIdea.title}"
      Angle: "${selectedIdea.angle}"
      Hook: "${selectedIdea.hook}"
      
      TARGET DURASI: ${duration} menit.
      WAJIB MENGHASILKAN TEPAT ${sceneCount} ADEGAN (SCENES).
      
      Bahasa Narasi (Voice Over): ${langNames[language]}.
      Bahasa Visual Prompt: WAJIB BAHASA INDONESIA.
      Niche: ${nicheId}.
      
      ${config.script.persona}
      Aturan Khusus:
      - ${config.script.aturan}
      - Pastikan narasi (voice_over_script) setiap adegan cukup panjang dan mengalir untuk mengisi total durasi ${duration} menit.
      - JANGAN GUNAKAN DIALOG ANTAR KARAKTER. Gunakan narasi tidak langsung.
      - Visual Prompt harus sangat detail dalam Bahasa Indonesia agar AI Image Generator bisa bekerja maksimal.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: scriptSchema,
    },
  });

  return JSON.parse(response.text);
};

export const generatePreProductionAssets = async (selectedIdea: Idea, nicheId: string, language: Language): Promise<PreProductionAssets> => {
  const config = getNicheConfig(nicheId);
  const langNames = { id: 'Bahasa Indonesia', en: 'English', ms: 'Bahasa Melayu' };

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `
      Hasilkan aset pra-produksi untuk ide video ini:
      Judul Ide: "${selectedIdea.title}"
      Angle: "${selectedIdea.angle}"
      Bahasa: ${langNames[language]}.
      
      PENTING:
      - Field 'thumbnail_prompt' WAJIB dalam BAHASA INDONESIA yang sinematik.
      - Field 'thumbnail_text' harus singkat (2-5 kata) dan sangat memancing rasa penasaran (clickbait berkelas).
      - Deskripsi video harus SEO-friendly dengan kata kunci relevan.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: preProductionAssetsSchema,
    },
  });

  return JSON.parse(response.text);
};

export const generateImageForScene = async (prompt: string, aspectRatio: AspectRatio = "16:9", referenceImage?: string): Promise<string> => {
  const parts: any[] = [{ text: prompt }];
  
  if (referenceImage) {
    const base64Data = referenceImage.split(',')[1];
    parts.push({
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg'
      }
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio
      }
    }
  });

  let base64 = "";
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      base64 = part.inlineData.data;
    }
  }

  if (!base64) throw new Error("Gagal menghasilkan gambar dari model.");
  return base64;
};

export const generateAudioForScene = async (text: string, voiceName: string, style: string): Promise<string> => {
  const prompt = `Ucapkan kalimat berikut dengan gaya ${style}: ${text}`;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Gagal menghasilkan audio dari model.");
  return base64Audio;
};