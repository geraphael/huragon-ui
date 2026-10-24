// Preset Configurations Gallery
export const PRESETS_LIBRARY = {
  'glassmorphism': [
    {
      name: 'Apple Vision OS',
      preview: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
      data: { blur: 24, opacity: 0.12, saturation: 180, borderRadius: 24, borderOpacity: 0.3 }
    },
    {
      name: 'Deep Cyberpunk',
      preview: 'linear-gradient(135deg, rgba(236,72,153,0.3), rgba(139,92,246,0.1))',
      data: { blur: 18, opacity: 0.2, saturation: 160, borderRadius: 16, glassColor: '#7c3aed' }
    },
    {
      name: 'Frosted Emerald',
      preview: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(6,182,212,0.1))',
      data: { blur: 20, opacity: 0.18, saturation: 150, borderRadius: 20, glassColor: '#10b981' }
    }
  ],
  'mesh-gradient': [
    {
      name: 'Aurora Borealis',
      preview: 'linear-gradient(135deg, #10b981, #06b6d4, #8b5cf6)',
      data: {}
    },
    {
      name: 'Neon Sunset',
      preview: 'linear-gradient(135deg, #f43f5e, #ec4899, #fbbf24)',
      data: {}
    },
    {
      name: 'Cosmic Indigo',
      preview: 'linear-gradient(135deg, #4f46e5, #7c3aed, #0f172a)',
      data: {}
    }
  ],
  'button-generator': [
    {
      name: 'Electric Violet',
      preview: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
      data: { variant: 'gradient', bgColor1: '#8b5cf6', bgColor2: '#ec4899', borderRadius: 12 }
    },
    {
      name: 'Minimal Dark',
      preview: '#1e1e2f',
      data: { variant: 'solid', bgColor1: '#1e1e2f', borderRadius: 8, textColor: '#fff' }
    },
    {
      name: 'Cyber Glow',
      preview: '#000',
      data: { variant: 'neon', bgColor1: '#06b6d4', borderRadius: 6 }
    }
  ]
};
