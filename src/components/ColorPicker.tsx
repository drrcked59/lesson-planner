import React, { useState, useEffect } from 'react';
import { Palette, Settings, Sun, Moon, Check, X, RotateCcw } from 'lucide-react';
import { ThemePreset, ThemeColors, UserTheme } from '../types';

interface ColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: UserTheme;
  onThemeChange: (theme: UserTheme) => void;
}

// Predefined theme presets
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

export const ColorPicker: React.FC<ColorPickerProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange
}) => {
  const [selectedPreset, setSelectedPreset] = useState(currentTheme.currentPreset);
  const [customColors, setCustomColors] = useState<Partial<ThemeColors>>(currentTheme.customColors || {});
  const [isDarkMode, setIsDarkMode] = useState(currentTheme.isDarkMode);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  const currentPreset = THEME_PRESETS.find(p => p.id === selectedPreset) || THEME_PRESETS[0];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    const newTheme: UserTheme = {
      currentPreset: presetId,
      customColors: {},
      isDarkMode
    };
    // Apply theme immediately
    onThemeChange(newTheme);
  };

  const handleCustomColorChange = (colorKey: keyof ThemeColors, value: string) => {
    const newCustomColors = { ...customColors, [colorKey]: value };
    setCustomColors(newCustomColors);
    
    const newTheme: UserTheme = {
      currentPreset: selectedPreset,
      customColors: newCustomColors,
      isDarkMode
    };
    // Apply theme immediately
    onThemeChange(newTheme);
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    const newTheme: UserTheme = {
      currentPreset: selectedPreset,
      customColors,
      isDarkMode: newDarkMode
    };
    // Apply theme immediately
    onThemeChange(newTheme);
  };

  const resetToDefault = () => {
    const defaultTheme: UserTheme = {
      currentPreset: 'indigo-purple',
      customColors: {},
      isDarkMode: false
    };
    setSelectedPreset('indigo-purple');
    setCustomColors({});
    setIsDarkMode(false);
    onThemeChange(defaultTheme);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-2xl mx-auto">
        <div className="form-container">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Palette className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Customize Theme</h2>
                <p className="text-slate-600 text-sm">Personalize your xevilearning experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon className="h-5 w-5 text-slate-600" />
                ) : (
                  <Sun className="h-5 w-5 text-slate-600" />
                )}
                <div>
                  <h3 className="font-medium text-slate-800">Dark Mode</h3>
                  <p className="text-sm text-slate-600">
                    {isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleDarkModeToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'presets'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Theme Presets
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'custom'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Custom Colors
            </button>
          </div>

          {/* Content */}
          {activeTab === 'presets' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {THEME_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetChange(preset.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedPreset === preset.id
                        ? 'border-indigo-500 bg-indigo-50 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-800">{preset.name}</h3>
                      {selectedPreset === preset.id && (
                        <Check className="h-5 w-5 text-indigo-600" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{preset.description}</p>
                    <div className="flex gap-2">
                      <div
                        className="w-6 h-6 rounded-full border border-slate-200"
                        style={{ backgroundColor: preset.colors.primary }}
                      />
                      <div
                        className="w-6 h-6 rounded-full border border-slate-200"
                        style={{ backgroundColor: preset.colors.secondary }}
                      />
                      <div
                        className="w-6 h-6 rounded-full border border-slate-200"
                        style={{ backgroundColor: preset.colors.accent }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(currentPreset.colors).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-slate-700 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={customColors[key as keyof ThemeColors] || value}
                        onChange={(e) => handleCustomColorChange(key as keyof ThemeColors, e.target.value)}
                        className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customColors[key as keyof ThemeColors] || value}
                        onChange={(e) => handleCustomColorChange(key as keyof ThemeColors, e.target.value)}
                        className="flex-1 input-field text-sm"
                        placeholder={value}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="form-actions">
            <button
              onClick={resetToDefault}
              className="btn-secondary flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset to Default
            </button>
            <button
              onClick={onClose}
              className="btn-primary"
            >
              Apply Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 