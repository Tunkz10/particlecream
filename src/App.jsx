import React, { useState, useRef, useEffect, useCallback } from "react";
import useScaleUI from "./hooks/useScaleUI";
import { useSound } from "./hooks/useSound";
import EndScreen from "./components/EndScreen";

// --- REMOVED: import BackgroundLayout from "./components/BackgroundLayout"; ---

// Image Imports (Background & Assets)
import backgroundImg from "./assets/img/background.jpg";
import molecule01 from "./assets/img/Molecule_01.png";
import molecule02 from "./assets/img/Molecule_02.png";

import wheelImg from "./assets/img/WHEEL.png";
import insideImg from "./assets/img/inside.png";
import stopButton from "./assets/img/STOP_BUTTON.png";
import logoImg from "./assets/img/Logo.png";
import holidaySaleImg from "./assets/img/HOLIDAY_SALE.png";

// Sound Imports
import bgMusic from "./assets/sounds/Christmas Excitement_Full Mix (mp3cut.net).mp3";
import stopSound from "./assets/sounds/Slot Machine Logo (mp3).mp3";

function App() {
  const { appRef, wrapperRef } = useScaleUI(420, 820);
  const [isStopping, setIsStopping] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [showText2, setShowText2] = useState(false); // Kept state, though logic for text2 is now inside EndScreen
  
  // Ref to track if we have already triggered the start music logic
  const musicHasStartedRef = useRef(false);
  const wheelRef = useRef(null);
  const fadeIntervalRef = useRef(null); 

  // --- SOUND CONFIGURATION ---
  const NORMAL_VOLUME = 0.15; 
  const backgroundMusic = useSound(bgMusic, NORMAL_VOLUME, true); 
  const stopButtonSound = useSound(stopSound, 0.8); 

  // --- UNIVERSAL FADE FUNCTION ---
  const fadeTo = (audioSound, targetVol, duration = 1000) => {
    if (!audioSound) return;
    const audio = audioSound.getAudio();
    if (!audio) return;
    
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const startVol = audio.volume;
    const diff = targetVol - startVol;
    
    if (audio.paused && targetVol > 0) {
        audio.volume = startVol; 
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay prevented:", error);
                return; 
            });
        }
    }

    const steps = 20; 
    const stepTime = duration / steps;
    const stepVol = diff / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      if (audio.paused && targetVol > 0) {
         clearInterval(fadeIntervalRef.current);
         return;
      }

      currentStep++;
      const newVol = startVol + (stepVol * currentStep);

      if (newVol >= 0 && newVol <= 1) {
        audio.volume = newVol;
      }

      if (currentStep >= steps) {
        audio.volume = targetVol;
        clearInterval(fadeIntervalRef.current);
      }
    }, stepTime);
  };

  // --- MUSIC HANDLER (GLOBAL CLICK) ---
  const handleGlobalClick = useCallback(() => {
    if (musicHasStartedRef.current) return;

    if (backgroundMusic) {
      const audio = backgroundMusic.getAudio();
      if (audio && audio.paused) {
        musicHasStartedRef.current = true;
        console.log("Interaction detected. Fading in music...");
        audio.volume = 0; 
        fadeTo(backgroundMusic, NORMAL_VOLUME, 2000);
      }
    }
  }, [backgroundMusic]);

  useEffect(() => {
    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('touchstart', handleGlobalClick);

    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('touchstart', handleGlobalClick);
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, [handleGlobalClick]);

  // --- CONFIGURATION ---
  const IDLE_SPEED = 3.0; 
  const STOP_DURATION = 3.5; 
  const STOP_SPINS = 3; 

  const handleStop = (e) => {
    if (e) e.stopPropagation(); 

    if (isStopping) return;
    setIsStopping(true);
    
    // 1. FADE OUT background music
    fadeTo(backgroundMusic, 0, 800);
    
    // 2. Play stop sound
    setTimeout(() => {
      stopButtonSound.play();
    }, 200);
    
    const wheel = wheelRef.current;
    
    if (wheel) {
        const style = window.getComputedStyle(wheel);
        const matrix = new DOMMatrixReadOnly(style.transform);
        const currentAngle = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
        
        wheel.style.animation = 'none';
        wheel.style.transform = `translate(-50%, -50%) rotate(${currentAngle}deg)`;
        
        void wheel.offsetHeight; 
  
        const extraDegrees = (STOP_SPINS * 360) + (Math.random() * 360);
        const finalAngle = currentAngle + extraDegrees;
  
        wheel.style.transition = `transform ${STOP_DURATION}s cubic-bezier(0, 0, 0.2, 1)`;
        wheel.style.transform = `translate(-50%, -50%) rotate(${finalAngle}deg)`;
    }
    
    // 3. FADE IN background music
    setTimeout(() => {
      const audio = backgroundMusic?.getAudio();
      if (backgroundMusic && audio) {
        fadeTo(backgroundMusic, NORMAL_VOLUME, 1500);
      }
    }, STOP_DURATION * 1000); 
    
    setTimeout(() => {
      setShowEndScreen(true);
      setShowText2(false);
      setTimeout(() => {
        setShowText2(true);
      }, 2000);
    }, (STOP_DURATION * 1000) + 1500);
  };

  // IF END SCREEN IS SHOWN, RENDER ONLY END SCREEN
  if (showEndScreen) {
      return <EndScreen showEndScreen={showEndScreen} showText2={showText2} />;
  }

  // OTHERWISE, RENDER THE GAME (With its own local background setup)
  return (
    <div
      ref={wrapperRef}
      // Capture interactions for music
      onClickCapture={handleGlobalClick}
      onTouchStartCapture={handleGlobalClick}
      className="app-wrapper w-full h-screen relative flex items-center justify-center overflow-hidden p-8 box-border"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* --- MOLECULES (Only for Game Screen) --- */}
      {/* FIX: Changed width to vmin for autoscaling and max-w for limits */}
      <img
        src={molecule02}
        alt=""
        className="absolute top-0 right-[-2%] z-0 w-[25vmin] max-w-[250px] pointer-events-none select-none"
      />
      <img
        src={molecule01}
        alt=""
        className="absolute bottom-0 left-0 z-1 w-[25vmin] max-w-[250px] pointer-events-none select-none"
      />

      {/* --- GAME CONTENT --- */}
      <div 
        ref={appRef} 
        className="app relative flex flex-col items-center pt-12 pb-8"
        style={{ width: '420px', height: '820px' }}
      >
        <header className="flex flex-col items-center select-none pointer-events-none relative z-50">
          <img src={logoImg} alt="Particle" className="w-[200px] mt-[4rem]" />
          <img src={holidaySaleImg} alt="Holiday Sale" className="w-[310px] mt-[4vh]" />
        </header>

        <main className="flex-1 flex flex-col items-center justify-center w-full px-4">
          <div className="relative flex items-center justify-center w-[340px]">
            <img src={wheelImg} alt="Frame" className="z-20 w-full pointer-events-none select-none" />
            <img
              ref={wheelRef}
              src={insideImg}
              alt="Prizes"
              className="absolute z-10"
              style={{
                width: "94%", 
                top: "50%", left: "50%",
                transform: `translate(-50%, -50%)`, 
                animation: `smooth-spin ${IDLE_SPEED}s linear infinite`, 
              }}
            />
          </div>

          <p className="text-[#0038B1] font-bold text-center text-sm drop-shadow-md mt-6 px-4 animate-pulse select-none">
              Stop the wheel to reveal a mystery discount!
          </p>

          <button 
            onClick={handleStop} 
            disabled={isStopping} 
            className={`mt-4 transition-all duration-150 z-20 cursor-pointer ${isStopping ? 'opacity-90 cursor-not-allowed scale-95' : 'animate-pulse-slow'}`}
          >
            <img src={stopButton} alt="STOP" className="w-[190px] drop-shadow-xl" />
          </button>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes smooth-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes pulse-scale {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); } 
        }
        .animate-pulse-slow {
            animation: pulse-scale 2s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}

export default App;