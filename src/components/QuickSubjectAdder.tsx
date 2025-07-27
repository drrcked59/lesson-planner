import React, { useState } from 'react';
import { Zap, Plus, X, Clock, Calendar } from 'lucide-react';
import { Subject } from '../types';

interface QuickSubjectAdderProps {
  onAdd: (subjects: Subject[]) => void;
  onCancel: () => void;
}

const COMMON_SUBJECTS = [
  'Bible & Pray',
  'Mathematics',
  'English',
  'Filipino',
  'Science',
  'AP (Geography)',
  'English Literature',
  'English Communication',
  'Filipino Reading',
  'Mental Math',
  'Physical Education',
  'Music and Arts',
  'Health',
  'Character Education',
  'Nature Study',
  'Art Appreciation',
  'Poetry Memory Work',
  'Bible Memory Work',
  'Leisure Reading',
  'Sketching / Drawing'
];

const COMMON_TIMES = [
  '08:30', '08:50', '09:20', '09:25', '09:40', '09:55',
  '10:15', '10:25', '10:40', '10:55', '11:10', '11:40',
  '13:00', '13:10', '13:20', '13:30', '13:35'
];

export const QuickSubjectAdder: React.FC<QuickSubjectAdderProps> = ({ onAdd, onCancel }) => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [customSubject, setCustomSubject] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [useCustomTime, setUseCustomTime] = useState<boolean>(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
    
    // Clear subjects error when user makes a selection
    if (errors.subjects) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.subjects;
        return newErrors;
      });
    }
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
    
    // Clear days error when user makes a selection
    if (errors.days) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.days;
        return newErrors;
      });
    }
  };

  const addCustomSubject = () => {
    if (customSubject.trim() && !selectedSubjects.includes(customSubject.trim())) {
      setSelectedSubjects(prev => [...prev, customSubject.trim()]);
      setCustomSubject('');
      
      // Clear subjects error when user adds a subject
      if (errors.subjects) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.subjects;
          return newErrors;
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validate time selection
    if (!useCustomTime && !selectedTime) {
      newErrors.time = 'Please select a time';
    }

    if (useCustomTime) {
      if (!startTime) {
        newErrors.startTime = 'Start time is required';
      }
      if (!endTime) {
        newErrors.endTime = 'End time is required';
      }
      if (startTime && endTime && startTime >= endTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    // Validate days selection
    if (selectedDays.length === 0) {
      newErrors.days = 'Please select at least one day';
    }

    // Validate subjects selection
    if (selectedSubjects.length === 0) {
      newErrors.subjects = 'Please select at least one subject';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createSubjects = () => {
    if (!validateForm()) {
      return;
    }

    const timeToUse = useCustomTime ? startTime : selectedTime;

    const subjects: Subject[] = selectedSubjects.map(subjectName => ({
      id: crypto.randomUUID(),
      name: subjectName,
      startTime: useCustomTime ? startTime : undefined,
      endTime: useCustomTime ? endTime : undefined,
      times: {
        monday: selectedDays.includes('monday') ? timeToUse : '',
        tuesday: selectedDays.includes('tuesday') ? timeToUse : '',
        wednesday: selectedDays.includes('wednesday') ? timeToUse : '',
        thursday: selectedDays.includes('thursday') ? timeToUse : '',
        friday: selectedDays.includes('friday') ? timeToUse : '',
      },
      resources: {
        bookLink: '',
        googleDocLink: '',
      },
      frequency: {
        daysPerWeek: selectedDays.length,
        selectedDays: [...selectedDays],
      },
    }));

    onAdd(subjects);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="modal-content max-w-4xl mx-auto">
      <div className="form-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap size={24} />
            Quick Subject Adder
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="form-section">
        {/* Time Selection */}
        <div>
          <h3 className="text-lg font-semibold text-indigo-700 mb-3 flex items-center gap-2">
            <Clock size={18} />
            Select Time
          </h3>
          
          {/* Time Mode Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setUseCustomTime(false)}
              className={`px-4 py-2 rounded-lg border-2 transition-colors text-sm font-medium ${
                !useCustomTime
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 hover:border-indigo-300 text-slate-600'
              }`}
            >
              Quick Times
            </button>
            <button
              onClick={() => setUseCustomTime(true)}
              className={`px-4 py-2 rounded-lg border-2 transition-colors text-sm font-medium ${
                useCustomTime
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 hover:border-indigo-300 text-slate-600'
              }`}
            >
              Custom Times
            </button>
          </div>

          {!useCustomTime ? (
            /* Quick Times */
            <div>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {COMMON_TIMES.map((time) => (
                  <button
                    key={time}
                    onClick={() => {
                      setSelectedTime(time);
                      // Clear time error when user selects a time
                      if (errors.time) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.time;
                          return newErrors;
                        });
                      }
                    }}
                    className={`time-btn ${selectedTime === time ? 'selected' : ''}`}
                  >
                    {formatTime(time)}
                  </button>
                ))}
              </div>
              {errors.time && (
                <p className="text-red-600 text-sm mt-2">{errors.time}</p>
              )}
            </div>
          ) : (
            /* Custom Times */
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      // Clear start time error when user types
                      if (errors.startTime) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.startTime;
                          return newErrors;
                        });
                      }
                    }}
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
                    value={endTime}
                    onChange={(e) => {
                      setEndTime(e.target.value);
                      // Clear end time error when user types
                      if (errors.endTime) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.endTime;
                          return newErrors;
                        });
                      }
                    }}
                    className={`input-field ${errors.endTime ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                  {errors.endTime && (
                    <p className="text-red-600 text-sm mt-1">{errors.endTime}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Day Selection */}
        <div>
          <h3 className="text-lg font-semibold text-indigo-700 mb-3 flex items-center gap-2">
            <Calendar size={18} />
            Select Days
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`day-btn ${selectedDays.includes(day) ? 'selected' : ''}`}
              >
                <span className="text-sm font-medium capitalize">
                  {day.slice(0, 3)}
                </span>
              </button>
            ))}
          </div>
          {errors.days && (
            <p className="text-red-600 text-sm mt-2">{errors.days}</p>
          )}
        </div>

        {/* Subject Selection */}
        <div>
          <h3 className="text-lg font-semibold text-indigo-700 mb-3">
            Select Subjects
          </h3>
          
          {/* Common Subjects */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {COMMON_SUBJECTS.map((subject) => (
              <button
                key={subject}
                onClick={() => toggleSubject(subject)}
                className={`subject-btn ${selectedSubjects.includes(subject) ? 'selected' : ''}`}
              >
                {subject}
              </button>
            ))}
          </div>

          {/* Custom Subject */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder="Add custom subject..."
              className="input-field flex-1"
              onKeyPress={(e) => e.key === 'Enter' && addCustomSubject()}
            />
            <button
              onClick={addCustomSubject}
              className="btn-secondary"
              disabled={!customSubject.trim()}
            >
              Add
            </button>
          </div>
          {errors.subjects && (
            <p className="text-red-600 text-sm mt-2">{errors.subjects}</p>
          )}
        </div>

        {/* Selected Items Summary */}
        {(selectedSubjects.length > 0 || selectedTime || selectedDays.length > 0) && (
          <div className="summary-card">
            <h4 className="font-semibold text-indigo-700 mb-2">Summary:</h4>
            <div className="space-y-2 text-sm text-indigo-600">
              {selectedTime && (
                <div>Time: {formatTime(selectedTime)}</div>
              )}
              {selectedDays.length > 0 && (
                <div>Days: {selectedDays.map(day => day.slice(0, 3)).join(', ')}</div>
              )}
              {selectedSubjects.length > 0 && (
                <div>Subjects: {selectedSubjects.join(', ')}</div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="form-actions">
          <button
            onClick={createSubjects}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Add {selectedSubjects.length} Subject{selectedSubjects.length !== 1 ? 's' : ''}
          </button>
          <button
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}; 