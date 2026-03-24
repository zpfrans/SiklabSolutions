import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadComplete?: () => void;
}

function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExiting(true);
          setTimeout(() => {
            onLoadComplete?.();
          }, 800);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-800 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ isolation: 'isolate' }}
    >
      {/* Animated flame orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-brand via-orange-400 to-red-500 rounded-full filter blur-[120px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-yellow-400 via-brand to-red-400 rounded-full filter blur-[100px] opacity-15 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-br from-orange-300 to-brand rounded-full filter blur-[80px] opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 text-center px-4">
        {/* Flame Logo Animation */}
        <div className="mb-8 relative">
          {/* Outer flame glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-gradient-to-t from-brand via-orange-400 to-yellow-300 rounded-full filter blur-2xl opacity-60 animate-pulse"></div>
          </div>
          
          {/* Main flame container */}
          <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
            {/* Animated flame SVG */}
            <svg
              className="w-24 h-24 filter drop-shadow-2xl"
              viewBox="0 0 100 100"
              fill="none"
            >
              {/* Main flame */}
              <path
                d="M50 10 C40 20, 30 35, 30 50 C30 65, 37 75, 50 85 C63 75, 70 65, 70 50 C70 35, 60 20, 50 10 Z"
                fill="url(#flameGradient1)"
                className="animate-pulse"
              >
                <animate
                  attributeName="d"
                  dur="1.5s"
                  repeatCount="indefinite"
                  values="
                    M50 10 C40 20, 30 35, 30 50 C30 65, 37 75, 50 85 C63 75, 70 65, 70 50 C70 35, 60 20, 50 10 Z;
                    M50 8 C42 22, 32 33, 32 50 C32 67, 38 77, 50 87 C62 77, 68 67, 68 50 C68 33, 58 22, 50 8 Z;
                    M50 10 C40 20, 30 35, 30 50 C30 65, 37 75, 50 85 C63 75, 70 65, 70 50 C70 35, 60 20, 50 10 Z"
                />
              </path>
              
              {/* Inner flame */}
              <path
                d="M50 25 C45 30, 40 38, 40 48 C40 58, 43 65, 50 72 C57 65, 60 58, 60 48 C60 38, 55 30, 50 25 Z"
                fill="url(#flameGradient2)"
              >
                <animate
                  attributeName="d"
                  dur="1s"
                  repeatCount="indefinite"
                  values="
                    M50 25 C45 30, 40 38, 40 48 C40 58, 43 65, 50 72 C57 65, 60 58, 60 48 C60 38, 55 30, 50 25 Z;
                    M50 22 C46 32, 42 36, 42 48 C42 60, 44 67, 50 74 C56 67, 58 60, 58 48 C58 36, 54 32, 50 22 Z;
                    M50 25 C45 30, 40 38, 40 48 C40 58, 43 65, 50 72 C57 65, 60 58, 60 48 C60 38, 55 30, 50 25 Z"
                />
              </path>
              
              {/* Core flame */}
              <path
                d="M50 35 C47 38, 45 42, 45 48 C45 54, 46 58, 50 62 C54 58, 55 54, 55 48 C55 42, 53 38, 50 35 Z"
                fill="url(#flameGradient3)"
              >
                <animate
                  attributeName="d"
                  dur="0.8s"
                  repeatCount="indefinite"
                  values="
                    M50 35 C47 38, 45 42, 45 48 C45 54, 46 58, 50 62 C54 58, 55 54, 55 48 C55 42, 53 38, 50 35 Z;
                    M50 32 C48 40, 46 40, 46 48 C46 56, 47 60, 50 65 C53 60, 54 56, 54 48 C54 40, 52 40, 50 32 Z;
                    M50 35 C47 38, 45 42, 45 48 C45 54, 46 58, 50 62 C54 58, 55 54, 55 48 C55 42, 53 38, 50 35 Z"
                />
              </path>
              
              <defs>
                <linearGradient id="flameGradient1" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#FB923C" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="flameGradient2" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#FEF3C7" stopOpacity="1" />
                  <stop offset="50%" stopColor="#FDBA74" stopOpacity="1" />
                  <stop offset="100%" stopColor="#F97316" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="flameGradient3" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="50%" stopColor="#FEF3C7" stopOpacity="1" />
                  <stop offset="100%" stopColor="#FCD34D" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <h1 className="text-5xl font-bold text-charcoal mb-2 drop-shadow-lg">
            Siklab <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-brand-200 to-accent">Solutions</span>
          </h1>
          <p className="text-warmBrown text-base font-medium tracking-wide">Igniting Innovation</p>
        </div>

        {/* Progress bar */}
        <div className="w-72 h-1.5 bg-warmBrown/20 rounded-full overflow-hidden mx-auto backdrop-blur-sm border border-brand/20">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 via-brand to-red-500 rounded-full transition-all duration-300 ease-out shadow-[0_0_20px_rgba(255,107,53,0.6)]"
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>

        {/* Loading text */}
        <p className="mt-6 text-warmBrown text-sm font-medium animate-pulse">
          Igniting your experience...
        </p>

        {/* Flame particles */}
        <div className="flex gap-3 justify-center mt-8">
          <div className="w-2 h-2 bg-gradient-to-t from-brand to-yellow-400 rounded-full animate-bounce shadow-lg shadow-brand/50"></div>
          <div className="w-2 h-2 bg-gradient-to-t from-red-500 to-orange-400 rounded-full animate-bounce shadow-lg shadow-red-500/50" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gradient-to-t from-brand to-yellow-300 rounded-full animate-bounce shadow-lg shadow-brand/50" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-gradient-to-t from-orange-500 to-yellow-400 rounded-full animate-bounce shadow-lg shadow-orange-500/50" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
