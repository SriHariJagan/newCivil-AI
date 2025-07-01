import React, { useEffect, useState, useRef } from "react";

const TypingText = ({ text, speed = 20, onComplete, onUpdate }) => {
  const [displayedText, setDisplayedText] = useState("");
  const frameRef = useRef(null);
  const startTimeRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    let lastTimestamp = performance.now();

    const step = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;

      const elapsed = timestamp - lastTimestamp;

      if (elapsed >= speed) {
        const index = indexRef.current;
        const nextText = text.substring(0, index + 1);
        setDisplayedText(nextText);
        if (onUpdate) onUpdate(nextText);

        indexRef.current += 1;
        lastTimestamp = timestamp;

        if (indexRef.current >= text.length) {
          if (onComplete) onComplete();
          return; // stop animation
        }
      }

      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameRef.current);
  }, [text, speed, onComplete, onUpdate]);

  return <div>{displayedText}</div>;
};

export default TypingText;
