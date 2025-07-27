export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export interface Subject {
  id: string;
  name: string;
  times: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
  };
  startTime?: string;
  endTime?: string;
  resources: {
    bookLink: string;
    googleDocLink: string;
  };
  frequency: {
    daysPerWeek: number;
    selectedDays: DayOfWeek[];
  };
}

export interface LessonPlan {
  subjects: Subject[];
}

// Theme and Color Picker Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  colors: ThemeColors;
  description: string;
}

export interface UserTheme {
  currentPreset: string;
  customColors?: Partial<ThemeColors>;
  isDarkMode: boolean;
} 