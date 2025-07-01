// components/TextToSpeech.js
import { useEffect } from "react";

const TextToSpeech = ({ text, messageId, speakingMessageId, setSpeakingMessageId }) => {
  useEffect(() => {
    if (!text || messageId !== speakingMessageId) return;

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    utterance.onend = () => setSpeakingMessageId(null);

    synth.speak(utterance);

    return () => synth.cancel(); // cleanup if unmounted
  }, [text, messageId, speakingMessageId, setSpeakingMessageId]);

  return null;
};

export default TextToSpeech;
