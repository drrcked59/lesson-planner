import React, { useState } from 'react';
import { Subject, DayOfWeek } from '../types';
import { X, Plus, BookOpen, FileText } from 'lucide-react';

interface SubjectFormProps {
  subject?: Subject;
  onSave: (subject: Subject) => void;
  onCancel: () => void;
}

const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export const SubjectForm: React.FC<SubjectFormProps> = ({ subject, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Subject>>(
    subject || {
      id: crypto.randomUUID(),
      name: '',
      times: {
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
      },
      resources: {
        bookLink: '',
        googleDocLink: '',
      },
      frequency: {
        daysPerWeek: 1,
        selectedDays: [],
      },
    }
  );

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTimeChange = (day: DayOfWeek, time: string) => {
    setFormData(prev => ({
      ...prev,
      times: {
        ...prev.times!,
        [day]: time,
      },
    }));
  };

  const handleResourceChange = (type: 'bookLink' | 'googleDocLink', value: string) => {
    setFormData(prev => ({
      ...prev,
      resources: {
        ...prev.resources!,
        [type]: value,
      },
    }));
  };

  const handleFrequencyChange = (daysPerWeek: number) => {
    setFormData(prev => ({
      ...prev,
      frequency: {
        ...prev.frequency!,
        daysPerWeek,
        selectedDays: prev.frequency!.selectedDays.slice(0, daysPerWeek),
      },
    }));
  };

  const handleDaySelection = (day: string) => {
    const currentSelected = formData.frequency!.selectedDays;
    const isSelected = currentSelected.includes(day);
    
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        frequency: {
          ...prev.frequency!,
          selectedDays: currentSelected.filter(d => d !== day),
        },
      }));
    } else if (currentSelected.length < formData.frequency!.daysPerWeek) {
      setFormData(prev => ({
        ...prev,
        frequency: {
          ...prev.frequency!,
          selectedDays: [...currentSelected, day],
        },
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.frequency!.selectedDays.length === formData.frequency!.daysPerWeek) {
      onSave(formData as Subject);
    }
  };

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {subject ? 'Edit Subject' : 'Add New Subject'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject Name */}
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">
            Subject Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="input-field"
            placeholder="e.g., Mathematics, Science, English"
            required
          />
        </div>

        {/* Schedule Times */}
        <div>
          <h3 className="text-lg font-semibold text-primary-700 mb-4">Schedule Times</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {DAYS.map((day) => (
              <div key={day}>
                <label className="block text-sm font-medium text-primary-700 mb-2 capitalize">
                  {day}
                </label>
                <input
                  type="time"
                  value={formData.times![day]}
                  onChange={(e) => handleTimeChange(day, e.target.value)}
                  className="input-field"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-primary-700 mb-4">Resources</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2 flex items-center gap-2">
                <BookOpen size={16} />
                Book Link
              </label>
              <input
                type="url"
                value={formData.resources!.bookLink}
                onChange={(e) => handleResourceChange('bookLink', e.target.value)}
                className="input-field"
                placeholder="https://example.com/book"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2 flex items-center gap-2">
                <FileText size={16} />
                Google Doc Link
              </label>
              <input
                type="url"
                value={formData.resources!.googleDocLink}
                onChange={(e) => handleResourceChange('googleDocLink', e.target.value)}
                className="input-field"
                placeholder="https://docs.google.com/document/d/..."
              />
            </div>
          </div>
        </div>

        {/* Frequency Settings */}
        <div>
          <h3 className="text-lg font-semibold text-primary-700 mb-4">Frequency Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Days per Week *
              </label>
              <select
                value={formData.frequency!.daysPerWeek}
                onChange={(e) => handleFrequencyChange(Number(e.target.value))}
                className="input-field"
                required
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'day' : 'days'}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Select Days ({formData.frequency!.selectedDays.length}/{formData.frequency!.daysPerWeek})
              </label>
              <div className="grid grid-cols-5 gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDaySelection(day)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      formData.frequency!.selectedDays.includes(day)
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-primary-200 hover:border-primary-300'
                    }`}
                  >
                    <span className="text-sm font-medium capitalize">
                      {day.slice(0, 3)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-6 border-t border-primary-200">
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
            disabled={!formData.name || formData.frequency!.selectedDays.length !== formData.frequency!.daysPerWeek}
          >
            <Plus size={16} />
            {subject ? 'Update Subject' : 'Add Subject'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}; 