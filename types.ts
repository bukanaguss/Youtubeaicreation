import React from 'react';

export type Language = 'id' | 'en' | 'ms';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface Idea {
  title: string;
  angle: string;
  hook: string;
}

export interface Scene {
  scene_number: number;
  scene_title: string;
  visual_prompt: string;
  voice_over_script: string;
}

export interface PreProductionAssets {
  titles: string[];
  thumbnail_prompt: string;
  thumbnail_text: string;
  description: string;
  hashtags: string[];
}

export interface Niche {
  id: string;
  name: string;
  description: string;
  icon: React.FC<{ className?: string }>;
}
