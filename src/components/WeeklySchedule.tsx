import React from 'react';
import { Subject, DayOfWeek } from '../types';
import { Clock, ExternalLink } from 'lucide-react';

interface WeeklyScheduleProps {
  subjects: Subject[];
}

const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ subjects }) => {
  const formatTime = (time: string) => {
    if (!time) return '';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getSubjectsForDay = (day: DayOfWeek) => {
    return subjects.filter(subject => 
      subject.frequency.selectedDays.includes(day) && subject.times[day]
    ).sort((a, b) => a.times[day].localeCompare(b.times[day]));
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Weekly Schedule</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {DAYS.map((day) => {
          const daySubjects = getSubjectsForDay(day);
          
          return (
            <div key={day} className="space-y-3">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-primary-700 capitalize">
                  {day}
                </h3>
                <div className="text-sm text-primary-600">
                  {daySubjects.length} {daySubjects.length === 1 ? 'subject' : 'subjects'}
                </div>
              </div>
              
              {daySubjects.length === 0 ? (
                <div className="text-center py-8 text-primary-400">
                  <Clock size={24} className="mx-auto mb-2" />
                  <p className="text-sm">No subjects scheduled</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {daySubjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="bg-primary-50 rounded-lg p-3 border border-primary-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {subject.name}
                        </h4>
                        <span className="text-xs text-primary-600 font-medium">
                          {formatTime(subject.times[day])}
                        </span>
                      </div>
                      
                      {/* Resources */}
                      <div className="space-y-1">
                        {subject.resources.bookLink && (
                          <a
                            href={subject.resources.bookLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 transition-colors"
                          >
                            <ExternalLink size={10} />
                            Book
                          </a>
                        )}
                        {subject.resources.googleDocLink && (
                          <a
                            href={subject.resources.googleDocLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 transition-colors"
                          >
                            <ExternalLink size={10} />
                            Google Doc
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}; 