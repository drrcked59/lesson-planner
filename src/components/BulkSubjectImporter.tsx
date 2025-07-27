import React, { useState } from 'react';
import { Upload, FileText, Plus, X, Clock, Calendar } from 'lucide-react';
import { Subject } from '../types';

interface BulkSubjectImporterProps {
  onImport: (subjects: Subject[]) => void;
  onCancel: () => void;
}

interface SheetRow {
  time: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  duration: string;
}

export const BulkSubjectImporter: React.FC<BulkSubjectImporterProps> = ({ onImport, onCancel }) => {
  const [csvData, setCsvData] = useState<string>('');
  const [previewSubjects, setPreviewSubjects] = useState<Subject[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const parseTimeRange = (timeRange: string): { start: string; end: string } => {
    // Handle formats like "8:30 - 8:50 AM", "1:00 - 1:10", etc.
    const match = timeRange.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\s*(AM|PM)?/i);
    if (match) {
      let start = match[1];
      let end = match[2];
      
      // Convert to 24-hour format if needed
      if (match[3]) {
        const isPM = match[3].toUpperCase() === 'PM';
        const startHour = parseInt(start.split(':')[0]);
        const endHour = parseInt(end.split(':')[0]);
        
        if (isPM && startHour !== 12) {
          start = `${startHour + 12}:${start.split(':')[1]}`;
        }
        if (isPM && endHour !== 12) {
          end = `${endHour + 12}:${end.split(':')[1]}`;
        }
        if (!isPM && startHour === 12) {
          start = `00:${start.split(':')[1]}`;
        }
        if (!isPM && endHour === 12) {
          end = `00:${end.split(':')[1]}`;
        }
      }
      
      return { start, end };
    }
    return { start: '', end: '' };
  };

  const parseCSV = (csvText: string): SheetRow[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row as SheetRow;
    }).filter(row => row.time && (row.monday || row.tuesday || row.wednesday || row.thursday || row.friday));
  };

  const processCSVData = () => {
    if (!csvData.trim()) return;

    setIsProcessing(true);
    try {
      const rows = parseCSV(csvData);
      const subjects: Subject[] = [];
      const subjectMap = new Map<string, Subject>();

      rows.forEach(row => {
        const { start } = parseTimeRange(row.time);
        
        // Process each day
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;
        days.forEach(day => {
          const subjectName = row[day];
          if (subjectName && subjectName.trim()) {
            const key = subjectName.toLowerCase().trim();
            
            if (!subjectMap.has(key)) {
              // Create new subject
              const newSubject: Subject = {
                id: crypto.randomUUID(),
                name: subjectName.trim(),
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
                  daysPerWeek: 0,
                  selectedDays: [],
                },
              };
              subjectMap.set(key, newSubject);
            }

            const subject = subjectMap.get(key)!;
            subject.times[day] = start;
            subject.frequency.selectedDays.push(day);
          }
        });
      });

      // Update frequency counts
      subjectMap.forEach(subject => {
        subject.frequency.daysPerWeek = subject.frequency.selectedDays.length;
      });

      const processedSubjects = Array.from(subjectMap.values());
      setPreviewSubjects(processedSubjects);
    } catch (error) {
      console.error('Error processing CSV:', error);
      alert('Error processing the CSV data. Please check the format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    onImport(previewSubjects);
  };

  return (
    <div className="modal-content max-w-4xl mx-auto">
      <div className="form-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Upload size={24} />
            Import from Google Sheets
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="form-section">
        {/* Instructions */}
        <div className="bg-indigo-50/50 border border-indigo-200/50 rounded-lg p-4">
          <h3 className="font-semibold text-indigo-700 mb-2">How to import:</h3>
          <ol className="text-sm text-indigo-600 space-y-1 list-decimal list-inside">
            <li>Export your Google Sheet as CSV</li>
            <li>Copy the CSV data (including headers)</li>
            <li>Paste it in the text area below</li>
            <li>Click "Process Data" to preview</li>
            <li>Review and import your subjects</li>
          </ol>
        </div>

        {/* CSV Input */}
        <div>
          <label className="block text-sm font-medium text-indigo-700 mb-2">
            Paste CSV Data
          </label>
          <textarea
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            className="input-field h-32 resize-none"
            placeholder="Paste your Google Sheets CSV data here..."
          />
        </div>

        {/* Process Button */}
        <button
          onClick={processCSVData}
          disabled={!csvData.trim() || isProcessing}
          className="btn-primary flex items-center gap-2"
        >
          <FileText size={16} />
          {isProcessing ? 'Processing...' : 'Process Data'}
        </button>

        {/* Preview */}
        {previewSubjects.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-indigo-700">
              Preview ({previewSubjects.length} subjects found)
            </h3>
            
            <div className="max-h-96 overflow-y-auto space-y-3">
              {previewSubjects.map((subject) => (
                <div key={subject.id} className="bg-white/95 border border-slate-200/60 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-slate-800">{subject.name}</h4>
                    <span className="text-sm text-indigo-600">
                      {subject.frequency.daysPerWeek} {subject.frequency.daysPerWeek === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-indigo-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {subject.frequency.selectedDays.map(day => day.slice(0, 3)).join(', ')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {subject.times.monday || subject.times.tuesday || subject.times.wednesday || subject.times.thursday || subject.times.friday}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button
                onClick={handleImport}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={16} />
                Import All Subjects
              </button>
              <button
                onClick={() => setPreviewSubjects([])}
                className="btn-secondary"
              >
                Clear Preview
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}; 