import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MobileBottomNav } from '../components/Layout/MobileBottomNav';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { CheckCircle, XCircle, Play, BookOpen, Award, ArrowLeft, ShieldAlert, Droplets, Flame, User, Timer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDrillTypes, saveDrillResult } from '../services/drillService';
import { useTranslation } from 'react-i18next';

ChartJS.register(ArcElement, Tooltip, Legend);

export const MockDrills = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('online');
  const [selectedDrill, setSelectedDrill] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [answers, setAnswers] = useState({});
  
  // New State for Enhanced Stats
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [categoryScores, setCategoryScores] = useState({});
  
  // Guest Mode State
  const [guestName, setGuestName] = useState('');
  const [isGuestReady, setIsGuestReady] = useState(false);

  const drillTypes = getDrillTypes();

  // Timer Effect
  useEffect(() => {
    let interval;
    if (selectedDrill && !showScore) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selectedDrill, showScore]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startDrill = (drill) => {
    setSelectedDrill(drill);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setAnswers({});
    setElapsedTime(0);
    setStartTime(Date.now());
    setCategoryScores({});
  };

  const handleAnswer = (optionIndex) => {
    const question = selectedDrill.questions[currentQuestion];
    const isCorrect = optionIndex === question.correct;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setCategoryScores(prev => ({
        ...prev,
        [question.category]: (prev[question.category] || 0) + 1
      }));
    }
    
    setAnswers({ ...answers, [currentQuestion]: optionIndex });

    if (currentQuestion + 1 < selectedDrill.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishDrill(isCorrect ? score + 1 : score, isCorrect ? {
        ...categoryScores,
        [question.category]: (categoryScores[question.category] || 0) + 1
      } : categoryScores);
    }
  };

  const finishDrill = (finalScore, finalCategoryScores) => {
    setShowScore(true);
    saveDrillResult({
      userId: user ? user.uid : `guest-${Date.now()}`,
      userName: user ? (user.displayName || user.email) : `${guestName} (Guest)`,
      drillId: selectedDrill.id,
      drillTitle: selectedDrill.title,
      score: finalScore,
      totalQuestions: selectedDrill.questions.length,
      timeTaken: elapsedTime,
      categoryScores: finalCategoryScores
    });
  };

  const resetQuiz = () => {
    setSelectedDrill(null);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setAnswers({});
    setElapsedTime(0);
  };

  // Prepare Chart Data based on Categories
  const chartLabels = Object.keys(categoryScores).length > 0 
    ? [...Object.keys(categoryScores), 'Incorrect'] 
    : ['Correct', 'Incorrect'];
    
  const chartValues = Object.keys(categoryScores).length > 0
    ? [...Object.values(categoryScores), (selectedDrill?.questions.length || 0) - score]
    : [score, (selectedDrill?.questions.length || 0) - score];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartValues,
        backgroundColor: [
          '#3b82f6', // Blue (Response)
          '#10b981', // Green (Awareness)
          '#8b5cf6', // Purple (Knowledge)
          '#f59e0b', // Orange (Resources)
          '#ef4444'  // Red (Incorrect)
        ],
        borderColor: '#1e293b',
        borderWidth: 2,
      },
    ],
  };

  const getIcon = (id) => {
    switch(id) {
      case 'earthquake': return <ShieldAlert className="w-8 h-8 text-orange-500" />;
      case 'flood': return <Droplets className="w-8 h-8 text-blue-500" />;
      case 'fire': return <Flame className="w-8 h-8 text-red-500" />;
      default: return <Play className="w-8 h-8 text-slate-400" />;
    }
  };

  // Guest Login Screen
  if (!user && !isGuestReady) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 max-w-md w-full shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">{t('drills.guest_access')}</h1>
            <p className="text-slate-400 text-sm">{t('drills.enter_name')}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-slate-400 text-xs font-bold uppercase mb-2">Your Name</label>
              <input 
                type="text" 
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button 
              onClick={() => {
                if (guestName.trim().length > 0) setIsGuestReady(true);
              }}
              disabled={guestName.trim().length === 0}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3 rounded-lg transition-colors"
            >
              {t('drills.start_training')}
            </button>
            <Link to="/" className="block text-center text-slate-500 hover:text-white text-sm font-bold mt-4 transition-colors">
              {t('drills.cancel')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6 pb-24 md:pb-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t('drills.title')}</h1>
            <p className="text-slate-400">{t('drills.subtitle')}</p>
          </div>
          {!user && (
            <div className="text-right">
              <p className="text-slate-500 text-xs uppercase font-bold">{t('drills.guest_mode')}</p>
              <p className="text-white font-bold">{guestName}</p>
              <button 
                onClick={() => setIsGuestReady(false)} 
                className="text-blue-400 text-xs hover:underline mt-1"
              >
                {t('drills.change_user')}
              </button>
            </div>
          )}
        </header>

        <div className="mb-6">
           <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl hover:border-slate-700">
              <ArrowLeft className="w-4 h-4" /> {t('drills.back_web')}
           </Link>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => { setActiveTab('online'); setSelectedDrill(null); }}
            className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors ${
              activeTab === 'online' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Play className="w-5 h-5" />
            {t('drills.online_quiz')}
          </button>
          <button
            onClick={() => setActiveTab('offline')}
            className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors ${
              activeTab === 'offline' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            {t('drills.offline_drills')}
          </button>
        </div>

        {activeTab === 'online' && (
          <>
            {!selectedDrill ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drillTypes.map((drill) => (
                  <button
                    key={drill.id}
                    onClick={() => startDrill(drill)}
                    className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-blue-500 hover:bg-slate-800/50 transition-all text-left group"
                  >
                    <div className="mb-4 p-3 bg-slate-800 rounded-lg w-fit group-hover:bg-slate-700 transition-colors">
                      {getIcon(drill.id)}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{drill.title}</h3>
                    <p className="text-slate-400 text-sm mb-4">{drill.description}</p>
                    <div className="flex items-center text-xs text-blue-400 font-bold uppercase tracking-wider">
                      {t('drills.start_drill')} <Play className="w-3 h-3 ml-1" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">
                  {!showScore ? (
                    <>
                      <div className="flex justify-between items-center mb-6">
                        <button 
                          onClick={() => setSelectedDrill(null)}
                          className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium"
                        >
                          <ArrowLeft className="w-4 h-4" /> {t('drills.back_drills')}
                        </button>
                        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                          <Timer className="w-4 h-4 text-blue-400" />
                          <span className="text-white font-mono font-bold">{formatTime(elapsedTime)}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-slate-400 font-mono">Question {currentQuestion + 1}/{selectedDrill.questions.length}</span>
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                          {selectedDrill.questions[currentQuestion].category}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-8">
                        {selectedDrill.questions[currentQuestion].question}
                      </h2>
                      <div className="space-y-4">
                        {selectedDrill.questions[currentQuestion].options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            className="w-full text-left p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all border border-slate-700 hover:border-blue-500"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Award className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-2">{t('drills.completed')}</h2>
                      <p className="text-slate-400 mb-2">{t('drills.score', { score, total: selectedDrill.questions.length })}</p>
                      <p className="text-slate-500 text-sm mb-8 font-mono">{t('drills.time')}: {formatTime(elapsedTime)}</p>
                      <button
                        onClick={resetQuiz}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-bold transition-colors"
                      >
                        {t('drills.back_menu')}
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 flex flex-col items-center justify-center">
                  <h3 className="text-xl font-bold text-white mb-6">{t('drills.analysis')}</h3>
                  {showScore ? (
                    <div className="w-full max-w-xs mx-auto aspect-square relative">
                      <Pie data={chartData} options={{ 
                        maintainAspectRatio: true, 
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: { color: '#94a3b8' }
                          }
                        }
                      }} />
                    </div>
                  ) : (
                    <div className="text-center text-slate-500">
                      <div className="w-16 h-16 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                      <p>Complete the quiz to see your detailed breakdown</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'offline' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Earthquake Drill", desc: "Practice Drop, Cover, and Hold On in your living room.", time: "15 mins" },
              { title: "Fire Evacuation", desc: "Map out two escape routes from every room.", time: "30 mins" },
              { title: "Emergency Kit Check", desc: "Audit your supplies and replace expired items.", time: "45 mins" },
            ].map((drill, i) => (
              <div key={i} className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-blue-500 transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <BookOpen className="w-6 h-6 text-slate-400 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{drill.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{drill.desc}</p>
                <div className="flex items-center text-xs text-slate-500 font-mono">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Est. Time: {drill.time}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <MobileBottomNav active="drills" />
    </div>
  );
};
