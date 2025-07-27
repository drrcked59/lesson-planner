import React, { useState, useEffect } from 'react';
import { Plus, Calendar, BookOpen, Settings, AlertCircle, Upload, Zap, Palette } from 'lucide-react';
import { Subject, LessonPlan, UserTheme } from './types';
import { SubjectForm } from './components/SubjectForm';
import { SubjectCard } from './components/SubjectCard';
import { WeeklySchedule } from './components/WeeklySchedule';
import { BulkSubjectImporter } from './components/BulkSubjectImporter';
import { QuickSubjectAdder } from './components/QuickSubjectAdder';
import { ApiDebugger } from './components/ApiDebugger';
import { ColorPicker } from './components/ColorPicker';
import { ApiService } from './services/api';
import ThemeService from './services/themeService';

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
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<UserTheme>(() => {
    // Initialize theme service on app start
    const themeService = ThemeService.getInstance();
    return themeService.getCurrentTheme();
  });

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

  const handleThemeChange = (theme: UserTheme) => {
    setCurrentTheme(theme);
    ThemeService.getInstance().updateTheme(theme);
  };

  return (
    <div className="min-h-screen">
              {/* Header */}
        <header className="header-card rounded-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Logo Container */}
                <div className="logo-container flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-white/25 to-white/10 rounded-2xl backdrop-blur-xl border border-white/20 shadow-lg">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="logo-font text-lg sm:text-xl lg:text-2xl text-white tracking-wide">
                      xevilearning
                    </h1>
                    <div className="hidden sm:block">
                      <div className="h-0.5 bg-gradient-to-r from-white/60 to-transparent rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={() => setActiveView('subjects')}
                  className={`nav-tab ${activeView === 'subjects' ? 'active' : ''}`}
                >
                  <BookOpen size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Subjects</span>
                  <span className="sm:hidden">Sub</span>
                </button>
                <button
                  onClick={() => setActiveView('schedule')}
                  className={`nav-tab ${activeView === 'schedule' ? 'active' : ''}`}
                >
                  <Calendar size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Schedule</span>
                  <span className="sm:hidden">Sch</span>
                </button>
                <button
                  onClick={() => setShowColorPicker(true)}
                  className="nav-tab"
                  title="Customize Theme"
                >
                  <Palette size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Theme</span>
                </button>
              </div>
            </div>
          </div>
        </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Font Test Indicator */}
        
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-slate-700">Loading your lesson plan...</p>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Subjects</h2>
                    <p className="text-slate-600 mt-1 text-sm sm:text-base">
                      Manage your subjects and their schedules
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <button
                      onClick={() => setShowBulkImport(true)}
                      className="btn-secondary flex items-center gap-1.5 sm:gap-2 text-sm"
                    >
                      <Upload size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Import from Sheets</span>
                      <span className="sm:hidden">Import</span>
                    </button>
                    <button
                      onClick={() => setShowQuickAdd(true)}
                      className="btn-secondary flex items-center gap-1.5 sm:gap-2 text-sm"
                    >
                      <Zap size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Quick Add</span>
                      <span className="sm:hidden">Quick</span>
                    </button>
                    <button
                      onClick={() => setShowForm(true)}
                      className="btn-primary flex items-center gap-1.5 sm:gap-2 text-sm"
                    >
                      <Plus size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Add Subject</span>
                      <span className="sm:hidden">Add</span>
                    </button>
                  </div>
                </div>

                {/* Subjects Grid */}
                {subjects.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <BookOpen size={32} className="text-indigo-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
                      No subjects yet
                    </h3>
                    <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base">
                      Start by adding your first subject to create your lesson plan.
                    </p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="btn-primary flex items-center gap-1.5 sm:gap-2 mx-auto text-sm"
                    >
                      <Plus size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Add Your First Subject</span>
                      <span className="sm:hidden">Add First Subject</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fade-in">
                    {subjects.map((subject, index) => (
                      <div key={subject.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in">
                        <SubjectCard
                          subject={subject}
                          onEdit={handleEditSubject}
                          onDelete={handleDeleteSubject}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="animate-fade-in">
                <WeeklySchedule subjects={subjects} />
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Color Picker */}
      <ColorPicker
        isOpen={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
      />
      
      {/* API Debugger */}
      <ApiDebugger 
        isVisible={showApiDebugger} 
        onToggle={() => setShowApiDebugger(!showApiDebugger)} 
      />
    </div>
  );
}

export default App; 