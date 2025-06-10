import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, BookOpen, TrendingUp, Star } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';

const LessonSelection: React.FC = () => {
  const { skillType } = useParams<{ skillType: string }>();
  const { getProgress } = useProgress();

  const lessons = {
    reading: [
      {
        id: 'reading-1',
        title: 'Climate Change and Global Warming',
        level: 'intermediate',
        sentences: 12,
        description: 'Learn about environmental challenges through reading comprehension and translation exercises.',
        topics: ['Environment', 'Science', 'Current Events']
      },
      {
        id: 'reading-2',
        title: 'The Future of Artificial Intelligence',
        level: 'advanced',
        sentences: 15,
        description: 'Explore AI technology and its implications for society through detailed reading practice.',
        topics: ['Technology', 'Future', 'Society']
      },
      {
        id: 'reading-3',
        title: 'Cultural Traditions Around the World',
        level: 'beginner',
        sentences: 10,
        description: 'Discover diverse cultures and traditions while improving your reading skills.',
        topics: ['Culture', 'Traditions', 'Geography']
      }
    ],
    writing: [
      {
        id: 'writing-1',
        title: 'Describing Your Hometown',
        level: 'beginner',
        sentences: 8,
        description: 'Learn to write descriptive paragraphs about places and locations.',
        topics: ['Description', 'Places', 'Personal Experience']
      },
      {
        id: 'writing-2',
        title: 'Advantages and Disadvantages of Technology',
        level: 'intermediate',
        sentences: 12,
        description: 'Practice argumentative writing with balanced perspectives on technology.',
        topics: ['Technology', 'Opinion', 'Arguments']
      },
      {
        id: 'writing-3',
        title: 'Environmental Solutions Essay',
        level: 'advanced',
        sentences: 15,
        description: 'Write complex essays about environmental problems and solutions.',
        topics: ['Environment', 'Solutions', 'Academic Writing']
      }
    ],
    listening: [
      {
        id: 'listening-1',
        title: 'University Lecture: History',
        level: 'intermediate',
        sentences: 10,
        description: 'Practice listening to academic lectures and taking notes.',
        topics: ['Academic', 'History', 'Note-taking']
      },
      {
        id: 'listening-2',
        title: 'Everyday Conversations',
        level: 'beginner',
        sentences: 8,
        description: 'Understand common daily conversations and interactions.',
        topics: ['Daily Life', 'Conversations', 'Social']
      }
    ],
    speaking: [
      {
        id: 'speaking-1',
        title: 'Personal Introduction',
        level: 'beginner',
        sentences: 6,
        description: 'Practice introducing yourself and talking about personal topics.',
        topics: ['Personal', 'Introduction', 'Basic']
      },
      {
        id: 'speaking-2',
        title: 'Describing Places and Events',
        level: 'intermediate',
        sentences: 10,
        description: 'Learn to describe places, events, and experiences fluently.',
        topics: ['Description', 'Events', 'Experiences']
      }
    ],
    dictation: [
      {
        id: 'dictation-1',
        title: 'Academic Vocabulary Dictation',
        level: 'intermediate',
        sentences: 15,
        description: 'Listen to academic sentences and write them down accurately.',
        topics: ['Academic', 'Vocabulary', 'Accuracy']
      },
      {
        id: 'dictation-2',
        title: 'News Report Dictation',
        level: 'advanced',
        sentences: 12,
        description: 'Practice writing news reports from audio with complex vocabulary.',
        topics: ['News', 'Current Events', 'Advanced']
      },
      {
        id: 'dictation-3',
        title: 'Daily Conversation Dictation',
        level: 'beginner',
        sentences: 10,
        description: 'Write down everyday conversations to improve listening accuracy.',
        topics: ['Daily Life', 'Conversation', 'Basic']
      }
    ],
    vocabulary: [
      {
        id: 'vocabulary-1',
        title: 'Academic Vocabulary Set 1',
        level: 'intermediate',
        sentences: 20,
        description: 'Essential academic words for IELTS success.',
        topics: ['Academic', 'Formal', 'Essential']
      },
      {
        id: 'vocabulary-2',
        title: 'Business and Work Vocabulary',
        level: 'advanced',
        sentences: 25,
        description: 'Professional vocabulary for workplace contexts.',
        topics: ['Business', 'Work', 'Professional']
      }
    ],
    grammar: [
      {
        id: 'grammar-1',
        title: 'Complex Sentence Structures',
        level: 'intermediate',
        sentences: 15,
        description: 'Master advanced sentence patterns and structures.',
        topics: ['Syntax', 'Complex Sentences', 'Advanced']
      },
      {
        id: 'grammar-2',
        title: 'Conditional Sentences',
        level: 'advanced',
        sentences: 12,
        description: 'Practice all types of conditional sentences.',
        topics: ['Conditionals', 'Grammar Rules', 'Practice']
      }
    ]
  };

  const skillLessons = lessons[skillType as keyof typeof lessons] || [];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillTitle = () => {
    return skillType?.charAt(0).toUpperCase() + skillType?.slice(1) + ' Lessons';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{getSkillTitle()}</h1>
          <p className="text-slate-600 mt-2">Choose a lesson to start practicing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {skillLessons.map((lesson) => {
          const progress = getProgress(lesson.id);
          const completionPercentage = progress 
            ? Math.round((progress.completedSentences / progress.totalSentences) * 100)
            : 0;

          return (
            <div key={lesson.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">{lesson.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-3">{lesson.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(lesson.level)}`}>
                    {lesson.level}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-sm text-slate-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{lesson.sentences} sentences</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{Math.ceil(lesson.sentences * 2.5)} min</span>
                  </div>
                  {progress && (
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{progress.score.toFixed(1)}/10</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {lesson.topics.map((topic, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg">
                      {topic}
                    </span>
                  ))}
                </div>

                {progress && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">Progress</span>
                      <span className="text-slate-800 font-medium">{completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-slate-300'}`} 
                      />
                    ))}
                  </div>
                  <Link
                    to={`/lesson/${skillType}/${lesson.id}`}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium"
                  >
                    {progress?.status === 'completed' ? 'Review' : progress?.status === 'in_progress' ? 'Continue' : 'Start'}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LessonSelection;