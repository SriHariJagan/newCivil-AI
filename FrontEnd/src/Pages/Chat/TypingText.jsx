import React, { useEffect, useState } from "react";
import styles from "./chat.module.css";

const TypingText = ({ text, speed = 20, onComplete, onUpdate }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      // const nextChar = text.charAt(index);
      const nextText = text.substring(0, index + 1);
      setDisplayedText(nextText);

      if (onUpdate) onUpdate(nextText);

      index++;
      if (index >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete, onUpdate]);

  return <div className={styles.messageText}>{displayedText}</div>;
};

export default TypingText;
