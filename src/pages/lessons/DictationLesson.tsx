import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Check, ArrowRight, Volume2, Mic, Square, SkipForward, Eye, EyeOff } from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import { dictationLessonsData } from '../../data/dictationLessons';

// Enhanced word comparison with character-level analysis
const compareWordsDetailed = (userText: string, correctText: string) => {
  const userWords = userText.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0);
  const correctWords = correctText.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0);
  
  const result = [];
  const maxLength = Math.max(userWords.length, correctWords.length);
  
  for (let i = 0; i < maxLength; i++) {
    const userWord = userWords[i] || '';
    const correctWord = correctWords[i] || '';
    
    if (!userWord && correctWord) {
      // Missing word
      result.push({
        userWord: '',
        correctWord,
        status: 'missing',
        characters: []
      });
    } else if (userWord && !correctWord) {
      // Extra word
      result.push({
        userWord,
        correctWord: '',
        status: 'extra',
        characters: userWord.split('').map(char => ({ char, status: 'extra' }))
      });
    } else if (userWord === correctWord) {
      // Perfect match
      result.push({
        userWord,
        correctWord,
        status: 'correct',
        characters: userWord.split('').map(char => ({ char, status: 'correct' }))
      });
    } else {
      // Character-level comparison for similar words
      const characters = [];
      const maxCharLength = Math.max(userWord.length, correctWord.length);
      
      for (let j = 0; j < maxCharLength; j++) {
        const userChar = userWord[j] || '';
        const correctChar = correctWord[j] || '';
        
        if (!userChar && correctChar) {
          characters.push({ char: correctChar, status: 'missing', isCorrect: false });
        } else if (userChar && !correctChar) {
          characters.push({ char: userChar, status: 'extra', isCorrect: false });
        } else if (userChar === correctChar) {
          characters.push({ char: userChar, status: 'correct', isCorrect: true });
        } else {
          characters.push({ char: userChar, status: 'incorrect', isCorrect: false, correctChar });
        }
      }
      
      result.push({
        userWord,
        correctWord,
        status: 'partial',
        characters
      });
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
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [pronunciationEnabled, setPronunciationEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [pronunciationFeedback, setPronunciationFeedback] = useState<string>('');
  const [showPronunciationSection, setShowPronunciationSection] = useState(false);

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
    
    const duration = lesson.dictationSentences[currentSentence].duration;
    setTimeout(() => {
      setIsPlaying(false);
      setCurrentTime(0);
    }, duration * 1000);
  };

  const handleCheck = () => {
    if (!userTranscript.trim() || !lesson.dictationSentences) return;
    
    const correctText = lesson.dictationSentences[currentSentence].text;
    const comparison = compareWordsDetailed(userTranscript, correctText);
    setWordComparison(comparison);
    
    // Calculate if all words are correct
    const allWordsCorrect = comparison.every(word => word.status === 'correct');
    
    const aiFeedback = {
      allCorrect: allWordsCorrect,
      comparison
    };
    
    setFeedback(aiFeedback);
    setShowFeedback(true);
    
    // Show pronunciation section if all words are correct and pronunciation is enabled
    if (allWordsCorrect && pronunciationEnabled) {
      setShowPronunciationSection(true);
    }
    
    addAttempt(lessonId!, {
      sentenceIndex: currentSentence,
      userAnswer: userTranscript,
      correctAnswer: correctText,
      aiFeedback,
      score: allWordsCorrect ? 10 : 5,
      attemptNumber: 1,
      createdAt: new Date()
    });
  };

  const handleSkip = () => {
    if (!lesson.dictationSentences) return;
    
    const correctText = lesson.dictationSentences[currentSentence].text;
    setShowCorrectAnswer(true);
    setShowFeedback(true);
    
    // Show the correct answer without user input
    setFeedback({
      allCorrect: false,
      skipped: true,
      correctAnswer: correctText
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
      setShowCorrectAnswer(false);
      setShowPronunciationSection(false);
      setPronunciationFeedback('');
    } else {
      navigate(`/dashboard/dictation/${lesson.category}`);
    }
  };

  const resetAudio = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const startPronunciationRecording = () => {
    setIsRecording(true);
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      // Simulate backend response with pronunciation feedback
      // Example: "01110" means H(0), E(1), L(1), L(1), O(0) - where 1 is correct, 0 is incorrect
      const mockPronunciationResult = "01110"; // Example for "HELLO"
      setPronunciationFeedback(mockPronunciationResult);
    }, 3000);
  };

  const getCharacterColor = (status: string) => {
    switch (status) {
      case 'correct': return 'bg-green-100 text-green-800';
      case 'incorrect': return 'bg-red-100 text-red-800';
      case 'extra': return 'bg-purple-100 text-purple-800';
      case 'missing': return 'bg-gray-100 text-gray-800 opacity-50';
      default: return 'text-slate-600';
    }
  };

  const getWordBorderColor = (status: string) => {
    switch (status) {
      case 'correct': return 'border-green-300';
      case 'partial': return 'border-yellow-300';
      case 'extra': return 'border-purple-300';
      case 'missing': return 'border-gray-300';
      default: return 'border-slate-300';
    }
  };

  const renderPronunciationFeedback = (word: string, feedback: string) => {
    return word.split('').map((char, index) => {
      const isCorrect = feedback[index] === '1';
      return (
        <span
          key={index}
          className={`inline-block px-1 py-0.5 mx-0.5 rounded text-sm font-mono ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {char}
        </span>
      );
    });
  };

  if (!lesson || !lesson.dictationSentences) {
    return <div>Lesson not found</div>;
  }

  const currentDictation = lesson.dictationSentences[currentSentence];
  const progressPercentage = ((currentSentence + 1) / lesson.dictationSentences.length) * 100;

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

            {/* Settings */}
            <div className="flex items-center justify-center space-x-6 pt-4 border-t border-slate-200">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pronunciationEnabled}
                  onChange={(e) => setPronunciationEnabled(e.target.checked)}
                  className="w-4 h-4 text-pink-600 border-slate-300 rounded focus:ring-pink-500"
                />
                <span className="text-sm text-slate-700">Enable Pronunciation Check</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCorrectAnswer}
                  onChange={(e) => setShowCorrectAnswer(e.target.checked)}
                  className="w-4 h-4 text-pink-600 border-slate-300 rounded focus:ring-pink-500"
                />
                <span className="text-sm text-slate-700">Show Correct Answer</span>
              </label>
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
              <div className="flex space-x-3">
                <button
                  onClick={handleCheck}
                  disabled={!userTranscript.trim()}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 px-6 rounded-lg hover:from-pink-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Check className="w-5 h-5" />
                  <span>Check Transcript</span>
                </button>
                
                <button
                  onClick={handleSkip}
                  className="px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <SkipForward className="w-5 h-5" />
                  <span>Skip</span>
                </button>
              </div>
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
            <h4 className="text-lg font-semibold text-slate-800 mb-4">
              {feedback.skipped ? 'Correct Answer' : 'Your Answer Analysis'}
            </h4>

            {feedback.skipped ? (
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-800 font-medium text-lg">{feedback.correctAnswer}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* User's answer with character-level feedback */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-sm text-slate-600 mb-2">Your transcript:</div>
                  <div className="flex flex-wrap gap-2">
                    {wordComparison.map((word, wordIndex) => (
                      <div
                        key={wordIndex}
                        className={`inline-flex border-2 rounded-lg p-2 ${getWordBorderColor(word.status)}`}
                      >
                        {word.status === 'missing' ? (
                          <span className="text-gray-500 italic">[missing: {word.correctWord}]</span>
                        ) : (
                          word.characters?.map((char: any, charIndex: number) => (
                            <span
                              key={charIndex}
                              className={`px-1 py-0.5 rounded text-sm font-mono ${getCharacterColor(char.status)}`}
                              title={char.correctChar ? `Should be: ${char.correctChar}` : ''}
                            >
                              {char.char || '·'}
                            </span>
                          ))
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Correct answer (if enabled) */}
                {showCorrectAnswer && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm text-green-700 mb-2">Correct transcript:</div>
                    <div className="text-green-800 font-medium text-lg">{currentDictation.text}</div>
                  </div>
                )}

                {/* Legend */}
                <div className="flex flex-wrap gap-4 text-xs bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-100 rounded border border-green-300"></div>
                    <span>Correct</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-100 rounded border border-red-300"></div>
                    <span>Incorrect</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-purple-100 rounded border border-purple-300"></div>
                    <span>Extra</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-gray-100 rounded border border-gray-300"></div>
                    <span>Missing</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pronunciation Section */}
        {showPronunciationSection && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h4 className="text-lg font-semibold text-slate-800 mb-4">Pronunciation Check</h4>
            
            <div className="text-center space-y-4">
              <p className="text-slate-600">Great job on the dictation! Now let's check your pronunciation.</p>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-800 font-medium text-lg mb-2">Read this sentence:</p>
                <p className="text-blue-900 text-xl font-semibold">{currentDictation.text}</p>
              </div>

              {!isRecording && !pronunciationFeedback ? (
                <button
                  onClick={startPronunciationRecording}
                  className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center hover:from-blue-700 hover:to-indigo-700 transition-all mx-auto"
                >
                  <Mic className="w-6 h-6" />
                </button>
              ) : isRecording ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <Square className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-red-600 font-medium">Recording... Speak clearly</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h5 className="font-medium text-slate-700">Pronunciation Analysis:</h5>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="text-lg">
                      {renderPronunciationFeedback(currentDictation.text.replace(/[^\w\s]/g, ''), pronunciationFeedback)}
                    </div>
                  </div>
                  <div className="flex justify-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-100 rounded"></div>
                      <span>Correct pronunciation</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-red-100 rounded"></div>
                      <span>Needs improvement</span>
                    </div>
                  </div>
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