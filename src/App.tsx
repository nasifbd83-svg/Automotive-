/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Calculator, 
  Brush, 
  Hammer, 
  Car, 
  Waves, 
  Thermometer, 
  Droplets, 
  Zap, 
  Fuel, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Trophy,
  CheckCircle2,
  XCircle,
  LayoutDashboard,
  User,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { modules, Module, Question } from "./data/questions";

// Icon mapping
const iconMap: Record<string, any> = {
  ShieldAlert,
  Calculator,
  Brush,
  Hammer,
  Car,
  Waves,
  Thermometer,
  Droplets,
  Zap,
  Fuel,
  Sparkles
};

type View = "welcome" | "home" | "quiz" | "result";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("welcome");
  const [userName, setUserName] = useState("");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});

  // Load name and progress from local storage
  useEffect(() => {
    const savedName = localStorage.getItem("automotive-quiz-user-name");
    const savedProgress = localStorage.getItem("automotive-quiz-progress");
    
    if (savedName) {
      setUserName(savedName);
      setCurrentView("home");
      // Notify on entry for returning users
      sendTelegramNotification(`${savedName} (Returning)`);
    }
    
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Default Telegram Configuration
  const TG_TOKEN = "8768540070:AAEA4Y0O5tZ8Ef-6vvorNnCtwP7PiOF23ns";
  const TG_CHAT_ID = "8768540070";

  const sendTelegramNotification = async (name: string) => {
    try {
      const message = `New User Entered Website: ${name}`;
      await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TG_CHAT_ID,
          text: message
        })
      });
      console.log("Telegram notification sent successfully");
    } catch (error) {
      console.error("Failed to send Telegram notification:", error);
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      const name = userName.trim();
      localStorage.setItem("automotive-quiz-user-name", name);
      sendTelegramNotification(name);
      setCurrentView("home");
    }
  };

  const startQuiz = (module: Module) => {
    setSelectedModule(module);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(module.questions.length).fill(null));
    setScore(0);
    setShowFeedback(false);
    setCurrentView("quiz");
    window.scrollTo(0, 0);
  };

  const handleAnswer = (optionIndex: number) => {
    if (showFeedback) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
    setShowFeedback(true);

    if (optionIndex === selectedModule?.questions[currentQuestionIndex].answer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (selectedModule && currentQuestionIndex < selectedModule.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowFeedback(false);
    } else {
      if (selectedModule) {
        saveProgress(selectedModule.id, score, selectedModule.questions.length);
      }
      setCurrentView("result");
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowFeedback(false);
    }
  };

  const resetQuiz = () => {
    setCurrentView("home");
    setSelectedModule(null);
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  const saveProgress = (moduleId: string, score: number, total: number) => {
    const newProgress = { ...progress, [moduleId]: Math.round((score / total) * 100) };
    setProgress(newProgress);
    localStorage.setItem("automotive-quiz-progress", JSON.stringify(newProgress));
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-slate-100 font-sans selection:bg-amber-500/30 overflow-x-hidden relative">
      {/* Background Mesh Glows */}
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] pointer-events-none rounded-full z-0"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-orange-600/10 blur-[100px] pointer-events-none rounded-full z-0"></div>

      <AnimatePresence mode="wait">
        {currentView === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0c0c0e]"
          >
            <div className="w-full max-w-md relative">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl text-center space-y-8 relative overflow-hidden"
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
                
                <div className="space-y-4">
                  <div className="inline-flex p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 shadow-inner">
                    <Car className="w-12 h-12 text-amber-500" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl font-black tracking-tight text-white">স্বাগতম!</h1>
                    <p className="text-slate-400 font-medium">অটোমোটিভ মেকানিক লেভেল ১ টেস্ট-এ আপনার যাত্রা শুরু করুন</p>
                  </div>
                </div>

                <form onSubmit={handleNameSubmit} className="space-y-6 text-left">
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">আপনার নাম</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                      <input 
                        type="text" 
                        required
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="আপনার নাম লিখুন"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all font-medium"
                      />
                    </div>
                  </motion.div>

                  <motion.button 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-[#0c0c0e] font-black py-4 rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group italic"
                  >
                    প্রবেশ করুন
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </form>
              </motion.div>

              {/* Tagline */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-8 text-[10px] text-slate-600 uppercase tracking-[0.3em] font-bold"
              >
                Premium Automotive Training Experience
              </motion.p>
            </div>
          </motion.div>
        )}

        {currentView !== "welcome" && (
          <motion.div 
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col min-h-screen relative z-10"
          >
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#16161a]/80 backdrop-blur-md border-b border-white/10 py-4 px-6 md:px-12 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-amber-500 p-2.5 rounded-xl shadow-lg shadow-amber-500/20">
                  <Car className="w-6 h-6 text-[#0c0c0e]" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-white">
                    অটোমোটিভ মেকানিক লেভেল ১ টেস্ট
                  </h1>
                  <p className="text-[10px] text-amber-500/80 font-bold uppercase tracking-wider">নিজেকে যাচাই করুন • {userName}</p>
                </div>
              </div>
              {currentView !== "home" && (
                <button 
                  onClick={() => setCurrentView("home")}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
                  title="মূল পাতা"
                >
                  <LayoutDashboard className="w-6 h-6 text-slate-400 group-hover:text-amber-500" />
                </button>
              )}
            </header>

            <main className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-12 pb-32">
              <AnimatePresence mode="wait">
                {currentView === "home" && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                  >
                    <div className="col-span-full mb-6 flex items-end justify-between border-b border-white/5 pb-4">
                      <div>
                        <h2 className="text-3xl font-black text-white flex items-center gap-3">
                          <LayoutDashboard className="w-8 h-8 text-amber-500" />
                          মডিউল সমূহ
                        </h2>
                        <p className="text-slate-500 font-medium mt-1">আপনার দক্ষতা পরীক্ষার জন্য একটি বিভাগ বেছে নিন</p>
                      </div>
                      <div className="hidden md:block text-right">
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Total Score</span>
                        <p className="text-xl font-black text-amber-500">
                          {Math.round(Object.values(progress).reduce((a, b) => a + b, 0) / (modules.length || 1))}%
                        </p>
                      </div>
                    </div>

                    {modules.map((module, index) => {
                      const Icon = iconMap[module.icon] || ShieldAlert;
                      const progressVal = progress[module.id] || 0;
                      
                      return (
                        <motion.button
                          key={module.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
                          onClick={() => startQuiz(module)}
                          className="relative group flex flex-col items-start p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:border-amber-500/40 hover:bg-white/[0.08] transition-all text-left overflow-hidden h-full"
                        >
                          <div className="flex w-full items-center justify-between mb-6">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-amber-500/20 group-hover:text-amber-500 transition-all">
                              <Icon className="w-8 h-8" />
                            </div>
                            {progressVal > 0 && (
                              <div className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-tighter ${progressVal >= 80 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                {progressVal}% পাস
                              </div>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors mb-4 line-clamp-2 min-h-[3.5rem]">
                            {module.name}
                          </h3>
                          <div className="mt-auto flex items-center gap-2 text-xs font-black text-amber-500 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                            শুরু করুন <ChevronRight className="w-4 h-4" />
                          </div>

                          <div className="absolute -bottom-8 -right-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                            <Icon className="w-32 h-32" />
                          </div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}

                {currentView === "quiz" && selectedModule && (
                  <motion.div
                    key="quiz"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="max-w-3xl mx-auto space-y-8"
                  >
                    {/* Top Progress */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">চলমান কুইজ</span>
                          <h2 className="text-2xl font-black text-white mt-1">{selectedModule.name}</h2>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-slate-400">প্রশ্ন <span className="text-amber-500 font-black text-lg">{currentQuestionIndex + 1}</span> / {selectedModule.questions.length}</span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentQuestionIndex + 1) / selectedModule.questions.length) * 100}%` }}
                          className="h-full bg-gradient-to-r from-amber-600 to-orange-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                        />
                      </div>
                    </div>

                    {/* Question Card */}
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative">
                      <div className="absolute -top-4 -left-4 w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-[#0c0c0e] font-black text-xl shadow-lg shadow-amber-500/20">
                        {currentQuestionIndex + 1}
                      </div>
                      
                      <h2 className="text-2xl font-bold text-white mb-10 leading-relaxed">
                        {selectedModule.questions[currentQuestionIndex].question}
                      </h2>

                      <div className="grid grid-cols-1 gap-4">
                        {selectedModule.questions[currentQuestionIndex].options.map((option, idx) => {
                          const isSelected = userAnswers[currentQuestionIndex] === idx;
                          const isCorrect = selectedModule.questions[currentQuestionIndex].answer === idx;
                          const showCorrect = showFeedback && isCorrect;
                          const showWrong = showFeedback && isSelected && !isCorrect;

                          return (
                            <button
                              key={idx}
                              disabled={showFeedback}
                              onClick={() => handleAnswer(idx)}
                              className={`
                                relative group flex items-center gap-4 p-5 rounded-[1.5rem] border transition-all text-left
                                ${!showFeedback ? 'bg-white/5 border-white/5 hover:border-amber-500/50 hover:bg-white/10 cursor-pointer' : 'cursor-default'}
                                ${showCorrect ? 'bg-green-500/10 border-green-500/50 text-green-200 ring-2 ring-green-500/20' : ''}
                                ${showWrong ? 'bg-red-500/10 border-red-500/50 text-red-200' : ''}
                                ${isSelected && !showFeedback ? 'border-amber-500 bg-amber-500/10 text-amber-200' : ''}
                                ${!showCorrect && !showWrong && showFeedback ? 'opacity-30 border-transparent' : ''}
                              `}
                            >
                              <div className={`
                                w-8 h-8 rounded-xl border flex items-center justify-center text-xs font-black transition-all
                                ${showCorrect ? 'bg-green-500 border-green-400 text-slate-900' : ''}
                                ${showWrong ? 'bg-red-500 border-red-400 text-slate-900' : ''}
                                ${isSelected && !showFeedback ? 'bg-amber-500 border-amber-400 text-slate-900 shadow-lg shadow-amber-500/20' : 'bg-white/5 border-white/10 group-hover:border-amber-500/50 group-hover:text-amber-500'}
                              `}>
                                {String.fromCharCode(65 + idx)}
                              </div>
                              <span className="flex-grow font-bold text-slate-200">{option}</span>
                              {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                              {showWrong && <XCircle className="w-5 h-5 text-red-500" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Feedback Text */}
                      {showFeedback && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mt-8 p-4 rounded-2xl border flex items-center gap-3 ${userAnswers[currentQuestionIndex] === selectedModule.questions[currentQuestionIndex].answer ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
                        >
                          {userAnswers[currentQuestionIndex] === selectedModule.questions[currentQuestionIndex].answer ? (
                            <>
                              <CheckCircle2 className="w-5 h-5" />
                              <p className="text-sm font-bold">চমত্কার! সঠিক উত্তর।</p>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5" />
                              <p className="text-sm font-bold">ভুল উত্তর। সঠিক উত্তরটি সবুজ চিহ্নিত করা হয়েছে।</p>
                            </>
                          )}
                        </motion.div>
                      )}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={prevQuestion}
                        disabled={currentQuestionIndex === 0}
                        className={`
                          flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all border
                          ${currentQuestionIndex === 0 ? 'opacity-20 pointer-events-none' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}
                        `}
                      >
                        <ChevronLeft className="w-5 h-5" /> পূর্ববর্তী
                      </button>

                      <button
                        onClick={nextQuestion}
                        disabled={!showFeedback}
                        className={`
                          flex items-center gap-2 px-10 py-3 rounded-full font-black tracking-widest transition-all shadow-2xl
                          ${!showFeedback 
                            ? 'bg-white/5 text-slate-600 border border-white/5 opacity-50 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-amber-500 to-orange-600 text-[#0c0c0e] shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]'}
                        `}
                      >
                        {currentQuestionIndex === selectedModule.questions.length - 1 ? 'ফলাফল দেখুন' : 'পরবর্তী প্রশ্ন'} 
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {currentView === "result" && selectedModule && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center space-y-10 py-12"
                  >
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-amber-500 blur-[100px] opacity-20 rounded-full animate-pulse" />
                      <div className="relative bg-white/5 border-2 border-white/10 p-10 rounded-[3rem] shadow-3xl">
                        <Trophy className="w-24 h-24 text-yellow-400 mx-auto" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h2 className="text-4xl font-black text-white tracking-tight">অভিনন্দন, {userName}!</h2>
                      <p className="text-slate-500 text-lg font-bold uppercase tracking-widest">{selectedModule.name}</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 max-w-sm mx-auto shadow-2xl space-y-8">
                      <div className="flex items-center justify-center gap-8">
                        <div className="text-center">
                          <p className="text-5xl font-black text-amber-500">{score}</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pt-2">সঠিক</p>
                        </div>
                        <div className="h-16 w-px bg-white/10" />
                        <div className="text-center">
                          <p className="text-5xl font-black text-white">{selectedModule.questions.length}</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pt-2">মোট</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-xs font-black text-slate-500 uppercase tracking-widest">
                          <span>প্রোগ্রেস</span>
                          <span className={Math.round((score / selectedModule.questions.length) * 100) >= 80 ? "text-green-400" : "text-amber-400"}>
                            {Math.round((score / selectedModule.questions.length) * 100)}%
                          </span>
                        </div>
                        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(score / selectedModule.questions.length) * 100}%` }}
                            className={`h-full rounded-full ${Math.round((score / selectedModule.questions.length) * 100) >= 80 ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]" : "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]"}`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4">
                      <button
                        onClick={() => startQuiz(selectedModule)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/10 group active:scale-95"
                      >
                        <RotateCcw className="w-5 h-5 text-amber-500 group-hover:rotate-180 transition-transform duration-500" /> 
                        আবার পরীক্ষা দিন
                      </button>
                      <button
                        onClick={resetQuiz}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-[#0c0c0e] rounded-2xl font-black shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        নতুন মডিউল
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className="h-20 bg-[#0c0c0e]/80 backdrop-blur-md border-t border-white/5 px-8 flex items-center justify-between shrink-0 z-50">
              <div className="flex items-center">
                <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 shadow-inner">
                  <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
                    Automotive Mechanic
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                 <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                   <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Made by</span>
                   <a 
                     href="https://www.facebook.com/share/14bpMrMwKvK/" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-xs font-black text-amber-500 hover:text-amber-400 transition-colors tracking-[0.2em] uppercase cursor-pointer"
                   >
                     Nasif
                   </a>
                 </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
