import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  PenTool, 
  Headphones, 
  MessageSquare, 
  Mic,
  BookMarked,
  FileText,
  Star,
  Users,
  Trophy,
  Target,
  CheckCircle,
  ArrowRight,
  Play,
  Globe,
  Award,
  TrendingUp,
  Clock
} from 'lucide-react';

const Home: React.FC = () => {
  const skills = [
    { 
      name: 'Reading', 
      icon: BookOpen, 
      path: '/lessons/reading', 
      color: 'from-blue-500 to-blue-600',
      description: 'Master reading comprehension with interactive sentence-by-sentence practice',
      lessons: 15
    },
    { 
      name: 'Writing', 
      icon: PenTool, 
      path: '/lessons/writing', 
      color: 'from-green-500 to-green-600',
      description: 'Improve your writing skills with AI-powered feedback and scoring',
      lessons: 12
    },
    { 
      name: 'Listening', 
      icon: Headphones, 
      path: '/lessons/listening', 
      color: 'from-purple-500 to-purple-600',
      description: 'Enhance listening skills with authentic audio materials',
      lessons: 18
    },
    { 
      name: 'Speaking', 
      icon: MessageSquare, 
      path: '/lessons/speaking', 
      color: 'from-red-500 to-red-600',
      description: 'Practice speaking with AI analysis and pronunciation feedback',
      lessons: 10
    },
    { 
      name: 'Dictation', 
      icon: Mic, 
      path: '/lessons/dictation', 
      color: 'from-pink-500 to-rose-600',
      description: 'Perfect your listening and writing accuracy with dictation exercises',
      lessons: 20
    },
    { 
      name: 'Vocabulary', 
      icon: BookMarked, 
      path: '/lessons/vocabulary', 
      color: 'from-orange-500 to-orange-600',
      description: 'Build essential vocabulary for IELTS success',
      lessons: 25
    },
    { 
      name: 'Grammar', 
      icon: FileText, 
      path: '/lessons/grammar', 
      color: 'from-indigo-500 to-indigo-600',
      description: 'Master complex grammar structures and rules',
      lessons: 14
    }
  ];

  const features = [
    {
      icon: Target,
      title: 'AI-Powered Learning',
      description: 'Get personalized feedback and scoring with advanced AI technology'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your improvement with detailed analytics and performance metrics'
    },
    {
      icon: Globe,
      title: 'Comprehensive Coverage',
      description: 'Practice all IELTS skills with authentic materials and real exam scenarios'
    },
    {
      icon: Award,
      title: 'Expert Content',
      description: 'Learn from carefully crafted lessons designed by IELTS experts'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      score: '8.5',
      text: 'IELTS Master helped me achieve my target score! The AI feedback was incredibly helpful.',
      avatar: 'SC'
    },
    {
      name: 'Michael Rodriguez',
      score: '7.5',
      text: 'The dictation exercises really improved my listening skills. Highly recommended!',
      avatar: 'MR'
    },
    {
      name: 'Priya Patel',
      score: '8.0',
      text: 'Interactive learning made studying enjoyable. The progress tracking kept me motivated.',
      avatar: 'PP'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Students Worldwide', icon: Users },
    { number: '8.2', label: 'Average Score Improvement', icon: TrendingUp },
    { number: '95%', label: 'Success Rate', icon: Trophy },
    { number: '24/7', label: 'Available Learning', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Master Your
                  <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    IELTS Journey
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                  Interactive AI-powered learning platform designed to help you achieve your target IELTS score with confidence.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 rounded-xl font-bold text-lg hover:from-yellow-300 hover:to-orange-300 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <span>Start Learning Free</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">4.9/5</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-5 h-5" />
                  <span>50,000+ students</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy className="w-5 h-5" />
                  <span>95% success rate</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Your Progress</h3>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">8.5/9.0</span>
                  </div>
                  
                  <div className="space-y-4">
                    {['Reading', 'Writing', 'Listening', 'Speaking'].map((skill, index) => (
                      <div key={skill} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{skill}</span>
                          <span>{8.0 + index * 0.2}/9.0</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${75 + index * 5}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">{stat.number}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
              Why Choose IELTS Master?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with proven teaching methods to deliver personalized learning experiences.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-800">Live AI Feedback</h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Real-time</span>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700 italic mb-3">
                    "Climate change represents one of the most pressing challenges of our time."
                  </p>
                  <div className="text-sm text-slate-600">Your translation:</div>
                  <p className="text-slate-800 font-medium">
                    "Biến đổi khí hậu là một trong những thách thức cấp bách nhất của thời đại chúng ta."
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Accuracy</span>
                    <span className="text-sm font-bold text-green-600">95%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full w-[95%]"></div>
                  </div>
                  <p className="text-sm text-slate-600">Excellent translation! Perfect capture of meaning and context.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
              Master All IELTS Skills
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive training across all IELTS components with interactive exercises and instant feedback.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <div key={index} className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-r ${skill.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <skill.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-slate-800 mb-2">{skill.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{skill.description}</p>
                
                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <span>{skill.lessons} lessons</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>4.9</span>
                  </div>
                </div>

                <Link
                  to={skill.path}
                  className="w-full bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors font-medium text-center block"
                >
                  Start Learning
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Join thousands of students who achieved their target IELTS scores with our platform.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-slate-900 font-bold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex items-center space-x-1">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">IELTS {testimonial.score}</span>
                    </div>
                  </div>
                </div>
                <p className="text-blue-100 leading-relaxed italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-orange-400">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Ready to Achieve Your Target Score?
          </h2>
          <p className="text-xl text-slate-800 mb-8 max-w-2xl mx-auto">
            Join thousands of successful students and start your IELTS journey today with our AI-powered learning platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white/20 backdrop-blur-sm border border-slate-900/20 text-slate-900 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-6 text-slate-800">
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-5 h-5" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-5 h-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-5 h-5" />
              <span>Instant access</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;