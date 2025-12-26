import React, { useState, useEffect } from "react";

// Image Imports (Background Assets)
import backgroundImg from "../assets/img/background.jpg";
import molecule01 from "../assets/img/Molecule_01.png";
import molecule02 from "../assets/img/Molecule_02.png";

// Image Imports (End Screen Assets)
import logoImg from "../assets/img/Logo.png";
import blastImg from "../assets/img/BLAST.png";
import ctaButtonImg from "../assets/img/CTA.png";
import podiumImg from "../assets/img/itempodium.png";
import text1Img from "../assets/img/text_1.png";
import text2Img from "../assets/img/text_2.png";
import endItemImg from "../assets/img/enditem.png";
import endPodiumImg from "../assets/img/endpodium.png";

const EndScreen = ({ showEndScreen }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationStep, setAnimationStep] = useState(0); 
  const [isLandscape, setIsLandscape] = useState(false);

  // 1. Handle Orientation & Visibility Entry
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);

    if (showEndScreen) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setAnimationStep(0);
    }

    return () => window.removeEventListener('resize', checkOrientation);
  }, [showEndScreen]);

  // 2. Handle Looping Animation Logic
  useEffect(() => {
    if (!isVisible) return;

    let timer;

    if (isLandscape) {
      timer = setTimeout(() => {
        setAnimationStep((prev) => (prev === 0 ? 1 : 0));
      }, 2500);

    } else {
      const stepDuration = animationStep === 2 ? 3000 : 2500; 
      timer = setTimeout(() => {
        setAnimationStep((prev) => {
          if (prev === 2) return 0; 
          return prev + 1;         
        });
      }, stepDuration);
    }

    return () => clearTimeout(timer);
  }, [isVisible, isLandscape, animationStep]);

  const handleClickAction = () => {
    if (window.mraid && window.mraid.open && typeof window.mraid.open === "function") {
      window.mraid.open();
    } else {
      window.open();
    }
  };

  if (!showEndScreen) return null;

  const currentPodium = (animationStep === 2 && !isLandscape) ? endPodiumImg : podiumImg;
  
  // SHARED ANIMATION CLASS
  const entranceAnim = isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8";

  return (
    // ROOT WRAPPER
    <div
      onClickCapture={handleClickAction}
      className="app-wrapper w-full h-screen relative flex items-center justify-center overflow-hidden p-8 box-border"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
        {/* ------------------------------------------------------
            LAYER 1: TOP RIGHT MOLECULE (Background)
            ------------------------------------------------------ */}
        <img
          src={molecule02}
          alt=""
          // Already working: vmin with max-w constraint
          className="absolute top-0 right-[-2%] z-[0] w-[25vmin] max-w-[250px] pointer-events-none select-none"
        />

        {/* ------------------------------------------------------
            LAYER 2: THE PODIUM
            ------------------------------------------------------ */}
        <div 
            className={`absolute bottom-0 flex flex-col items-center justify-end transition-all duration-700 ease-out z-[10] ${entranceAnim}`}
            style={{ 
                // Autoscales with vmin, but stops growing at 500px
                width: isLandscape ? '50vmin' : '80vmin',
                maxWidth: '500px',
                marginBottom: '-1vmin'
            }}
        >
            <div className="relative w-full">
                <img
                    src={blastImg}
                    alt="Blast Effect"
                    className="absolute z-0 opacity-90 pointer-events-none select-none"
                    style={{ 
                        left: '50%', top: '50%', width: '120%', maxWidth: 'none', transform: 'translate(-50%, -80%)' 
                    }}
                />
                <img
                    src={currentPodium}
                    alt="Podium"
                    className="relative z-[10] w-full"
                />
            </div>
        </div>

        {/* ------------------------------------------------------
            LAYER 3: THE SANDWICH MOLECULE (Molecule 01)
            ------------------------------------------------------ */}
        <img
          src={molecule01}
          alt=""
           // Already working: vmin with max-w constraint
          className="absolute bottom-0 left-0 z-[20] w-[25vmin] max-w-[250px] pointer-events-none select-none"
        />

        {/* ------------------------------------------------------
            LAYER 4: LOGO & TEXT GROUP
            ------------------------------------------------------ */}
        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-between pointer-events-none z-[30]">
            <div
                className={`flex flex-col items-center justify-start transition-all duration-700 ease-out w-full relative ${entranceAnim}`}
                style={{ 
                    // Changed vh to vmin for consistent vertical scaling
                    paddingTop: isLandscape ? '5vmin' : '12vmin' 
                }}
            >
                {/* LOGO AUTOSCALING */}
                <img
                    src={logoImg}
                    alt="Particle Logo"
                    style={{ 
                        width: isLandscape ? '40vmin' : '65vmin',
                        maxWidth: '380px' // Added max constraint
                    }}
                />
               {/* TEXT AREA AUTOSCALING */}
<div 
    className={`relative flex items-center justify-center transition-opacity duration-500 ${animationStep === 2 && !isLandscape ? 'opacity-0' : 'opacity-100'}`}
    style={{ 
        // INCREASED WIDTH: Takes up 90% of screen width in portrait, 60% in landscape
        width: isLandscape ? '60vmin' : '90vmin', 
        
        // RELAXED LIMIT: Increased from 420px to 800px so it can actually get big
        maxWidth: '560px', 
        
        // INCREASED HEIGHT: Taller container to match the wider width
        height: isLandscape ? '18vmin' : '24vmin', 
        
        // RELAXED LIMIT: Increased from 90px to 200px
        maxHeight: '200px', 
        
        marginTop: '10vmin'
    }}
>
    <img
        src={text1Img}
        className={`absolute inset-0 w-full h-full object-contain transition-all duration-1000 ease-in-out ${
        animationStep === 0 ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
        }`}
    />
    <img
        src={text2Img}
        className={`absolute inset-0 w-full h-full object-contain transition-all duration-1000 ease-in-out ${
        animationStep === 1 ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
        }`}
    />

                </div>
            </div>
        </div>

        {/* ------------------------------------------------------
            LAYER 5: END ITEM (Floating Middle)
            ------------------------------------------------------ */}
        <div 
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] transition-all duration-1000 ease-out z-[40] ${
                (animationStep === 2 && !isLandscape) ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
            style={{ 
                width: '90vmin',
                maxWidth: '650px' // Added max constraint so it doesn't get huge on desktop
            }} 
        >
            <img src={endItemImg} alt="End Item" className="w-full drop-shadow-2xl" />
        </div>

        {/* ------------------------------------------------------
            LAYER 6: CTA BUTTON (Top Layer)
            ------------------------------------------------------ */}
        <div className={`absolute bottom-[-1rem] w-full flex justify-center pointer-events-none z-[50] ${entranceAnim}`}>
            <button
                className="pointer-events-auto transition-all duration-700 ease-out delay-500 hover:scale-105 active:scale-95"
                style={{ 
                    // Changed vh to vmin for consistent vertical spacing
                    marginBottom: isLandscape ? '4vmin' : '15vmin', 
                    width: isLandscape ? '35vmin' : '55vmin',
                    maxWidth: '320px' // Added max constraint for desktop
                }}
            >
                <img
                    src={ctaButtonImg}
                    alt="Shop Now"
                    className="w-full drop-shadow-lg"
                />
            </button>
        </div>

        <style>{`
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            14% { transform: scale(1.08); }
            28% { transform: scale(1); }
            42% { transform: scale(1.08); }
            70% { transform: scale(1); }
          }
          button {
            animation: heartbeat 1.5s ease-in-out infinite;
          }
        `}</style>
    </div>
  );
};

export default EndScreen;