import React, { useState, useEffect, useRef } from "react";
import styles from "./chat.module.css";
import { ChevronLeft, ChevronRight, MessageSquare, Mic } from "lucide-react";
import axios from "axios";
import { ENDPONITS } from "../../../url";
import TypingText from "./TypingText";

const TypingDots = () => (
  <span className={styles.typingDots}>
    <span>.</span>
    <span>.</span>
    <span>.</span>
  </span>
);

const Chat = () => {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [, setIsMobile] = useState(window.innerWidth <= 768);

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingMessage, setTypingMessage] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null); // 👈 new state

  const [suggestions, setSuggestions] = useState([]);

  const messagesEndRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const recognitionRef = useRef(null);

  const allSuggestions = [
    "Give  SUMMARY regarding DPR of NH-458 (Raipur - Jasakhera)",
    "what's Benkelman Beam Deflection Survey?",
    "Details on Submission of Land Acquisition proposals",
    "key objectives of the proposed Land Asset Data Management program",
    "tell me about TRAFFIC SURVEY LOCATIONS in NH458 Raipur - Jasakhera",
    "what are Guidelines of Non forest land allotment as per FCA",
    "what is the cost for Upgradation two lane with paved shoulder of NH-458 (Raipur-Jasakhera) from- Km. 16.100 & Km. 24.050",
  ];

  const getRandomSuggestions = (count) => {
    const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    setSuggestions(getRandomSuggestions(3));
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleLeft = () => {
    setLeftCollapsed(!leftCollapsed);
    setRightCollapsed(true);
  };
  const toggleRight = () => {
    setRightCollapsed(!rightCollapsed);
    setLeftCollapsed(true);
  };

  const startNewConversation = () => {
    const newConversation = {
      id: Date.now(),
      title: `Conversation ${conversations.length + 1}`,
    };
    setConversations([newConversation, ...conversations]);
    setActiveConversation(newConversation);
    setMessages([]);
  };

  const speakText = (text, messageId) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech not supported in this browser.");
      return;
    }

    const synth = window.speechSynthesis;

    // If already speaking this message, stop it
    if (speakingMessageId === messageId) {
      synth.cancel();
      setSpeakingMessageId(null);
      return;
    }

    // Stop any previous speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(messageId);
    synth.speak(utterance);
  };

  const sendMessage = async (customText = null) => {
    const textToSend = customText || input.trim();
    if (!textToSend) return;

    let conversation = activeConversation;
    if (!conversation) {
      conversation = {
        id: Date.now(),
        title: `Conversation ${conversations.length + 1}`,
      };
      setConversations([conversation, ...conversations]);
      setActiveConversation(conversation);
      setMessages([]);
    }

    const userMessage = {
      id: Date.now(),
      text: textToSend,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.post(
        ENDPONITS.chat,
        { query: textToSend },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const responseText = data.results?.combined_context || "No response";
      const botMessage = {
        id: Date.now() + 1,
        text: responseText,
        sender: "bot",
      };
      setTypingMessage(botMessage);
    } catch (error) {
      console.error("Error calling chat API:", error);
      const fallbackText =
        "I just woke up from a dream Where you and I had to say goodbye And I don't know what it all means But since I survived, I realized";
      setTypingMessage({
        id: Date.now() + 1,
        text: fallbackText,
        sender: "bot",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      sendMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className={styles.container}>
      {/* Left Sidebar */}
      <div
        className={`${styles.sidebar} ${leftCollapsed ? styles.collapsed : ""}`}
      >
        <div className={styles.sidebarHeader}>
          <button onClick={toggleLeft}>
            {leftCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
          {!leftCollapsed && (
            <>
              <h3>Chat History</h3>
              <button onClick={startNewConversation}>+ New Chat</button>
            </>
          )}
        </div>
        {!leftCollapsed && (
          <div className={styles.sidebarContent}>
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={styles.chatItem}
                onClick={() => {
                  setActiveConversation(conv);
                  setMessages([]);
                }}
              >
                <MessageSquare size={20} />
                <span>{conv.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className={styles.chatArea}>
        <div className={styles.chatMessages} ref={chatMessagesRef}>
          {messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={
                msg.sender === "user"
                  ? styles.messageSent
                  : `${styles.messageReceived} ${styles.messageText}`
              }
            >
              <div className={styles.messageContent}>
                <span>{msg.text}</span>
                {msg.sender === "bot" && (
                  <button
                    className={styles.speakerButton}
                    onClick={() => speakText(msg.text, msg.id)}
                    title={
                      speakingMessageId === msg.id
                        ? "Stop speaking"
                        : "Speak this message"
                    }
                  >
                    {speakingMessageId === msg.id ? "⏹️" : "🔊"}
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className={`${styles.messageReceived} ${styles.messageText}`}>
              <TypingDots />
            </div>
          )}

          {typingMessage && !loading && (
            <div className={`${styles.messageReceived} ${styles.messageText}`}>
              <TypingText
                text={typingMessage.text}
                speed={20}
                onComplete={() => {
                  setMessages((prev) => [...prev, typingMessage]);
                  setTypingMessage(null);
                }}
              />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className={styles.chatInput}>
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={() => sendMessage()}>Send</button>
          <button onClick={startListening} className={styles.micBtn}>
            <Mic size={20} />
          </button>
        </div>
      </div>

      {/* Right Sidebar */}
      <div
        className={`${styles.sidebar} ${styles.right} ${
          rightCollapsed ? styles.collapsed : ""
        }`}
      >
        <div className={styles.sidebarHeader}>
          <button onClick={toggleRight}>
            {rightCollapsed ? <ChevronLeft /> : <ChevronRight />}
          </button>
          {!rightCollapsed && <h3>Suggestions</h3>}
        </div>
        {!rightCollapsed && (
          <div className={styles.sidebarContent}>
            {suggestions.map((q, idx) => (
              <button
                key={idx}
                className={styles.suggestion}
                onClick={() => {
                  setInput(q);
                  setTimeout(sendMessage, 100);
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Listening Popup */}
      {isListening && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <p>🎙️ Listening... Speak now.</p>
            <button
              className={styles.cancelBtn}
              onClick={() => {
                recognitionRef.current?.abort();
                setIsListening(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
