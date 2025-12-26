import { useEffect, useRef } from "react";

export const useSound = (src, volume = 0.7, loop = false) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.loop = loop;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [src, volume, loop]);

  const play = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((error) => {
      console.log('Audio play failed:', error);
    });
  };

  const stop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  };

  const getAudio = () => {
    return audioRef.current;
  };

  return { play, stop, pause, getAudio };
};