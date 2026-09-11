export type PaperStyleId = 'classic' | 'floral' | 'minimal' | 'cozy' | 'midnight';
export type HandwritingFont = 'caveat' | 'kalam' | 'serif';

export interface PaperStyleConfig {
  id: PaperStyleId;
  name: string;
  icon: string;
  desc: string;
  paperBg: string;
  paperBgDark?: string;
  inkColor: string;
  promptColor: string;
  accentColor: string;
  lineColor: string;
  marginLineColor?: string;
  hasLines: boolean;
  hasMargin: boolean;
  boxShadow: string;
  borderEdge: string;
  decorativeTheme: 'none' | 'floral' | 'stars' | 'classic';
}

export const PAPER_STYLES: Record<PaperStyleId, PaperStyleConfig> = {
  classic: {
    id: 'classic',
    name: 'Classic Diary',
    icon: '📖',
    desc: 'Warm ivory paper with sepia lines & vintage margin',
    paperBg: '#FAF5EA',
    paperBgDark: '#22201C',
    inkColor: '#2D2319',
    promptColor: '#6E5C49',
    accentColor: '#A35D38',
    lineColor: 'rgba(168, 142, 110, 0.22)',
    marginLineColor: 'rgba(215, 110, 120, 0.32)',
    hasLines: true,
    hasMargin: true,
    boxShadow: '0 2px 4px rgba(0,0,0,0.06), 0 8px 24px rgba(60,40,20,0.08), 0 20px 48px -8px rgba(50,30,10,0.12)',
    borderEdge: 'rgba(180, 155, 125, 0.28)',
    decorativeTheme: 'classic',
  },
  floral: {
    id: 'floral',
    name: 'Floral Paper',
    icon: '🌸',
    desc: 'Soft cream paper with delicate botanical corners',
    paperBg: '#FCF8F5',
    paperBgDark: '#241E20',
    inkColor: '#382528',
    promptColor: '#85636A',
    accentColor: '#C4637A',
    lineColor: 'rgba(215, 175, 185, 0.24)',
    marginLineColor: 'rgba(224, 138, 155, 0.30)',
    hasLines: true,
    hasMargin: true,
    boxShadow: '0 2px 4px rgba(0,0,0,0.05), 0 8px 24px rgba(80,40,60,0.07), 0 20px 48px -8px rgba(70,30,50,0.10)',
    borderEdge: 'rgba(215, 180, 190, 0.30)',
    decorativeTheme: 'floral',
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal Paper',
    icon: '☁️',
    desc: 'Clean off-white paper, unlined artistic breathing space',
    paperBg: '#FAF9F6',
    paperBgDark: '#1E2024',
    inkColor: '#22262E',
    promptColor: '#5C6370',
    accentColor: '#4A5568',
    lineColor: 'transparent',
    marginLineColor: undefined,
    hasLines: false,
    hasMargin: false,
    boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.06), 0 16px 40px -8px rgba(0,0,0,0.08)',
    borderEdge: 'rgba(190, 195, 205, 0.32)',
    decorativeTheme: 'none',
  },
  cozy: {
    id: 'cozy',
    name: 'Cozy Notebook',
    icon: '🧸',
    desc: 'Warm beige kraft paper with gentle notebook ruling',
    paperBg: '#F4EEE1',
    paperBgDark: '#26211B',
    inkColor: '#342617',
    promptColor: '#785A3C',
    accentColor: '#9C6233',
    lineColor: 'rgba(160, 132, 98, 0.25)',
    marginLineColor: 'rgba(150, 115, 80, 0.28)',
    hasLines: true,
    hasMargin: true,
    boxShadow: '0 2px 4px rgba(0,0,0,0.06), 0 8px 24px rgba(70,45,20,0.09), 0 20px 48px -8px rgba(60,35,15,0.13)',
    borderEdge: 'rgba(175, 145, 110, 0.32)',
    decorativeTheme: 'classic',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Journal',
    icon: '🌙',
    desc: 'Dark starry paper with soft cream & gold starlight ink',
    paperBg: '#171822',
    paperBgDark: '#13141D',
    inkColor: '#F3EDE1',
    promptColor: '#9E99AF',
    accentColor: '#E2BD78',
    lineColor: 'rgba(255, 255, 255, 0.07)',
    marginLineColor: 'rgba(226, 189, 120, 0.20)',
    hasLines: true,
    hasMargin: true,
    boxShadow: '0 2px 6px rgba(0,0,0,0.5), 0 12px 28px rgba(0,0,0,0.6), 0 24px 56px -8px rgba(0,0,0,0.8)',
    borderEdge: 'rgba(255, 255, 255, 0.10)',
    decorativeTheme: 'stars',
  },
};
