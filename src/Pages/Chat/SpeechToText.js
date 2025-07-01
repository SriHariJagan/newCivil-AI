// components/SpeechToText.js
import { useEffect, useRef } from "react";

const SpeechToText = ({ isListening, setIsListening, onResult }) => {
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!isListening) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported.");
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();

    return () => recognition.stop();
  }, [isListening, setIsListening, onResult]);

  return null;
};

export default SpeechToText;
