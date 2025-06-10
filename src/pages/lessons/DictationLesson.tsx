import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Check, ArrowRight, Volume2 } from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import { dictationLessonsData } from '../../data/dictationLessons';

// Levenshtein Distance algorithm
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};

// Word-by-word comparison with color coding
const compareWords = (userText: string, correctText: string) => {
  const userWords = userText.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  const correctWords = correctText.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  
  const result = [];
  const maxLength = Math.max(userWords.length, correctWords.length);
  
  for (let i = 0; i < maxLength; i++) {
    const userWord = userWords[i] || '';
    const correctWord = correctWords[i] || '';
    
    if (userWord === correctWord) {
      result.push({ word: userWord, status: 'correct' });
    } else if (userWord && correctWord) {
      // Check if words are similar (allowing for minor typos)
      const distance = levenshteinDistance(userWord, correctWord);
      const similarity = 1 - (distance / Math.max(userWord.length, correctWord.length));
      
      if (similarity >= 0.7) {
        result.push({ word: userWord, status: 'close', correct: correctWord });
      } else {
        result.push({ word: userWord, status: 'incorrect', correct: correctWord });
      }
    } else if (userWord) {
      result.push({ word: userWord, status: 'extra' });
    } else {
      result.push({ word: correctWord, status: 'missing' });
    }
  }
  
  return result;
};

const DictationLesson: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { startLesson, getProgress, addAttempt } = useProgress();
  
  const lesson = dictationLessonsData[lessonId!];
  const progress = getProgress(lessonId!);
  
  const [currentSentence, setCurrentSentence] = useState(0);
  const [userTranscript, setUserTranscript] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [playCount, setPlayCount] = useState(0);
  const [wordComparison, setWordComparison] = useState<any[]>([]);

  useEffect(() => {
    if (lesson && !progress) {
      startLesson(lessonId!, 'dictation', lesson.dictationSentences?.length || 0);
    } else if (progress) {
      setCurrentSentence(progress.currentSentence);
    }
  }, [lesson, progress, lessonId, startLesson]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && lesson.dictationSentences) {
      const duration = lesson.dictationSentences[currentSentence].duration;
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSentence, lesson]);

  const playAudio = () => {
    if (!lesson.dictationSentences) return;
    
    setIsPlaying(true);
    setCurrentTime(0);
    setPlayCount(prev => prev + 1);
    
    // Simulate audio playback
    const duration = lesson.dictationSentences[currentSentence].duration;
    setTimeout(() => {
      setIsPlaying(false);
      setCurrentTime(0);
    }, duration * 1000);
  };

  const handleCheck = () => {
    if (!userTranscript.trim() || !lesson.dictationSentences) return;
    
    const correctText = lesson.dictationSentences[currentSentence].text;
    const comparison = compareWords(userTranscript, correctText);
    setWordComparison(comparison);
    
    // Calculate accuracy score
    const correctWords = comparison.filter(w => w.status === 'correct').length;
    const totalWords = correctText.split(/\s+/).length;
    const accuracy = (correctWords / totalWords) * 100;
    
    // Calculate Levenshtein distance for overall similarity
    const distance = levenshteinDistance(userTranscript.toLowerCase(), correctText.toLowerCase());
    const maxLength = Math.max(userTranscript.length, correctText.length);
    const similarity = ((maxLength - distance) / maxLength) * 100;
    
    const score = Math.max(0, Math.min(10, (accuracy * 0.7 + similarity * 0.3) / 10));
    
    const aiFeedback = {
      score,
      accuracy,
      similarity,
      correctWords,
      totalWords,
      distance,
      feedback: accuracy >= 90 ? 'Excellent accuracy!' : 
                accuracy >= 70 ? 'Good job! Minor errors detected.' :
                accuracy >= 50 ? 'Fair attempt. Focus on listening more carefully.' :
                'Keep practicing. Try listening multiple times.',
      suggestions: accuracy < 90 ? [
        'Listen to the audio multiple times',
        'Focus on individual words',
        'Pay attention to punctuation'
      ] : []
    };
    
    setFeedback(aiFeedback);
    setShowFeedback(true);
    
    addAttempt(lessonId!, {
      sentenceIndex: currentSentence,
      userAnswer: userTranscript,
      correctAnswer: correctText,
      aiFeedback,
      score,
      attemptNumber: 1,
      createdAt: new Date()
    });
  };

  const handleNext = () => {
    if (lesson.dictationSentences && currentSentence < lesson.dictationSentences.length - 1) {
      setCurrentSentence(currentSentence + 1);
      setUserTranscript('');
      setShowFeedback(false);
      setFeedback(null);
      setPlayCount(0);
      setWordComparison([]);
      setCurrentTime(0);
    } else {
      // Navigate back to the category page
      navigate(`/dashboard/dictation/${lesson.category}`);
    }
  };

  const resetAudio = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  if (!lesson || !lesson.dictationSentences) {
    return <div>Lesson not found</div>;
  }

  const currentDictation = lesson.dictationSentences[currentSentence];
  const progressPercentage = ((currentSentence + 1) / lesson.dictationSentences.length) * 100;

  const getWordColor = (status: string) => {
    switch (status) {
      case 'correct': return 'text-green-600 bg-green-100';
      case 'close': return 'text-yellow-600 bg-yellow-100';
      case 'incorrect': return 'text-red-600 bg-red-100';
      case 'extra': return 'text-purple-600 bg-purple-100';
      case 'missing': return 'text-gray-600 bg-gray-100';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/dashboard/dictation/${lesson.category}`)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">{lesson.title}</h1>
              <p className="text-sm text-slate-600">Write from Dictation • {lesson.accent} Accent</p>
            </div>
          </div>
          <div className="text-sm text-slate-600">
            {currentSentence + 1} / {lesson.dictationSentences.length}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Audio Player */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Listen and Write</h3>
            
            {/* Audio Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={playAudio}
                disabled={isPlaying}
                className="w-16 h-16 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full flex items-center justify-center hover:from-pink-700 hover:to-rose-700 disabled:opacity-50 transition-all"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
              
              <button
                onClick={resetAudio}
                className="w-12 h-12 bg-slate-500 text-white rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all"
                  style={{ width: `${(currentTime / currentDictation.duration) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>{currentTime.toFixed(1)}s</span>
                <span>{currentDictation.duration}s</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4 text-sm text-slate-600">
              <div className="flex items-center space-x-1">
                <Volume2 className="w-4 h-4" />
                <span>Played {playCount} times</span>
              </div>
              <span>•</span>
              <span>Duration: {currentDictation.duration}s</span>
            </div>
          </div>
        </div>

        {/* Writing Area */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Write what you hear</h3>
          
          <div className="space-y-4">
            <textarea
              value={userTranscript}
              onChange={(e) => setUserTranscript(e.target.value)}
              placeholder="Type what you hear from the audio..."
              className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-lg"
              disabled={showFeedback}
            />

            {!showFeedback ? (
              <button
                onClick={handleCheck}
                disabled={!userTranscript.trim()}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 px-6 rounded-lg hover:from-pink-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Check className="w-5 h-5" />
                <span>Check Transcript</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>{currentSentence < lesson.dictationSentences.length - 1 ? 'Next Sentence' : 'Complete Lesson'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && feedback && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-slate-800">Accuracy Analysis</h4>
              <span className="bg-pink-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                {feedback.score.toFixed(1)}/10
              </span>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">{feedback.accuracy.toFixed(1)}%</div>
                <div className="text-xs text-green-700">Word Accuracy</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{feedback.similarity.toFixed(1)}%</div>
                <div className="text-xs text-blue-700">Overall Similarity</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">{feedback.correctWords}/{feedback.totalWords}</div>
                <div className="text-xs text-purple-700">Correct Words</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-600">{feedback.distance}</div>
                <div className="text-xs text-orange-700">Edit Distance</div>
              </div>
            </div>

            {/* Word-by-word comparison */}
            <div className="space-y-4">
              <h5 className="font-medium text-slate-700">Word-by-word Analysis:</h5>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-2">Your transcript:</div>
                <div className="flex flex-wrap gap-1">
                  {wordComparison.map((word, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded text-sm font-medium ${getWordColor(word.status)}`}
                      title={word.correct ? `Correct: ${word.correct}` : ''}
                    >
                      {word.word || '[missing]'}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-2">Correct transcript:</div>
                <div className="text-slate-800 font-medium">{currentDictation.text}</div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-100 rounded"></div>
                  <span>Correct</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-100 rounded"></div>
                  <span>Close (minor error)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-100 rounded"></div>
                  <span>Incorrect</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-purple-100 rounded"></div>
                  <span>Extra word</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gray-100 rounded"></div>
                  <span>Missing word</span>
                </div>
              </div>
            </div>

            {/* Feedback and suggestions */}
            <div className="mt-4 space-y-3">
              <p className="text-slate-700">{feedback.feedback}</p>
              
              {feedback.suggestions.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-slate-600 block mb-2">Suggestions:</span>
                  <ul className="text-sm text-slate-700 space-y-1">
                    {feedback.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="flex items-start space-x-1">
                        <span className="text-pink-500 mt-1">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DictationLesson;