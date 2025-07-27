import React from 'react';
import { Subject, DayOfWeek } from '../types';
import { Clock, BookOpen, FileText, Edit, Trash2, Calendar } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (subjectId: string) => void;
}

const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onEdit, onDelete }) => {
  const formatTime = (time: string) => {
    if (!time) return 'Not set';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{subject.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(subject)}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Edit subject"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(subject.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete subject"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Schedule Times */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-primary-700 mb-2 flex items-center gap-2">
          <Clock size={14} />
          Schedule
        </h4>
        <div className="grid grid-cols-5 gap-2 text-xs">
          {DAYS.map((day) => (
            <div key={day} className="text-center">
              <div className="font-medium text-primary-600 capitalize">
                {day.slice(0, 3)}
              </div>
              <div className="text-primary-500">
                {formatTime(subject.times[day])}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-primary-700 mb-2 flex items-center gap-2">
          <Calendar size={14} />
          Frequency
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-sm text-primary-600">
            {subject.frequency.daysPerWeek} {subject.frequency.daysPerWeek === 1 ? 'day' : 'days'} per week:
          </span>
          <div className="flex gap-1">
            {subject.frequency.selectedDays.map((day) => (
              <span
                key={day}
                className="px-2 py-1 bg-primary-200 text-primary-700 text-xs rounded-md font-medium capitalize"
              >
                {day.slice(0, 3)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Resources */}
      <div>
        <h4 className="text-sm font-medium text-primary-700 mb-2">Resources</h4>
        <div className="space-y-2">
          {subject.resources.bookLink && (
            <a
              href={subject.resources.bookLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              <BookOpen size={14} />
              <span className="truncate">Book Link</span>
            </a>
          )}
          {subject.resources.googleDocLink && (
            <a
              href={subject.resources.googleDocLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              <FileText size={14} />
              <span className="truncate">Google Doc</span>
            </a>
          )}
          {!subject.resources.bookLink && !subject.resources.googleDocLink && (
            <span className="text-sm text-primary-500">No resources added</span>
          )}
        </div>
      </div>
    </div>
  );
}; 