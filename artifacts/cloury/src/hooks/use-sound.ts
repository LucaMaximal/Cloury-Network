import { useState, useEffect } from "react";

export function useSound() {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem("cloury-sound");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem("cloury-sound", String(soundEnabled));
  }, [soundEnabled]);

  const toggleSound = () => setSoundEnabled((prev) => !prev);

  const playClick = () => {
    if (!soundEnabled) return;
    // We would play an actual audio file here
  };

  const playHover = () => {
    if (!soundEnabled) return;
    // We would play an actual audio file here
  };

  return { soundEnabled, toggleSound, playClick, playHover };
}
