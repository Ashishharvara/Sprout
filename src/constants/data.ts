export type Task = {
  id: string;
  number: string;
  title: string;
  description: string;
  color: string;
  estimatedTime: string;
  objectives: string[];
};

export const TASKS: Task[] = [
  {
    id: '1',
    number: '01',
    title: 'Drawing',
    description: '',
    color: '#F5C94C', // Yellow
    estimatedTime: '45 mins',
    objectives: ['Activity selection', 'Age-appropriate reasoning', 'Time-out mechanic'],
  },
  {
    id: '2',
    number: '02',
    title: 'Pop The Bubbles',
    description: '',
    color: '#58D4D0', // Teal
    estimatedTime: '2 hours',
    objectives: ['Tap interactions', 'Visual feedback', 'Audio integration'],
  },
  {
    id: '3',
    number: '03',
    title: 'Coming Soon! 🚀',
    description: '',
    color: '#FF7070', // Coral
    estimatedTime: '1 hour',
    objectives: ['Hypothesis creation', 'Testing strategy', 'Success metrics'],
  },
  {
    id: '4',
    number: '04',
    title: 'Coming Soon! 🌟',
    description: '',
    color: '#F56CA8', // Pink
    estimatedTime: '3 hours',
    objectives: ['Camera integration', 'Image capture', 'Reward celebration'],
  },
];