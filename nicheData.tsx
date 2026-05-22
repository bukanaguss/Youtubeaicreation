import React from 'react';
import type { Niche } from './types';

// Icon components
const MysteryIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v.01" />
  </svg>
);

const KidsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

const IslamicIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c1.356 0 2.628-.29 3.756-.81M12 21c-1.356 0-2.628-.29-3.756-.81" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 3.75A5.968 5.968 0 0112 3c-1.632 0-3.13.68-4.244 1.75M15.75 3.75c1.116 1.07 1.756 2.612 1.756 4.244V11.25c0 2.222-1.343 4.14-3.32 5.01" />
  </svg>
);

const ScienceIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.66.54-1.192 1.2-1.192h.51c.66 0 1.2.532 1.2 1.192v.643c0 .66-.54 1.192-1.2 1.192h-.51c-.66 0-1.2-.532-1.2-1.192v-.643z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087C13.05 5.233 12 4.062 12 2.25c0-1.036-1.02-1.875-2.25-1.875S7.5 1.214 7.5 2.25c0 1.812-1.05 2.983-2.25 3.837" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12c0 5.21-4.25 9.375-9.375 9.375-4.84 0-8.813-3.8-9.33-8.625" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c0-5.21 4.25-9.375 9.375-9.375 4.84 0 8.813 3.8 9.33 8.625" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c0 2.923 1.343 5.52 3.375 7.21" />
  </svg>
);

const PsychologyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-2.25 3h5.25m-5.25 3h5.25M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
  </svg>
);

const BusinessIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.517L21.75 6M2.25 6l4.5 4.5M2.25 6h19.5M21.75 18h-12" />
  </svg>
);

const BiographyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const SportIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0V9.75m-5.007 0V9.75m5.007 0a3 3 0 01-3-3m-3 3a3 3 0 003-3m0 0a3 3 0 116 0v5.25a3 3 0 01-3 3h-3a3 3 0 01-3-3V6.75a3 3 0 116 0z" />
  </svg>
);

const DracinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75l-1.5-1.5M12 18.75l1.5-1.5" />
  </svg>
);

const HorrorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M4.22 4.22l1.06 1.06M18.72 18.72l1.06 1.06M3 12h1.5M19.5 12H21M4.22 19.78l1.06-1.06M18.72 5.28l1.06-1.06M12 9a3 3 0 100 6 3 3 0 000-6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25C6.615 2.25 2.25 6.615 2.25 12c0 1.5.34 2.92.946 4.19.143.3.1.65-.11.9a1.5 1.5 0 00-.336 1.16c.112.928.98 1.5 1.9 1.5h14.5c.92 0 1.788-.572 1.9-1.5a1.5 1.5 0 00-.336-1.16.892.892 0 01-.11-.9c.606-1.27.946-2.69.946-4.19 0-5.385-4.365-9.75-9.75-9.75z" />
  </svg>
);

const HealthIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.25V15m-1.5-1.5h3" />
  </svg>
);

const ReligionIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.25V15m-1.5-1.5h3" />
  </svg>
);

const SpiritualIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c1.356 0 2.628-.29 3.756-.81M12 21c-1.356 0-2.628-.29-3.756-.81" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25M15.75 3.75c1.116 1.07 1.756 2.612 1.756 4.244V11.25c0 2.222-1.343 4.14-3.32 5.01" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v.01" />
  </svg>
);

const PetIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a.75.75 0 110-1.5.75.75 0 010 1.5z" />
  </svg>
);

const NewsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h.008v.008H12V7.5zM12 11.25h.008v.008H12v-.008zm0 3.75h.008v.008H12V15zm-7.5-3.75h.008v.008H4.5v-.008zm15 0h.008v.008h-.008v-.008zM4.5 15h.008v.008H4.5V15zm15 0h.008v.008h-.008V15zM3.75 3.75h16.5a1.5 1.5 0 011.5 1.5v13.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V5.25a1.5 1.5 0 011.5-1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 8h-3m3 3h-3m3 3h-3M8 8H5v6h3V8z" />
  </svg>
);

export const niches: Niche[] = [
  {
    id: 'berita-politik',
    name: 'Berita & Politik Terkini',
    description: 'Liputan tajam, analisis berita, dan rangkuman isu politik global.',
    icon: NewsIcon,
  },
  {
    id: 'hewan-peliharaan',
    name: 'Hewan Peliharaan',
    description: 'Penjelasan psikologi & perilaku unik anjing dan kucing.',
    icon: PetIcon,
  },
  {
    id: 'spiritual-indonesia',
    name: 'Ilmu Spiritual Indonesia',
    description: 'Legenda, mitologi, sejarah tersembunyi, dan spiritualitas Nusantara.',
    icon: SpiritualIcon,
  },
  {
    id: 'edukasi-agama',
    name: 'Edukasi Agama',
    description: 'Nilai, ajaran, dan hikmah keagamaan yang menenangkan.',
    icon: ReligionIcon,
  },
  {
    id: 'edukasi-kesehatan',
    name: 'Edukasi Kesehatan',
    description: 'Storytelling informatif, medis, dan bermanfaat.',
    icon: HealthIcon,
  },
  {
    id: 'cerita-horor',
    name: 'Cerita Horor Storytelling',
    description: 'Atmosfer gelap, mencekam, dan penuh misteri.',
    icon: HorrorIcon,
  },
  {
    id: 'dracin',
    name: 'Dracin (Drama Cina)',
    description: 'Storytelling dramatis, emosional, dan penuh intrik.',
    icon: DracinIcon,
  },
  {
    id: 'misteri-konspirasi',
    name: 'Misteri & Konspirasi',
    description: 'Mengungkap rahasia dan kisah tersembunyi.',
    icon: MysteryIcon,
  },
  {
    id: 'animasi-anak',
    name: 'Cerita Animasi Anak',
    description: 'Kisah ceria, mendidik, dan penuh pesan moral.',
    icon: KidsIcon,
  },
  {
    id: 'kisah-islami',
    name: 'Kisah Islami',
    description: 'Cerita penuh hikmah dari sejarah Islam.',
    icon: IslamicIcon,
  },
  {
    id: 'sport-olahraga',
    name: 'Sport / Olahraga',
    description: 'Analisis tajam & sejarah epik dunia olahraga.',
    icon: SportIcon,
  },
  {
    id: 'edukasi-sains',
    name: 'Edukasi & Sains',
    description: 'Menjelaskan hal rumit menjadi sederhana.',
    icon: ScienceIcon,
  },
  {
    id: 'psikologi-selfdev',
    name: 'Psikologi & Self-Dev',
    description: 'Wawasan untuk pengembangan diri.',
    icon: PsychologyIcon,
  },
  {
    id: 'bisnis-marketing',
    name: 'Bisnis & Marketing',
    description: 'Strategi, studi kasus, dan tren pasar.',
    icon: BusinessIcon,
  },
  {
    id: 'biografi',
    name: 'Biografi Tokoh',
    description: 'Kisah inspiratif dari tokoh-tokoh dunia.',
    icon: BiographyIcon,
  },
];