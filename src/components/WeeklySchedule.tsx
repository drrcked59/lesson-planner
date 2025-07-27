import React from 'react';
import { Subject, DayOfWeek } from '../types';
import { Clock, ExternalLink, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface WeeklyScheduleProps {
  subjects: Subject[];
}

const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// Time slots from 7 AM to 10 PM
const TIME_SLOTS = Array.from({ length: 16 }, (_, i) => {
  const hour = i + 7;
  return `${hour.toString().padStart(2, '0')}:00`;
});

export const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ subjects }) => {
  const formatTime = (time: string) => {
    if (!time) return '';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getTimeSlotPosition = (time: string) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const startMinutes = 7 * 60; // 7 AM
    return ((totalMinutes - startMinutes) / 60) * 100; // Convert to percentage
  };

  const getTimeSlotHeight = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return 60; // Default height
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;
    
    const duration = endTotal - startTotal;
    return Math.max((duration / 60) * 100, 60); // Minimum 60px height
  };

  const getSubjectsForDay = (day: DayOfWeek) => {
    return subjects.filter(subject => 
      subject.frequency.selectedDays.includes(day) && subject.times[day]
    ).sort((a, b) => {
      const timeA = a.times[day] || '';
      const timeB = b.times[day] || '';
      return timeA.localeCompare(timeB);
    });
  };

  const getSubjectColor = (subjectName: string) => {
    // Generate consistent colors based on subject name
    const colors = [
      'bg-blue-500/90',
      'bg-purple-500/90',
      'bg-emerald-500/90',
      'bg-orange-500/90',
      'bg-pink-500/90',
      'bg-indigo-500/90',
      'bg-teal-500/90',
      'bg-rose-500/90',
      'bg-cyan-500/90',
      'bg-lime-500/90'
    ];
    
    const index = subjectName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Calendar className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Weekly Schedule</h2>
            <p className="text-slate-600 text-sm">Your organized lesson timeline</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ChevronLeft className="h-4 w-4 text-slate-600" />
          </button>
          <span className="text-sm font-medium text-slate-700">This Week</span>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ChevronRight className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="relative">
        {/* Time Column */}
        <div className="absolute left-0 top-0 w-16 h-full border-r border-slate-200 bg-slate-50/50">
          {TIME_SLOTS.map((time) => (
            <div
              key={time}
              className="h-[100px] flex items-start justify-end pr-2 pt-1"
            >
              <span className="text-xs text-slate-500 font-medium">
                {formatTime(time)}
              </span>
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="ml-16">
          {/* Day Headers */}
          <div className="grid grid-cols-5 gap-px bg-slate-200 mb-px">
            {DAY_LABELS.map((day, index) => (
              <div
                key={day}
                className="bg-white p-3 text-center border-b border-slate-200"
              >
                <div className="text-sm font-semibold text-slate-800">{day}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {getSubjectsForDay(DAYS[index]).length} lessons
                </div>
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="grid grid-cols-5 gap-px bg-slate-200">
            {DAYS.map((day, dayIndex) => {
              const daySubjects = getSubjectsForDay(day);
              
              return (
                <div
                  key={day}
                  className="bg-white relative"
                  style={{ height: `${TIME_SLOTS.length * 100}px` }}
                >
                  {/* Time Grid Lines */}
                  {TIME_SLOTS.map((time, timeIndex) => (
                    <div
                      key={time}
                      className="absolute w-full border-b border-slate-100"
                      style={{ top: `${timeIndex * 100}px` }}
                    />
                  ))}

                  {/* Subject Events */}
                  {daySubjects.map((subject) => {
                    const startTime = subject.times[day];
                    const endTime = subject.endTime || startTime;
                    
                    if (!startTime) return null;

                    const top = getTimeSlotPosition(startTime);
                    const height = getTimeSlotHeight(startTime, endTime);
                    const color = getSubjectColor(subject.name);

                    return (
                      <div
                        key={subject.id}
                        className={`absolute left-1 right-1 rounded-lg shadow-sm border border-white/20 overflow-hidden ${color}`}
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                          minHeight: '60px'
                        }}
                      >
                        <div className="p-2 h-full flex flex-col">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-medium text-white text-xs leading-tight">
                              {subject.name}
                            </h4>
                            <span className="text-white/80 text-xs font-medium">
                              {formatTime(startTime)}
                            </span>
                          </div>
                          
                          {subject.resources.bookLink || subject.resources.googleDocLink ? (
                            <div className="mt-auto flex gap-1">
                              {subject.resources.bookLink && (
                                <a
                                  href={subject.resources.bookLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-white/80 hover:text-white transition-colors"
                                  title="Book"
                                >
                                  <ExternalLink size={10} />
                                </a>
                              )}
                              {subject.resources.googleDocLink && (
                                <a
                                  href={subject.resources.googleDocLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-white/80 hover:text-white transition-colors"
                                  title="Google Doc"
                                >
                                  <ExternalLink size={10} />
                                </a>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty State */}
                  {daySubjects.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Clock className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-400">No lessons</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-700">Subject Colors:</span>
          <div className="flex gap-2">
            {subjects.slice(0, 5).map((subject) => (
              <div key={subject.id} className="flex items-center gap-1">
                <div
                  className={`w-3 h-3 rounded ${getSubjectColor(subject.name)}`}
                />
                <span className="text-xs text-slate-600">{subject.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 