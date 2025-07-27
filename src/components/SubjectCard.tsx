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
    <div className="subject-card">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 pr-2">{subject.name}</h3>
        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(subject)}
            className="action-btn"
            title="Edit subject"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(subject.id)}
            className="action-btn hover:text-red-600 hover:bg-red-50/50"
            title="Delete subject"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Schedule Times */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-indigo-700 mb-2 flex items-center gap-2">
          <Clock size={14} />
          Schedule
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-sm text-indigo-600">
            {(() => {
              const times = Object.values(subject.times).filter(time => time);
              if (times.length === 0) return 'No time set';
              
              const startTime = times[0];
              const startTimeFormatted = formatTime(startTime);
              
              // If we have start/end times, show the range
              if (subject.startTime && subject.endTime) {
                const endTimeFormatted = formatTime(subject.endTime);
                return `${startTimeFormatted} - ${endTimeFormatted}`;
              }
              
              // Otherwise just show start time
              return startTimeFormatted;
            })()}
          </span>
        </div>
      </div>

      {/* Frequency */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-indigo-700 mb-2 flex items-center gap-2">
          <Calendar size={14} />
          Frequency
        </h4>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-sm text-indigo-600">
            {subject.frequency.daysPerWeek} {subject.frequency.daysPerWeek === 1 ? 'day' : 'days'} per week:
          </span>
          <div className="flex flex-wrap gap-1">
            {subject.frequency.selectedDays.map((day) => (
              <span
                key={day}
                className="tag capitalize"
              >
                {day.slice(0, 3)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Resources */}
      <div>
        <h4 className="text-sm font-medium text-indigo-700 mb-2">Resources</h4>
        <div className="space-y-2">
          {subject.resources.bookLink && (
            <a
              href={subject.resources.bookLink}
              target="_blank"
              rel="noopener noreferrer"
              className="link flex items-center gap-2 text-sm"
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
              className="link flex items-center gap-2 text-sm"
            >
              <FileText size={14} />
              <span className="truncate">Google Doc</span>
            </a>
          )}
          {!subject.resources.bookLink && !subject.resources.googleDocLink && (
            <span className="text-sm text-slate-500">No resources added</span>
          )}
        </div>
      </div>
    </div>
  );
}; 