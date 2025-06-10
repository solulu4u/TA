import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, Clock, Star, Users, Volume2, CheckCircle } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';

const DictationLessons: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { getProgress } = useProgress();

  const categoryData: { [key: string]: any } = {
    'short-stories': {
      title: 'Short Stories',
      description: 'Audio articles about culture, people, places, and historical events',
      lessons: [
        {
          id: 'story-1',
          title: 'The History of Coffee',
          description: 'Learn about the fascinating journey of coffee from Ethiopia to the world',
          duration: 8,
          difficulty: 'Intermediate',
          sentences: 12,
          accent: 'American',
          topics: ['History', 'Culture', 'Food']
        },
        {
          id: 'story-2',
          title: 'Canadian Wildlife',
          description: 'Discover the diverse wildlife found across Canada\'s vast landscapes',
          duration: 10,
          difficulty: 'Intermediate',
          sentences: 15,
          accent: 'Canadian',
          topics: ['Nature', 'Geography', 'Animals']
        },
        {
          id: 'story-3',
          title: 'The Golden Gate Bridge',
          description: 'The engineering marvel that connects San Francisco to Marin County',
          duration: 7,
          difficulty: 'Intermediate',
          sentences: 10,
          accent: 'American',
          topics: ['Engineering', 'History', 'Architecture']
        }
      ]
    },
    'daily-conversations': {
      title: 'Daily Conversations',
      description: 'Common situations you may experience in daily life',
      lessons: [
        {
          id: 'conv-1',
          title: 'At the Restaurant',
          description: 'Ordering food and drinks in a restaurant setting',
          duration: 4,
          difficulty: 'Beginner',
          sentences: 8,
          accent: 'American',
          topics: ['Food', 'Service', 'Social']
        },
        {
          id: 'conv-2',
          title: 'Shopping for Clothes',
          description: 'Conversations while shopping for clothing items',
          duration: 5,
          difficulty: 'Beginner',
          sentences: 10,
          accent: 'British',
          topics: ['Shopping', 'Fashion', 'Money']
        },
        {
          id: 'conv-3',
          title: 'Making Appointments',
          description: 'How to schedule appointments over the phone',
          duration: 3,
          difficulty: 'Beginner',
          sentences: 6,
          accent: 'American',
          topics: ['Phone', 'Schedule', 'Business']
        }
      ]
    },
    'toeic-listening': {
      title: 'TOEIC Listening',
      description: 'Business and workplace conversations',
      lessons: [
        {
          id: 'toeic-1',
          title: 'Office Meeting',
          description: 'A typical business meeting discussing quarterly results',
          duration: 6,
          difficulty: 'Intermediate',
          sentences: 12,
          accent: 'American',
          topics: ['Business', 'Meetings', 'Finance']
        },
        {
          id: 'toeic-2',
          title: 'Job Interview',
          description: 'A professional job interview conversation',
          duration: 8,
          difficulty: 'Intermediate',
          sentences: 14,
          accent: 'American',
          topics: ['Career', 'Interview', 'Professional']
        }
      ]
    },
    'ielts-listening': {
      title: 'IELTS Listening',
      description: 'Academic and everyday conversations in British/Australian accents',
      lessons: [
        {
          id: 'ielts-1',
          title: 'University Lecture: Psychology',
          description: 'An academic lecture about cognitive psychology',
          duration: 12,
          difficulty: 'Advanced',
          sentences: 18,
          accent: 'British',
          topics: ['Academic', 'Psychology', 'Science']
        },
        {
          id: 'ielts-2',
          title: 'Student Accommodation',
          description: 'A conversation about finding student housing',
          duration: 8,
          difficulty: 'Intermediate',
          sentences: 12,
          accent: 'Australian',
          topics: ['Education', 'Housing', 'Student Life']
        }
      ]
    }
  };

  const currentCategory = categoryData[category!] || categoryData['short-stories'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/dashboard/dictation"
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{currentCategory.title}</h1>
          <p className="text-slate-600 mt-1">{currentCategory.description}</p>
        </div>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-slate-800">{currentCategory.lessons.length}</div>
          <div className="text-sm text-slate-600">Lessons</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-slate-800">
            {Math.round(currentCategory.lessons.reduce((acc: number, lesson: any) => acc + lesson.duration, 0) / currentCategory.lessons.length)}m
          </div>
          <div className="text-sm text-slate-600">Avg Duration</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-slate-800">4.8</div>
          <div className="text-sm text-slate-600">Rating</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-slate-800">2.5K</div>
          <div className="text-sm text-slate-600">Students</div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-800">Available Lessons</h2>
        
        <div className="grid gap-6">
          {currentCategory.lessons.map((lesson: any, index: number) => {
            const progress = getProgress(lesson.id);
            const completionPercentage = progress 
              ? Math.round((progress.completedSentences / progress.totalSentences) * 100)
              : 0;

            return (
              <div key={lesson.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-slate-800">{lesson.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                          {lesson.difficulty}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-4">{lesson.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {lesson.topics.map((topic: string, topicIndex: number) => (
                          <span key={topicIndex} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="flex items-center space-x-1 text-sm text-slate-500 mb-1">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-slate-500 mb-1">
                        <Volume2 className="w-4 h-4" />
                        <span>{lesson.accent}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-slate-500">
                        <Users className="w-4 h-4" />
                        <span>{lesson.sentences} sentences</span>
                      </div>
                    </div>
                  </div>

                  {progress && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-600">Progress</span>
                        <span className="text-slate-800 font-medium">{completionPercentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                          />
                        ))}
                        <span className="text-sm text-slate-600 ml-1">4.8</span>
                      </div>
                      
                      {progress?.status === 'completed' && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Completed</span>
                        </div>
                      )}
                    </div>
                    
                    <Link
                      to={`/dashboard/lesson/dictation/${lesson.id}`}
                      className="px-6 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-200 font-medium flex items-center space-x-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>
                        {progress?.status === 'completed' ? 'Review' : 
                         progress?.status === 'in_progress' ? 'Continue' : 'Start'}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">Dictation Tips</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Before You Start:</h4>
            <ul className="space-y-1 text-pink-100">
              <li>• Find a quiet environment</li>
              <li>• Use good quality headphones</li>
              <li>• Have a notepad ready for practice</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">During Practice:</h4>
            <ul className="space-y-1 text-pink-100">
              <li>• Listen multiple times if needed</li>
              <li>• Focus on individual words</li>
              <li>• Pay attention to punctuation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DictationLessons;