import React, { useState, useEffect } from 'react';
import { Plus, Calendar, BookOpen, Settings, AlertCircle, Upload, Zap } from 'lucide-react';
import { Subject, LessonPlan } from './types';
import { SubjectForm } from './components/SubjectForm';
import { SubjectCard } from './components/SubjectCard';
import { WeeklySchedule } from './components/WeeklySchedule';
import { BulkSubjectImporter } from './components/BulkSubjectImporter';
import { QuickSubjectAdder } from './components/QuickSubjectAdder';
import { ApiDebugger } from './components/ApiDebugger';
import { ApiService } from './services/api';

function App() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>();
  const [activeView, setActiveView] = useState<'subjects' | 'schedule'>('subjects');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiConnected, setApiConnected] = useState(false);
  const [showApiDebugger, setShowApiDebugger] = useState(false);

  // Check API connection and load data from database
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        console.log('🚀 Initializing Lesson Planner app...');
        console.log(`🌐 API Base URL: ${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}`);
        
        // Check if API is available
        console.log('🏥 Checking API health...');
        const isHealthy = await ApiService.checkHealth();
        console.log(`✅ API Health Check Result: ${isHealthy ? 'Connected' : 'Failed'}`);
        setApiConnected(isHealthy);
        
        if (isHealthy) {
          console.log('📚 API is healthy, loading subjects from database...');
          // Load subjects from database
          const dbSubjects = await ApiService.getSubjects();
          console.log(`✅ Loaded ${dbSubjects.length} subjects from database`);
          setSubjects(dbSubjects);
        } else {
          console.log('⚠️ API health check failed, falling back to localStorage...');
          // Fallback to localStorage if API is not available
          const savedSubjects = localStorage.getItem('lessonPlanner_subjects');
          if (savedSubjects) {
            try {
              const parsedSubjects = JSON.parse(savedSubjects);
              console.log(`📦 Loaded ${parsedSubjects.length} subjects from localStorage`);
              setSubjects(parsedSubjects);
            } catch (error) {
              console.error('❌ Error loading saved subjects from localStorage:', error);
            }
          } else {
            console.log('📦 No saved subjects found in localStorage');
          }
          setError('Database connection failed. Using local storage as fallback.');
        }
      } catch (error) {
        console.error('❌ Error initializing app:', error);
        console.error('🔍 Initialization error details:', error);
        setError('Failed to connect to database. Using local storage as fallback.');
        
        // Fallback to localStorage
        const savedSubjects = localStorage.getItem('lessonPlanner_subjects');
        if (savedSubjects) {
          try {
            const parsedSubjects = JSON.parse(savedSubjects);
            console.log(`📦 Fallback: Loaded ${parsedSubjects.length} subjects from localStorage`);
            setSubjects(parsedSubjects);
          } catch (error) {
            console.error('❌ Error loading saved subjects from localStorage:', error);
          }
        } else {
          console.log('📦 Fallback: No saved subjects found in localStorage');
        }
      } finally {
        setLoading(false);
        console.log('✅ App initialization complete');
      }
    };

    initializeApp();
  }, []);

  // Save data to localStorage as backup
  useEffect(() => {
    if (!apiConnected) {
      localStorage.setItem('lessonPlanner_subjects', JSON.stringify(subjects));
    }
  }, [subjects, apiConnected]);

  const handleAddSubject = async (subject: Subject) => {
    try {
      if (apiConnected) {
        await ApiService.createSubject(subject);
      }
      setSubjects(prev => [...prev, subject]);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding subject:', error);
      alert('Failed to save subject to database. Please try again.');
    }
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setShowForm(true);
  };

  const handleUpdateSubject = async (updatedSubject: Subject) => {
    try {
      if (apiConnected) {
        await ApiService.updateSubject(updatedSubject);
      }
      setSubjects(prev => prev.map(subject => 
        subject.id === updatedSubject.id ? updatedSubject : subject
      ));
      setEditingSubject(undefined);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating subject:', error);
      alert('Failed to update subject in database. Please try again.');
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        if (apiConnected) {
          await ApiService.deleteSubject(subjectId);
        }
        setSubjects(prev => prev.filter(subject => subject.id !== subjectId));
      } catch (error) {
        console.error('Error deleting subject:', error);
        alert('Failed to delete subject from database. Please try again.');
      }
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setShowBulkImport(false);
    setShowQuickAdd(false);
    setEditingSubject(undefined);
  };

  const handleSaveForm = (subject: Subject) => {
    if (editingSubject) {
      handleUpdateSubject(subject);
    } else {
      handleAddSubject(subject);
    }
  };

  const handleBulkImport = async (importedSubjects: Subject[]) => {
    try {
      for (const subject of importedSubjects) {
        if (apiConnected) {
          await ApiService.createSubject(subject);
        }
      }
      setSubjects(prev => [...prev, ...importedSubjects]);
      setShowBulkImport(false);
    } catch (error) {
      console.error('Error importing subjects:', error);
      alert('Failed to import some subjects. Please try again.');
    }
  };

  const handleQuickAdd = async (quickSubjects: Subject[]) => {
    try {
      for (const subject of quickSubjects) {
        if (apiConnected) {
          await ApiService.createSubject(subject);
        }
      }
      setSubjects(prev => [...prev, ...quickSubjects]);
      setShowQuickAdd(false);
    } catch (error) {
      console.error('Error adding subjects:', error);
      alert('Failed to add some subjects. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <header className="header-card rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">Lesson Planner</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveView('subjects')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeView === 'subjects'
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Settings size={16} />
                Subjects
              </button>
              <button
                onClick={() => setActiveView('schedule')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeView === 'schedule'
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Calendar size={16} />
                Schedule
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 status-warning rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-yellow-600" />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-primary-700">Loading your lesson plan...</p>
            </div>
          </div>
        ) : showForm ? (
          <SubjectForm
            subject={editingSubject}
            onSave={handleSaveForm}
            onCancel={handleCancelForm}
          />
        ) : showBulkImport ? (
          <BulkSubjectImporter
            onImport={handleBulkImport}
            onCancel={handleCancelForm}
          />
        ) : showQuickAdd ? (
          <QuickSubjectAdder
            onAdd={handleQuickAdd}
            onCancel={handleCancelForm}
          />
        ) : (
          <div className="space-y-8">
            {activeView === 'subjects' ? (
              <>
                {/* Subjects Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Subjects</h2>
                    <p className="text-gray-600 mt-1">
                      Manage your subjects and their schedules
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowBulkImport(true)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Upload size={16} />
                      Import from Sheets
                    </button>
                    <button
                      onClick={() => setShowQuickAdd(true)}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Zap size={16} />
                      Quick Add
                    </button>
                    <button
                      onClick={() => setShowForm(true)}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add Subject
                    </button>
                  </div>
                </div>

                {/* Subjects Grid */}
                {subjects.length === 0 ? (
                  <div className="card text-center py-12">
                    <div className="p-4 bg-primary-50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <BookOpen size={32} className="text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No subjects yet
                    </h3>
                    <p className="text-primary-700 mb-6">
                      Start by adding your first subject to create your lesson plan.
                    </p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="btn-primary flex items-center gap-2 mx-auto"
                    >
                      <Plus size={16} />
                      Add Your First Subject
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((subject) => (
                      <SubjectCard
                        key={subject.id}
                        subject={subject}
                        onEdit={handleEditSubject}
                        onDelete={handleDeleteSubject}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <WeeklySchedule subjects={subjects} />
            )}
          </div>
        )}
      </main>
      
      {/* API Debugger */}
      <ApiDebugger 
        isVisible={showApiDebugger} 
        onToggle={() => setShowApiDebugger(!showApiDebugger)} 
      />
    </div>
  );
}

export default App; 