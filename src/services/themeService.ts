import { UserTheme, ThemePreset, ThemeColors } from '../types';

// Theme presets (same as in ColorPicker)
const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'indigo-purple',
    name: 'Indigo Purple',
    description: 'Professional and modern',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: '#f1f5f9',
      surface: '#ffffff',
      text: '#1e293b',
      textSecondary: '#64748b'
    }
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Calm and serene',
    colors: {
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      accent: '#0891b2',
      background: '#f0f9ff',
      surface: '#ffffff',
      text: '#0c4a6e',
      textSecondary: '#0369a1'
    }
  },
  {
    id: 'emerald-green',
    name: 'Emerald Green',
    description: 'Fresh and natural',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#047857',
      background: '#f0fdf4',
      surface: '#ffffff',
      text: '#064e3b',
      textSecondary: '#065f46'
    }
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    description: 'Warm and energetic',
    colors: {
      primary: '#f97316',
      secondary: '#ea580c',
      accent: '#dc2626',
      background: '#fff7ed',
      surface: '#ffffff',
      text: '#7c2d12',
      textSecondary: '#9a3412'
    }
  },
  {
    id: 'rose-pink',
    name: 'Rose Pink',
    description: 'Elegant and feminine',
    colors: {
      primary: '#f43f5e',
      secondary: '#e11d48',
      accent: '#be185d',
      background: '#fdf2f8',
      surface: '#ffffff',
      text: '#831843',
      textSecondary: '#9d174d'
    }
  },
  {
    id: 'slate-gray',
    name: 'Slate Gray',
    description: 'Minimal and clean',
    colors: {
      primary: '#64748b',
      secondary: '#475569',
      accent: '#334155',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#1e293b',
      textSecondary: '#475569'
    }
  }
];

// Dark mode color overrides
const DARK_MODE_COLORS: Partial<ThemeColors> = {
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f1f5f9',
  textSecondary: '#cbd5e1'
};

class ThemeService {
  private static instance: ThemeService;
  private currentTheme: UserTheme;

  private constructor() {
    this.currentTheme = this.loadTheme();
    // Initialize CSS variables immediately
    this.initializeCSSVariables();
    this.applyTheme(this.currentTheme);
  }

  private initializeCSSVariables(): void {
    const root = document.documentElement;
    const defaultColors = THEME_PRESETS[0].colors;
    
    // Set default CSS variables
    Object.entries(defaultColors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Set default background gradient
    root.style.setProperty('--background-gradient', this.createBackgroundGradient(defaultColors.background));
  }

  private createBackgroundGradient(backgroundColor: string): string {
    if (backgroundColor.includes('#')) {
      const hex = backgroundColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      const lighter = `rgb(${Math.min(255, r + 20)}, ${Math.min(255, g + 20)}, ${Math.min(255, b + 20)})`;
      const darker = `rgb(${Math.max(0, r - 20)}, ${Math.max(0, g - 20)}, ${Math.max(0, b - 20)})`;
      
      return `linear-gradient(135deg, ${lighter} 0%, ${backgroundColor} 25%, ${darker} 50%, ${backgroundColor} 75%, ${darker} 100%)`;
    }
    return `linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 75%, #64748b 100%)`;
  }

  public static getInstance(): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService();
    }
    return ThemeService.instance;
  }

  private loadTheme(): UserTheme {
    const savedTheme = localStorage.getItem('xevilearning_theme');
    if (savedTheme) {
      try {
        return JSON.parse(savedTheme);
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    }
    
    return {
      currentPreset: 'indigo-purple',
      customColors: {},
      isDarkMode: false
    };
  }

  private saveTheme(theme: UserTheme): void {
    localStorage.setItem('xevilearning_theme', JSON.stringify(theme));
  }

  private getEffectiveColors(theme: UserTheme): ThemeColors {
    const preset = THEME_PRESETS.find(p => p.id === theme.currentPreset) || THEME_PRESETS[0];
    let colors = { ...preset.colors };

    // Apply custom colors
    if (theme.customColors) {
      colors = { ...colors, ...theme.customColors };
    }

    // Apply dark mode overrides
    if (theme.isDarkMode) {
      colors = { ...colors, ...DARK_MODE_COLORS };
    }

    return colors;
  }

  private applyTheme(theme: UserTheme): void {
    const colors = this.getEffectiveColors(theme);
    const root = document.documentElement;

    // Apply CSS custom properties
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply dark mode class
    if (theme.isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    // Update background gradient based on theme
    this.updateBackgroundGradient(colors);
  }

  private updateBackgroundGradient(colors: ThemeColors): void {
    const root = document.documentElement;
    const gradient = this.createBackgroundGradient(colors.background);
    root.style.setProperty('--background-gradient', gradient);
  }

  public getCurrentTheme(): UserTheme {
    return { ...this.currentTheme };
  }

  public updateTheme(theme: UserTheme): void {
    this.currentTheme = theme;
    this.saveTheme(theme);
    this.applyTheme(theme);
  }

  public getThemePresets(): ThemePreset[] {
    return THEME_PRESETS;
  }

  public getPresetById(id: string): ThemePreset | undefined {
    return THEME_PRESETS.find(p => p.id === id);
  }
}

export default ThemeService; 