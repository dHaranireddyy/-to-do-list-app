import { JournalEntry, JournalMood } from '../types';

export const MOOD_OPTIONS: Array<{
  id: JournalMood;
  label: string;
  emoji: string;
  color: string;
  bgLight: string;
  bgDark: string;
}> = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: '#EAB308', bgLight: '#FEF9C3', bgDark: 'rgba(234, 179, 8, 0.2)' },
  { id: 'loved', label: 'Loved', emoji: '🥰', color: '#EC4899', bgLight: '#FCE7F3', bgDark: 'rgba(236, 72, 153, 0.2)' },
  { id: 'calm', label: 'Calm', emoji: '😌', color: '#10B981', bgLight: '#D1FAE5', bgDark: 'rgba(16, 185, 129, 0.2)' },
  { id: 'okay', label: 'Okay', emoji: '😐', color: '#64748B', bgLight: '#F1F5F9', bgDark: 'rgba(100, 116, 139, 0.2)' },
  { id: 'sad', label: 'Sad', emoji: '😔', color: '#3B82F6', bgLight: '#DBEAFE', bgDark: 'rgba(59, 130, 246, 0.2)' },
  { id: 'stressed', label: 'Stressed', emoji: '😫', color: '#F97316', bgLight: '#FFEDD5', bgDark: 'rgba(249, 115, 22, 0.2)' },
  { id: 'excited', label: 'Excited', emoji: '🤩', color: '#8B5CF6', bgLight: '#EDE9FE', bgDark: 'rgba(139, 92, 246, 0.2)' },
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: '2026-09-10',
    date: '2026-09-10',
    formattedDate: 'Thursday, September 10, 2026',
    mood: 'loved',
    thoughts: 'Had a wonderfully peaceful evening. Made myself a warm chamomile tea and sat by the window listening to the gentle rain. It feels so nice to slowly create this cozy sanctuary.',
    gratitude: 'A warm cozy bed, supportive friends who checked in on me, and quiet moments in between classes.',
    highlight: 'Finished setting up my study desk with warm fairy lights and a little potted succulent.',
    favoriteMemory: 'Watching the sunset tinting the clouds in pastel lavender and apricot tones.',
    learnedToday: 'Rushing things never makes them better; taking a deep diaphragmatic breath brings clarity.',
    improveTomorrow: 'Drink water earlier in the morning before reaching for my morning tea.',
    updatedAt: '2026-09-10T21:45:00Z',
  },
  {
    id: '2026-09-09',
    date: '2026-09-09',
    formattedDate: 'Wednesday, September 9, 2026',
    mood: 'calm',
    thoughts: 'Spent the morning revising React architectural principles and database schema design. Kept my workspace clean and lit a sweet vanilla sandalwood candle.',
    gratitude: 'The feeling of progress, clean notebooks, and sunny afternoon breezes through the curtains.',
    highlight: 'Solved a tricky state synchronization problem on my own and felt a genuine burst of quiet confidence.',
    favoriteMemory: 'Listening to low-fi piano while sipping matcha latte.',
    learnedToday: 'Consistency beats intensity every single day.',
    improveTomorrow: 'Take a longer screen break in the afternoon to stretch my neck.',
    updatedAt: '2026-09-09T20:15:00Z',
  },
];
