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
  resources: {
    bookLink: string;
    googleDocLink: string;
  };
  frequency: {
    daysPerWeek: number;
    selectedDays: string[];
  };
}

export interface LessonPlan {
  id: string;
  name: string;
  subjects: Subject[];
  createdAt: Date;
  updatedAt: Date;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'; 