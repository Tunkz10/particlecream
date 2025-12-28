import React, { useState, useEffect } from "react";
import useScaleUI from "../hooks/useScaleUI";

// --- Assets ---
import backgroundImg from "../assets/img/background.jpg";
import bottom1Img from "../assets/img/bottom_design.png";
import top1img from "../assets/img/top_design.png";
import logoImg from "../assets/img/Logo.png";
import blastImg from "../assets/img/BLAST.png";
import ctaButtonImg from "../assets/img/CTA.png";
import text1Img from "../assets/img/text_1.png";
import text2Img from "../assets/img/text_2.png";
import podium from "../assets/img/Podium.png";

// --- ORIGINAL ITEMS (Podium) ---
import item1Original from "../assets/img/4.png"; 
import item2Original from "../assets/img/2.png"; 
import item3Original from "../assets/img/1.png"; 
import item4Original from "../assets/img/3.png"; 

// --- VARIANT ITEMS (Center Pop-up) ---
import item1Variant from "../assets/img/4-1.png"; 
import item2Variant from "../assets/img/2-1.png"; 
import item4Variant from "../assets/img/3-1.png"; 
import item3Variant from "../assets/img/1-1.png"; 

const EndScreen = ({ showEndScreen }) => {
  const { appRef, wrapperRef } = useScaleUI(420, 820);
  
  const [isVisible, setIsVisible] = useState(false);
  
  // --- Animation State ---
  const [sequenceStep, setSequenceStep] = useState(0);
  const [textSubStep, setTextSubStep] = useState(0);
  const [itemAnimPhase, setItemAnimPhase] = useState('hidden');

  // Configuration
  const ITEMS_CONFIG = [
    null, 
    { 
      id: 1, 
      original: item1Original, 
      variant: item1Variant, 
      podiumStyle: "w-[32%] -mr-[6%] mb-[2%] z-10"
    },
    { 
      id: 2, 
      original: item2Original, 
      variant: item2Variant, 
      podiumStyle: "w-[30%] z-30"
    },
    { 
      id: 3, 
      original: item3Original, 
      variant: item3Variant, 
      podiumStyle: "w-[23%] -ml-[3%] mb-[4%] z-10"
    },
    { 
      id: 4, 
      original: item4Original, 
      variant: item4Variant, 
      podiumStyle: "w-[33%] -ml-[15%] mb-[-4%] z-40"
    },
  ];

  // --- Master Loop Logic ---
  useEffect(() => {
    if (showEndScreen) {
      setIsVisible(true);
      runSequence(0); 
    } else {
      setIsVisible(false);
      setSequenceStep(0);
    }
  }, [showEndScreen]);

  const runSequence = (stepIndex) => {
    setSequenceStep(stepIndex);

    if (stepIndex === 0) {
      // === TEXT PHASE ===
      setItemAnimPhase('hidden'); 
      setTextSubStep(0); 
      setTimeout(() => setTextSubStep(1), 1500); 
      setTimeout(() => runSequence(1), 3500); 

    } else if (stepIndex >= 1 && stepIndex <= 4) {
      // === ITEM PHASE ===
      setItemAnimPhase('center-pop');

      setTimeout(() => {
        setItemAnimPhase('restored');
        setTimeout(() => {
          const nextStep = stepIndex === 4 ? 0 : stepIndex + 1; 
          runSequence(nextStep);
        }, 800); 
      }, 1500); 
    }
  };

  const handleClickAction = () => {
    if (window.mraid?.open) window.mraid.open();
    else window.open();
  };

  if (!showEndScreen) return null;

  const entranceAnim = isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8";

  return (
    <div
      ref={wrapperRef}
      onClickCapture={handleClickAction}
      className="w-full h-screen relative flex items-center justify-center overflow-hidden p-8 box-border bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      
      {/* ================= LAYER 1: DECORATIONS ================= */}
      <img
        src={top1img}
        alt="Top Design"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-auto object-contain z-0 pointer-events-none select-none landscape:max-h-[25vh] landscape:w-auto landscape:max-w-screen"
      />

      {/* ================= LAYER 2: HEADER (Logo + Text) ================= */}
      <header className={`fixed left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-[50] transition-all duration-700 ease-out ${entranceAnim}
        
        /* --- 1. PORTRAIT (Default) --- */
        top-[15vh] 
        w-[80vw] 
        max-w-[420px]

        /* --- 2. LANDSCAPE FIXES --- */
        /* Move it higher up so it doesn't overlap the center */
        landscape:top-[13vh] 
        /* Make it smaller (based on height) */
        landscape:w-[40vh] 
        landscape:max-w-[none]
      `}>
        <img src={logoImg} alt="Logo" className="w-[50vw] max-w-[400px] landscape:w-full" />
        
        <div className="relative w-[75vw] max-w-[610px] aspect-[310/80] mt-[5vh] flex items-center justify-center landscape:w-full landscape:mt-[2vh]">
          <img
            src={text1Img}
            alt="Text 1"
            className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ease-in-out ${
              sequenceStep === 0 && textSubStep === 0 ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          />
          <img
            src={text2Img}
            alt="Text 2"
            className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ease-in-out ${
              sequenceStep === 0 && textSubStep === 1 ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          />
        </div>
      </header>

      {/* Hidden Hook Ref */}
      <div ref={appRef} className="hidden w-[420px] h-[820px]" />

      {/* ================= LAYER 3: CENTER POP-UP OVERLAY ================= */}
      <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
        {ITEMS_CONFIG.map((item, idx) => {
          if (!item) return null;
          
          const isActive = sequenceStep === idx;
          const showCenter = isActive && itemAnimPhase === 'center-pop';

          return (
            <img 
              key={`center-${idx}`} 
              src={item.variant} 
              alt="Center Product" 
              className={`absolute object-contain drop-shadow-2xl transition-all duration-500 ease-out
                w-[80vw] md:w-[50vw]
                landscape:w-auto 
                landscape:h-[35vh]
                top-[43vh] left-1/2 -translate-x-1/2
                ${
                showCenter 
                  ? "opacity-100 scale-100 -translate-y-[60%]" 
                  : "opacity-0 scale-50 -translate-y-[40%]"    
              }`}
            />
          );
        })}
      </div>

      {/* ================= LAYER 4: PODIUM ================= */}
      <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 z-[5] ${entranceAnim}
           /* --- 3. PODIUM SIZE LOGIC --- */
           
           /* MOBILE PORTRAIT: 80% width, capped at 550px */
           w-[80vw] 
           max-w-[550px]

           /* IPAD / TABLET PORTRAIT: */
           /* Allow it to be wider (increase the cap to 800px) */
           md:max-w-[800px] 
           /* Set the specific width percentage you want for iPad */
           md:w-[66vw] 
           lg:w-[68vw]

           /* LANDSCAPE MODE (Overrules everything above when rotated) */
           landscape:w-[45vh]
           landscape:max-w-none /* Remove pixel limits in landscape so height dictates size */
      `}>
        <img src={blastImg} className="absolute bottom-[50%] left-1/2 -translate-x-1/2 w-[90%] opacity-90 z-0" />

        <div className="relative z-10 w-full">
          <img src={podium} className="w-full object-contain drop-shadow-xl"/>
        </div>

        <div className="absolute bottom-[66%] left-0 right-0 z-20 flex items-end justify-center w-full">
          {ITEMS_CONFIG.map((item, idx) => {
             if (!item) return null;
             const isHidden = sequenceStep === idx && itemAnimPhase === 'center-pop';
             
             return (
               <div key={`podium-${idx}`} className={`relative origin-bottom transition-all duration-300 ${item.podiumStyle}`}>
                 <img 
                   src={item.original} 
                   className={`w-full object-contain drop-shadow-lg transition-opacity duration-300 ${
                     isHidden ? 'opacity-0' : 'opacity-100'
                   }`}
                 />
               </div>
             )
          })}
        </div>
      </div>

      <img 
        src={bottom1Img} 
        alt="Bottom Design"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-screen h-auto object-contain z-20 pointer-events-none select-none landscape:max-h-[25vh] landscape:w-auto landscape:max-w-screen" 
      />
      
      {/* ================= LAYER 5: BUTTON ================= */}
      <div className={`fixed left-1/2 -translate-x-1/2 z-[60] ${entranceAnim}
          /* --- 4. BUTTON LANDSCAPE FIXES --- */
          /* Portrait */
          bottom-[10vh] 
          w-[60vw] 
          max-w-[380px]

          /* Landscape: Smaller bottom margin & smaller size (based on height) */
          landscape:bottom-[5vh]
          landscape:w-[25vh]
      `}>
        <button className="animate-heartbeat w-full hover:scale-105 active:scale-95 transition-transform">
          <img src={ctaButtonImg} alt="Shop Now" className="w-full drop-shadow-lg" />
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
        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EndScreen;