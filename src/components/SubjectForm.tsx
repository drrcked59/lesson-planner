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
    subject ? {
      ...subject,
      // Use existing start/end times if available, otherwise extract from times object
      startTime: subject.startTime || Object.values(subject.times).find(time => time) || '',
      endTime: subject.endTime || '', // Keep existing end time or empty
    } : {
      id: crypto.randomUUID(),
      name: '',
      startTime: '',
      endTime: '',
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

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
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
    
    // Clear days error when user makes a selection
    if (errors.days) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.days;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validate subject name
    if (!formData.name?.trim()) {
      newErrors.name = 'Subject name is required';
    }

    // Validate start time
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    // Validate end time
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    // Validate time range
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    // Validate days selection
    if (formData.frequency!.selectedDays.length !== formData.frequency!.daysPerWeek) {
      newErrors.days = `Please select ${formData.frequency!.daysPerWeek} day${formData.frequency!.daysPerWeek > 1 ? 's' : ''}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Create the final subject with times populated for selected days
    const finalSubject: Subject = {
      ...formData as Subject,
      times: {
        monday: formData.frequency!.selectedDays.includes('monday') ? formData.startTime! : '',
        tuesday: formData.frequency!.selectedDays.includes('tuesday') ? formData.startTime! : '',
        wednesday: formData.frequency!.selectedDays.includes('wednesday') ? formData.startTime! : '',
        thursday: formData.frequency!.selectedDays.includes('thursday') ? formData.startTime! : '',
        friday: formData.frequency!.selectedDays.includes('friday') ? formData.startTime! : '',
      }
    };
    onSave(finalSubject);
  };

  return (
    <div className="modal-content max-w-4xl mx-auto">
      <div className="form-container">
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

        <form onSubmit={handleSubmit} className="form-section">
        {/* Subject Name */}
        <div>
          <label className="block text-sm font-medium text-indigo-700 mb-2">
            Subject Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`input-field ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g., Mathematics, Science, English"
            required
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Schedule Times */}
        <div>
          <h3 className="text-lg font-semibold text-indigo-700 mb-4">Schedule Times</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                value={formData.startTime || ''}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className={`input-field ${errors.startTime ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                required
              />
              {errors.startTime && (
                <p className="text-red-600 text-sm mt-1">{errors.startTime}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                End Time *
              </label>
              <input
                type="time"
                value={formData.endTime || ''}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className={`input-field ${errors.endTime ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                required
              />
              {errors.endTime && (
                <p className="text-red-600 text-sm mt-1">{errors.endTime}</p>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            This time will be applied to all selected days of the week.
          </p>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-indigo-700 mb-4">Resources</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2 flex items-center gap-2">
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
              <label className="block text-sm font-medium text-indigo-700 mb-2 flex items-center gap-2">
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
          <h3 className="text-lg font-semibold text-indigo-700 mb-4">Frequency Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-indigo-700 mb-2">
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
              <label className="block text-sm font-medium text-indigo-700 mb-2">
                Select Days ({formData.frequency!.selectedDays.length}/{formData.frequency!.daysPerWeek})
              </label>
              <div className="grid grid-cols-5 gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDaySelection(day)}
                    className={`day-btn ${formData.frequency!.selectedDays.includes(day) ? 'selected' : ''}`}
                  >
                    <span className="text-sm font-medium capitalize">
                      {day.slice(0, 3)}
                    </span>
                  </button>
                ))}
              </div>
              {errors.days && (
                <p className="text-red-600 text-sm mt-1">{errors.days}</p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
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
    </div>
  );
}; 