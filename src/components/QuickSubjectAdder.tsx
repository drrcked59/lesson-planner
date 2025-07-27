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

  const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const addCustomSubject = () => {
    if (customSubject.trim() && !selectedSubjects.includes(customSubject.trim())) {
      setSelectedSubjects(prev => [...prev, customSubject.trim()]);
      setCustomSubject('');
    }
  };

  const createSubjects = () => {
    if (!selectedTime || selectedDays.length === 0 || selectedSubjects.length === 0) {
      alert('Please select a time, days, and at least one subject.');
      return;
    }

    const subjects: Subject[] = selectedSubjects.map(subjectName => ({
      id: crypto.randomUUID(),
      name: subjectName,
      times: {
        monday: selectedDays.includes('monday') ? selectedTime : '',
        tuesday: selectedDays.includes('tuesday') ? selectedTime : '',
        wednesday: selectedDays.includes('wednesday') ? selectedTime : '',
        thursday: selectedDays.includes('thursday') ? selectedTime : '',
        friday: selectedDays.includes('friday') ? selectedTime : '',
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
    <div className="card max-w-4xl mx-auto">
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

      <div className="space-y-6">
        {/* Time Selection */}
        <div>
          <h3 className="text-lg font-semibold text-primary-700 mb-3 flex items-center gap-2">
            <Clock size={18} />
            Select Time
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {COMMON_TIMES.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`p-3 rounded-lg border-2 transition-colors text-sm font-medium ${
                  selectedTime === time
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-primary-200 hover:border-primary-300 text-primary-600'
                }`}
              >
                {formatTime(time)}
              </button>
            ))}
          </div>
        </div>

        {/* Day Selection */}
        <div>
          <h3 className="text-lg font-semibold text-primary-700 mb-3 flex items-center gap-2">
            <Calendar size={18} />
            Select Days
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  selectedDays.includes(day)
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

        {/* Subject Selection */}
        <div>
          <h3 className="text-lg font-semibold text-primary-700 mb-3">
            Select Subjects
          </h3>
          
          {/* Common Subjects */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {COMMON_SUBJECTS.map((subject) => (
              <button
                key={subject}
                onClick={() => toggleSubject(subject)}
                className={`p-2 rounded-lg border-2 transition-colors text-sm text-left ${
                  selectedSubjects.includes(subject)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-primary-200 hover:border-primary-300 text-primary-600'
                }`}
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
        </div>

        {/* Selected Items Summary */}
        {(selectedSubjects.length > 0 || selectedTime || selectedDays.length > 0) && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <h4 className="font-semibold text-primary-700 mb-2">Summary:</h4>
            <div className="space-y-2 text-sm text-primary-600">
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
        <div className="flex gap-4 pt-4 border-t border-primary-200">
          <button
            onClick={createSubjects}
            disabled={!selectedTime || selectedDays.length === 0 || selectedSubjects.length === 0}
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
  );
}; 