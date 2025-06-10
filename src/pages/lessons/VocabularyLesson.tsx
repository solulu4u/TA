import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, Check, ArrowRight, RotateCcw, BookOpen } from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import { lessonsData } from '../../data/lessons';

const VocabularyLesson: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { startLesson, getProgress, addAttempt } = useProgress();
  
  const lesson = lessonsData[lessonId!];
  const progress = getProgress(lessonId!);
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userSentence, setUserSentence] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDefinition, setShowDefinition] = useState(true);

  useEffect(() => {
    if (lesson && !progress) {
      startLesson(lessonId!, 'vocabulary', lesson.words?.length || 0);
    } else if (progress) {
      setCurrentWordIndex(progress.currentSentence);
    }
  }, [lesson, progress, lessonId, startLesson]);

  const simulateAIFeedback = (userSentence: string, word: string) => {
    const hasWord = userSentence.toLowerCase().includes(word.toLowerCase());
    const sentenceLength = userSentence.split(' ').length;
    const isReasonableLength = sentenceLength >= 5 && sentenceLength <= 25;
    
    let score = 5;
    if (hasWord) score += 3;
    if (isReasonableLength) score += 1;
    if (userSentence.match(/^[A-Z]/) && userSentence.endsWith('.')) score += 1;
    
    return {
      score: Math.min(score, 10),
      usesWord: hasWord,
      feedback: hasWord 
        ? 'Great! You used the word correctly in context.' 
        : `Make sure to include the word "${word}" in your sentence.`,
      suggestions: !hasWord ? [`Remember to use the word "${word}" in your sentence`] : []
    };
  };

  const handleCheck = async () => {
    if (!userSentence.trim() || !lesson.words) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      const currentWord = lesson.words![currentWordIndex];
      const aiFeedback = simulateAIFeedback(userSentence, currentWord.word);
      
      setFeedback(aiFeedback);
      setShowFeedback(true);
      
      addAttempt(lessonId!, {
        sentenceIndex: currentWordIndex,
        userAnswer: userSentence,
        correctAnswer: currentWord.examples[0],
        aiFeedback,
        score: aiFeedback.score,
        attemptNumber: 1,
        createdAt: new Date()
      });
      
      setIsLoading(false);
    }, 1000);
  };

  const handleNext = () => {
    if (lesson.words && currentWordIndex < lesson.words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setUserSentence('');
      setShowFeedback(false);
      setFeedback(null);
      setShowDefinition(true);
    } else {
      navigate('/lessons/vocabulary');
    }
  };

  const handleRestart = () => {
    setCurrentWordIndex(0);
    setUserSentence('');
    setShowFeedback(false);
    setFeedback(null);
    setShowDefinition(true);
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  if (!lesson || !lesson.words) {
    return <div>Lesson not found</div>;
  }

  const currentWord = lesson.words[currentWordIndex];
  const progressPercentage = ((currentWordIndex + 1) / lesson.words.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/lessons/vocabulary')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">{lesson.title}</h1>
              <p className="text-sm text-slate-600">Vocabulary Practice</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRestart}
              className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Restart</span>
            </button>
            <div className="text-sm text-slate-600">
              {currentWordIndex + 1} / {lesson.words.length}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Side - Word List */}
        <div className="w-1/3 p-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800 flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Word List</span>
              </h3>
            </div>
            <div className="p-4 space-y-2 overflow-y-auto">
              {lesson.words.map((word, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    index === currentWordIndex
                      ? 'bg-orange-100 border-2 border-orange-300'
                      : index < currentWordIndex
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-slate-50 border border-slate-200 opacity-50'
                  }`}
                  onClick={() => index <= currentWordIndex && setCurrentWordIndex(index)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">{word.word}</span>
                    {index < currentWordIndex && (
                      <Check className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{word.phonetic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Flashcard and Practice */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
            {/* Flashcard */}
            <div className="p-8 text-center border-b border-slate-200">
              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <h2 className="text-4xl font-bold text-slate-800">{currentWord.word}</h2>
                  <button
                    onClick={() => speakWord(currentWord.word)}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <Volume2 className="w-6 h-6" />
                  </button>
                </div>
                
                <p className="text-lg text-slate-500 mb-4">{currentWord.phonetic}</p>
                
                {showDefinition && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <p className="text-slate-700 font-medium">{currentWord.definition}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-slate-600 mb-2">Examples:</h4>
                      <div className="space-y-2">
                        {currentWord.examples.map((example, index) => (
                          <div key={index} className="bg-blue-50 rounded p-3 text-left">
                            <p className="text-slate-700 italic">"{example}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => setShowDefinition(!showDefinition)}
                  className="mt-4 text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  {showDefinition ? 'Hide Definition' : 'Show Definition'}
                </button>
              </div>
            </div>

            {/* Practice Area */}
            <div className="flex-1 p-6">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Create a sentence using "{currentWord.word}"
                </h3>
                
                <div className="mb-4">
                  <textarea
                    value={userSentence}
                    onChange={(e) => setUserSentence(e.target.value)}
                    placeholder={`Write a sentence using the word "${currentWord.word}"...`}
                    className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-lg"
                    disabled={showFeedback}
                  />
                </div>

                {!showFeedback ? (
                  <button
                    onClick={handleCheck}
                    disabled={!userSentence.trim() || isLoading}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 px-6 rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        <span className="font-medium">Check Sentence</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span className="font-medium">
                      {currentWordIndex < lesson.words.length - 1 ? 'Next Word' : 'Complete Lesson'}
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}

                {/* Feedback */}
                {showFeedback && feedback && (
                  <div className="mt-6 bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-800">Feedback</h4>
                      <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                        feedback.score >= 8 ? 'bg-green-100 text-green-800' :
                        feedback.score >= 6 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {feedback.score}/10
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-slate-700">{feedback.feedback}</p>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-600">Uses target word:</span>
                        <span className={`text-sm font-medium ${feedback.usesWord ? 'text-green-600' : 'text-red-600'}`}>
                          {feedback.usesWord ? 'Yes ✓' : 'No ✗'}
                        </span>
                      </div>
                      
                      {feedback.suggestions.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-slate-600 block mb-1">Suggestions:</span>
                          <ul className="text-sm text-slate-700 space-y-1">
                            {feedback.suggestions.map((suggestion: string, index: number) => (
                              <li key={index} className="flex items-start space-x-1">
                                <span className="text-orange-500 mt-1">•</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyLesson;