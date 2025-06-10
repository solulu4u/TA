import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { 
  BookOpen, 
  PenTool, 
  Headphones, 
  MessageSquare, 
  BookMarked, 
  FileText,
  Mic,
  TrendingUp,
  Clock,
  Trophy,
  Target
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getOverallStats } = useProgress();
  const stats = getOverallStats();

  const skills = [
    { 
      name: 'Reading', 
      icon: BookOpen, 
      path: '/lessons/reading', 
      color: 'from-blue-500 to-blue-600',
      description: 'Improve comprehension and translation skills'
    },
    { 
      name: 'Writing', 
      icon: PenTool, 
      path: '/lessons/writing', 
      color: 'from-green-500 to-green-600',
      description: 'Master English writing and composition'
    },
    { 
      name: 'Listening', 
      icon: Headphones, 
      path: '/lessons/listening', 
      color: 'from-purple-500 to-purple-600',
      description: 'Enhance listening comprehension abilities'
    },
    { 
      name: 'Speaking', 
      icon: MessageSquare, 
      path: '/lessons/speaking', 
      color: 'from-red-500 to-red-600',
      description: 'Develop fluency and pronunciation'
    },
    { 
      name: 'Dictation', 
      icon: Mic, 
      path: '/lessons/dictation', 
      color: 'from-pink-500 to-rose-600',
      description: 'Practice listening and writing from audio'
    },
    { 
      name: 'Vocabulary', 
      icon: BookMarked, 
      path: '/lessons/vocabulary', 
      color: 'from-orange-500 to-orange-600',
      description: 'Expand your word knowledge and usage'
    },
    { 
      name: 'Grammar', 
      icon: FileText, 
      path: '/lessons/grammar', 
      color: 'from-indigo-500 to-indigo-600',
      description: 'Master English grammar structures'
    }
  ];

  const statCards = [
    {
      title: 'Current Score',
      value: stats.averageScore.toFixed(1),
      icon: Trophy,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50'
    },
    {
      title: 'Target Score',
      value: user?.targetScore?.toFixed(1) || '7.0',
      icon: Target,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Lessons Completed',
      value: stats.completedLessons.toString(),
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Study Time',
      value: `${Math.floor(stats.totalSentences * 2.5 / 60)}h`,
      icon: Clock,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.fullName}!
            </h1>
            <p className="text-blue-100 text-lg">
              Continue your journey to IELTS success. You're {user?.level} level, targeting {user?.targetScore} band score.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skills Grid */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Choose Your Skill to Practice</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <Link
              key={index}
              to={skill.path}
              className="group bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${skill.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <skill.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{skill.name}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{skill.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Study Tips for Today</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold text-sm">1</span>
            </div>
            <p className="text-sm text-slate-700">Practice 30 minutes daily for consistent improvement</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold text-sm">2</span>
            </div>
            <p className="text-sm text-slate-700">Focus on your weakest skills first</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white font-bold text-sm">3</span>
            </div>
            <p className="text-sm text-slate-700">Review completed lessons regularly</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;