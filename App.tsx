
import React, { useState, useEffect } from 'react';
import { GameState, Player, Puzzle, Device } from './types';
import { generatePuzzles } from './services/geminiService';
import { 
  Bluetooth, Trophy, Play, Users, ArrowRight,
  Home, RefreshCw, HelpCircle, Star, Heart, Map as MapIcon,
  Gamepad2, Sparkles, LayoutGrid, ChevronLeft, Menu
} from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.HOME);
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'البطل', avatar: '🦁', score: 0, isHost: true }
  ]);
  const [devices, setDevices] = useState<Device[]>([
    { id: 'dev-2', name: 'جهاز أحمد', status: 'available' },
    { id: 'dev-3', name: 'جهاز سارة', status: 'available' }
  ]);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [lives, setLives] = useState(3);

  const goBack = () => {
    if (gameState === GameState.PLAYING) {
      if (window.confirm('هل تريد حقاً الخروج من التحدي؟')) setGameState(GameState.LEVEL_SELECT);
    } else {
      setGameState(GameState.HOME);
    }
  };

  const startLevel = async () => {
    setIsLoading(true);
    try {
      const newPuzzles = await generatePuzzles();
      setPuzzles(newPuzzles);
      setGameState(GameState.PLAYING);
      setCurrentPuzzleIndex(0);
      setLives(3);
      setShowHint(false);
      setFeedback(null);
    } catch (error) {
      alert('حدث خطأ في تحميل الألغاز، يرجى المحاولة لاحقاً');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (option: string) => {
    const currentPuzzle = puzzles[currentPuzzleIndex];
    if (option === currentPuzzle.answer) {
      setFeedback({ type: 'success', msg: 'عبقري! 🌟' });
      setPlayers(prev => prev.map(p => p.id === '1' ? { ...p, score: p.score + currentPuzzle.points } : p));
      
      setTimeout(() => {
        setFeedback(null);
        if (currentPuzzleIndex + 1 < puzzles.length) {
          setCurrentPuzzleIndex(prev => prev + 1);
          setShowHint(false);
        } else {
          setGameState(GameState.RESULTS);
        }
      }, 1200);
    } else {
      setFeedback({ type: 'error', msg: 'حاول مجدداً! 💡' });
      setLives(prev => Math.max(0, prev - 1));
      if (lives <= 1) {
         setTimeout(() => {
           setFeedback(null);
           alert('انتهت المحاولات! حاول مرة أخرى في مستوى جديد.');
           setGameState(GameState.LEVEL_SELECT);
         }, 1000);
      } else {
        setTimeout(() => setFeedback(null), 1000);
      }
    }
  };

  return (
    <div className="min-h-screen mm-gradient text-white flex flex-col font-bold selection:bg-yellow-400 overflow-hidden">
      {/* Header - Unified for Mobile and Desktop */}
      <header className="p-3 bg-white/10 backdrop-blur-xl flex justify-between items-center sticky top-0 z-50 border-b border-white/10 safe-top">
        <div className="flex items-center gap-2">
          {gameState !== GameState.HOME && (
            <button onClick={goBack} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all active:scale-90">
              <ChevronLeft className="w-5 h-5 rotate-180" />
            </button>
          )}
          <div className="flex items-center">
            <span className="text-xl font-black bg-white text-blue-600 px-2 rounded-md ml-1 shadow-sm">M</span>
            <span className="text-xl font-black bg-yellow-400 text-black px-2 rounded-md shadow-sm">M</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {gameState === GameState.PLAYING && (
            <div className="flex gap-1 bg-black/20 p-1.5 rounded-full">
              {[...Array(3)].map((_, i) => (
                <Heart key={i} className={`w-4 h-4 md:w-5 md:h-5 ${i < lives ? 'text-red-500 fill-red-500' : 'text-white/20'}`} />
              ))}
            </div>
          )}
          <div className="bg-black/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm">{players[0].score}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        
        {/* Home Screen */}
        {gameState === GameState.HOME && (
          <div className="text-center space-y-8 md:space-y-12 w-full animate-in fade-in duration-500">
            <div className="relative inline-block">
              <div className="absolute -inset-10 bg-white/20 blur-3xl rounded-full animate-pulse"></div>
              <div className="relative animate-float">
                <div className="bg-white/10 backdrop-blur-2xl p-6 md:p-10 rounded-[40px] border border-white/20 shadow-2xl">
                   <Gamepad2 className="w-24 h-24 md:w-32 md:h-32 text-white drop-shadow-lg mx-auto" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-2xl tracking-tight">M&M PUZZLE</h2>
              <p className="text-lg md:text-xl text-yellow-200">عالم الأبطال الصغار</p>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full px-4">
              <button 
                onClick={() => setGameState(GameState.LEVEL_SELECT)}
                className="group bg-yellow-400 text-black p-5 md:p-6 rounded-3xl text-xl md:text-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
              >
                <Play className="w-8 h-8 fill-current" />
                <span>ابدأ اللعب الآن</span>
              </button>
              <button 
                onClick={() => setGameState(GameState.BLUETOOTH_DISCOVERY)}
                className="group bg-white/10 backdrop-blur-md border border-white/20 p-5 md:p-6 rounded-3xl text-xl md:text-2xl shadow-xl hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center gap-4"
              >
                <Bluetooth className="w-8 h-8" />
                <span>اللعب مع صديق</span>
              </button>
            </div>
            
            <div className="pt-8 opacity-60">
               <p className="text-xs">المطور: سام جميل القدسي</p>
            </div>
          </div>
        )}

        {/* Level Selection */}
        {gameState === GameState.LEVEL_SELECT && (
          <div className="w-full space-y-6 md:space-y-8 animate-in slide-in-from-bottom-5 duration-300 px-2">
            <div className="flex items-center justify-center gap-3 mb-2">
              <MapIcon className="w-6 h-6 text-yellow-300" />
              <h3 className="text-2xl md:text-3xl">اختر جزيرة التحدي</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {[
                { name: 'جزيرة الأرقام', icon: '🔢', color: 'bg-blue-500' },
                { name: 'مملكة الأشكال', icon: '🎨', color: 'bg-purple-500' },
                { name: 'غابة الألغاز', icon: '🌳', color: 'bg-emerald-500' },
                { name: 'كهف المنطق', icon: '💡', color: 'bg-orange-500' },
                { name: 'قلعة الرموز', icon: '🏰', color: 'bg-red-500' },
                { name: 'تحدي الذكاء', icon: '🏆', color: 'bg-yellow-600' }
              ].map((level, i) => (
                <button
                  key={i}
                  onClick={startLevel}
                  className={`${level.color} p-5 md:p-8 rounded-[28px] md:rounded-[32px] shadow-lg hover:scale-105 active:scale-95 transition-all flex flex-col items-center gap-3 relative overflow-hidden group`}
                >
                  <span className="text-4xl md:text-5xl">{level.icon}</span>
                  <span className="text-sm md:text-lg font-bold text-center leading-tight">{level.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bluetooth Discovery */}
        {gameState === GameState.BLUETOOTH_DISCOVERY && (
          <div className="w-full max-w-sm space-y-6 animate-in fade-in duration-300">
            <div className="bg-white/10 p-8 rounded-[32px] text-center space-y-4 border border-white/20">
               <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto flex items-center justify-center animate-pulse">
                  <Bluetooth className="w-10 h-10" />
               </div>
               <h3 className="text-xl md:text-2xl">جاري البحث عن أبطال...</h3>
               <p className="text-xs md:text-sm text-white/60">اطلب من صديقك فتح اللعبة أيضاً</p>
            </div>
            <div className="space-y-3">
              {devices.map(dev => (
                <button key={dev.id} className="w-full bg-white/5 p-4 rounded-2xl flex items-center justify-between border border-white/10">
                  <span className="flex items-center gap-3 text-sm"><Users className="w-4 h-4 text-emerald-400" /> {dev.name}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full uppercase">متصل</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Game Playing Area */}
        {gameState === GameState.PLAYING && puzzles[currentPuzzleIndex] && (
          <div className="w-full flex flex-col gap-4 md:gap-6 animate-in fade-in duration-300 pb-20">
            {/* Feedback Pop-up */}
            {feedback && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none px-10">
                <div className={`${feedback.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} p-8 rounded-[32px] shadow-2xl scale-110 animate-in zoom-in-50 duration-200 border-4 border-white/30`}>
                   <span className="text-3xl md:text-5xl text-white font-black drop-shadow-lg">{feedback.msg}</span>
                </div>
              </div>
            )}

            <div className="bg-white text-slate-900 rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col border border-white/20">
              <div className="bg-slate-50 p-4 md:p-6 flex justify-between items-center border-b border-slate-100">
                <div className="flex items-center gap-2">
                   <div className="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">{currentPuzzleIndex + 1}</div>
                   <span className="text-slate-400 text-sm font-medium">من {puzzles.length}</span>
                </div>
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">{puzzles[currentPuzzleIndex].type}</span>
              </div>

              <div className="p-6 md:p-10 space-y-6 md:space-y-8 text-center">
                <h3 className="text-2xl md:text-3xl font-black leading-tight text-slate-800">
                  {puzzles[currentPuzzleIndex].question}
                </h3>

                {/* Visual Content - Scaled for Mobile */}
                {puzzles[currentPuzzleIndex].visualData && (
                  <div className="flex justify-center flex-wrap gap-3 md:gap-5 p-4 md:p-8 bg-slate-50 rounded-[28px] border-2 border-dashed border-slate-200 min-h-[120px] items-center">
                    {puzzles[currentPuzzleIndex].visualData.map((item, i) => (
                      <span key={i} className="text-5xl md:text-7xl animate-float" style={{ animationDelay: `${i * 0.15}s` }}>
                        {item}
                      </span>
                    ))}
                    {puzzles[currentPuzzleIndex].type === 'visual_pattern' && (
                       <span className="text-5xl md:text-7xl text-emerald-500 animate-pulse font-black">؟</span>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pt-2">
                  {puzzles[currentPuzzleIndex].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(opt)}
                      className="p-5 md:p-6 text-xl md:text-2xl font-bold bg-white hover:bg-emerald-500 hover:text-white border-2 border-slate-100 hover:border-emerald-600 rounded-[22px] md:rounded-[26px] transition-all active:scale-95 flex items-center justify-center text-center shadow-sm"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowHint(!showHint)} className="bg-white/10 p-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/20 border border-white/10 active:scale-95 transition-all">
                <HelpCircle className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">تلميح</span>
              </button>
              <button onClick={() => setGameState(GameState.HOME)} className="bg-white/5 p-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 border border-white/5 active:scale-95 transition-all">
                <Home className="w-5 h-5 text-blue-300" />
                <span className="text-sm">الرئيسية</span>
              </button>
            </div>

            {showHint && (
              <div className="bg-yellow-400 text-black p-5 rounded-3xl animate-in slide-in-from-top-2 shadow-xl border-b-4 border-yellow-600">
                 <p className="text-sm md:text-base font-bold">💡 {puzzles[currentPuzzleIndex].hint}</p>
              </div>
            )}
          </div>
        )}

        {/* Results Screen */}
        {gameState === GameState.RESULTS && (
          <div className="text-center space-y-8 w-full animate-in zoom-in-95 duration-500 px-4">
            <div className="relative inline-block">
               <Trophy className="w-40 h-40 md:w-56 md:h-56 text-yellow-400 mx-auto drop-shadow-2xl relative z-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h2 className="text-5xl md:text-6xl font-black">عبقري مذهل!</h2>
              <p className="text-lg md:text-xl text-yellow-200">لقد حققت فوزاً ساحقاً</p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[32px] border border-white/20 space-y-4 max-w-sm mx-auto">
               <div className="flex justify-between items-center px-2">
                 <span className="text-lg md:text-xl">رصيدك الجديد:</span>
                 <span className="text-4xl text-yellow-400 font-black">{players[0].score}</span>
               </div>
               <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                 <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 animate-shimmer" style={{ width: '100%' }}></div>
               </div>
            </div>

            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <button 
                onClick={() => setGameState(GameState.LEVEL_SELECT)}
                className="bg-white text-blue-600 p-5 rounded-3xl text-xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <RefreshCw className="w-5 h-5" /> تحدي جديد
              </button>
              <button 
                onClick={() => setGameState(GameState.HOME)}
                className="text-white/60 p-3 hover:text-white text-sm"
              >
                العودة للشاشة الرئيسية
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Persistent Footer on Home Screen Only */}
      {gameState === GameState.HOME && (
        <footer className="p-4 bg-black/10 text-center safe-bottom">
           <p className="text-[10px] opacity-40 uppercase tracking-[0.2em]">© 2025 M&M PUZZLE • SAM JAMIL AL-QUDSI</p>
        </footer>
      )}

      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] flex flex-col items-center justify-center p-10 text-center">
           <div className="w-20 h-20 border-8 border-blue-500 border-t-yellow-400 rounded-full animate-spin mb-6 shadow-2xl"></div>
           <p className="text-xl md:text-2xl font-black text-yellow-400 animate-pulse">جاري تجهيز جزر الذكاء...</p>
           <p className="text-xs text-white/40 mt-2">انتظر قليلاً أيها البطل</p>
        </div>
      )}
    </div>
  );
};

export default App;
