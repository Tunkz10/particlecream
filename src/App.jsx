import React, { useState, useRef, useEffect, useCallback } from "react";
import useScaleUI from "./hooks/useScaleUI";
import { useSound } from "./hooks/useSound";
import EndScreen from "./components/EndScreen";

import backgroundImg from "./assets/img/background.jpg";
import bottom1Img from "./assets/img/bottom_design.png";
import top1img from "./assets/img/top_design.png";
import wheelImg from "./assets/img/WHEEL.png";
import insideImg from "./assets/img/inside.png";
import stopButton from "./assets/img/STOP_BUTTON.png";
import logoImg from "./assets/img/Logo.png";
import holidaySaleImg from "./assets/img/HOLIDAY_SALE.png";

import bgMusic from "./assets/sounds/Christmas Excitement_Full Mix (mp3cut.net).mp3";
import stopSound from "./assets/sounds/Slot Machine Logo (mp3).mp3";

function App() {
  // Your hook works perfectly here. It scales the 420x820 game play area.
  const { appRef, wrapperRef } = useScaleUI(420, 820);
  
  const [isStopping, setIsStopping] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [showText2, setShowText2] = useState(false);
  
  const musicHasStartedRef = useRef(false);
  const wheelRef = useRef(null);
  const fadeIntervalRef = useRef(null);

  const NORMAL_VOLUME = 0.15;
  const backgroundMusic = useSound(bgMusic, NORMAL_VOLUME, true);
  const stopButtonSound = useSound(stopSound, 0.8);

  // --- AUDIO LOGIC (Unchanged) ---
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
        if (playPromise !== undefined) playPromise.catch(() => {});
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
      if (newVol >= 0 && newVol <= 1) audio.volume = newVol;

      if (currentStep >= steps) {
        audio.volume = targetVol;
        clearInterval(fadeIntervalRef.current);
      }
    }, stepTime);
  };

  const handleGlobalClick = useCallback(() => {
    if (musicHasStartedRef.current) return;
    if (backgroundMusic) {
      const audio = backgroundMusic.getAudio();
      if (audio && audio.paused) {
        musicHasStartedRef.current = true;
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

  // --- GAME LOGIC (Unchanged) ---
  const IDLE_SPEED = 3.0; 
  const STOP_DURATION = 3.5; 
  const STOP_SPINS = 3; 

  const handleStop = (e) => {
    if (e) e.stopPropagation(); 
    if (isStopping) return;
    setIsStopping(true);
    
    fadeTo(backgroundMusic, 0, 800);
    setTimeout(() => stopButtonSound.play(), 200);
    
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
    
    setTimeout(() => {
      const audio = backgroundMusic?.getAudio();
      if (backgroundMusic && audio) fadeTo(backgroundMusic, NORMAL_VOLUME, 1500);
    }, STOP_DURATION * 1000); 
    
    setTimeout(() => {
      setShowEndScreen(true);
      setShowText2(false);
      setTimeout(() => setShowText2(true), 2000);
    }, (STOP_DURATION * 1000) + 1500);
  };

  if (showEndScreen) {
      return <EndScreen showEndScreen={showEndScreen} showText2={showText2} />;
  }

  return (
    <div
      ref={wrapperRef}
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
      {/* TOP IMAGE 
          Using 'responsive-bg-img' to handle landscape scaling without cutting 
      */}
      <img
        src={top1img}
        alt="Top Design"
        className="responsive-bg-img responsive-bg-img-top absolute top-0 z-0 pointer-events-none select-none"
      />
      
      {/* BOTTOM IMAGE
          Using 'responsive-bg-img' to handle landscape scaling without cutting 
      */}
      <img
        src={bottom1Img}
        alt="Bottom Design"
        className="responsive-bg-img responsive-bg-img-bottom absolute bottom-0 z-1 pointer-events-none select-none"
      />

      {/* GAME CONTENT
          This is controlled by useScaleUI, so it handles its own sizing perfectly.
      */}
      <div 
        ref={appRef} 
        className="app relative flex flex-col items-center pt-12 pb-8 origin-center z-10"
        style={{ width: '420px', height: '820px', position: 'absolute' }}
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
                top: "53%", left: "50%",
                transform: `translate(-50%, -50%)`, 
                animation: `smooth-spin ${IDLE_SPEED}s linear infinite`, 
              }}
            />
          </div>

          <p className="text-[#FFFFFF] font-bold text-center text-sm drop-shadow-md mt-6 px-4 animate-pulse select-none">
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
        /* RESPONSIVE IMAGE LOGIC:
           Full viewport width (100vw) in all orientations, fully scalable and responsive
           - Images extend to both screen edges regardless of parent container constraints
           - Portrait: Full viewport width, natural height scaling
           - Landscape: Full viewport width, scales appropriately without cutting
        */
        .responsive-bg-img {
            width: 100vw;
            height: auto;
            object-fit: contain;
            object-position: center;
        }

        .responsive-bg-img-top {
            left: 50%;
            margin-left: -50vw;
        }

        .responsive-bg-img-bottom {
            left: 50%;
            margin-left: -50vw;
        }

        /* Landscape mode: Fully responsive, no cutting, scales naturally */
        @media (orientation: landscape) {
            .responsive-bg-img {
                width: 100vw;
                height: auto;
                max-height: 35vh;
                object-fit: contain;
                object-position: center;
            }
        }

        /* For very wide screens, allow more height for better coverage */
        @media (orientation: landscape) and (min-aspect-ratio: 2/1) {
            .responsive-bg-img {
                max-height: 30vh;
                object-fit: contain;
            }
        }

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