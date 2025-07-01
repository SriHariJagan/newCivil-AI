
import editIcon from './Assets/Images/edit.png';
import deleteIcon from './Assets/Images/delete.png'
import focusIcon from './Assets/Images/focus.png';
import focusGif from './Assets/Images/focus.gif';
import userIcon from './Assets/Images/userIcon.png';


export const images = {
  deleteicon: deleteIcon,
  editIcon: editIcon,
  viewIcon: focusIcon,
  viewGif: focusGif,
  userIcon: userIcon,
}




// import React, { useState, useEffect, useRef } from "react";
// import styles from "./chat.module.css";
// import { ChevronLeft, ChevronRight, MessageSquare, Mic } from "lucide-react";
// import axios from "axios";
// import { ENDPONITS } from "../../../url";
// import TypingText from "./TypingText";
// import TextToSpeech from "./TextToSpeech";
// import SpeechToText from "./SpeechToText";

// const TypingDots = () => (
//   <span className={styles.typingDots}>
//     <span>.</span><span>.</span><span>.</span>
//   </span>
// );

// const Chat = () => {
//   const [leftCollapsed, setLeftCollapsed] = useState(false);
//   const [rightCollapsed, setRightCollapsed] = useState(false);
//   const [conversations, setConversations] = useState([]);
//   const [activeConversation, setActiveConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [typingMessage, setTypingMessage] = useState(null);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [speakingMessageId, setSpeakingMessageId] = useState(null);
//   const [isTypingResponse, setIsTypingResponse] = useState(false);
//   const [editingChatId, setEditingChatId] = useState(null);
//   const [editingTitle, setEditingTitle] = useState("");
//   const [deleteConfirmId, setDeleteConfirmId] = useState(null);
//   const [suggestions, setSuggestions] = useState([]);

//   const chatMessagesRef = useRef(null);
//   const synthRef = useRef(window.speechSynthesis);

//   const allSuggestions = [
//     "Give SUMMARY regarding DPR of NH-458 (Raipur - Jasakhera)",
//     "What's Benkelman Beam Deflection Survey?",
//     "Details on Submission of Land Acquisition proposals",
//     "Key objectives of the proposed Land Asset Data Management program",
//     "Tell me about TRAFFIC SURVEY LOCATIONS in NH458 Raipur - Jasakhera",
//     "What are Guidelines of Non forest land allotment as per FCA",
//     "What is the cost for Upgradation of two-lane with paved shoulder of NH-458 from Km. 16.100 & Km. 24.050",
//   ];

//   useEffect(() => {
//     const savedConversations = JSON.parse(localStorage.getItem("conversations")) || [];
//     setConversations(savedConversations);
//     setSuggestions([...allSuggestions].sort(() => 0.5 - Math.random()).slice(0, 3));
//   }, []);

//   useEffect(() => {
//     if (activeConversation)
//       localStorage.setItem(`chat-${activeConversation.id}`, JSON.stringify(messages));
//   }, [messages]);

//   useEffect(() => {
//     localStorage.setItem("conversations", JSON.stringify(conversations));
//   }, [conversations]);

//   const toggleLeft = () => {
//     setLeftCollapsed(!leftCollapsed);
//     setRightCollapsed(true);
//   };

//   const toggleRight = () => {
//     setRightCollapsed(!rightCollapsed);
//     setLeftCollapsed(true);
//   };

//   const startNewConversation = () => {
//     const newId = Date.now();
//     const newConversation = {
//       id: newId,
//       title: `Conversation ${conversations.length + 1}`,
//     };
//     setConversations([newConversation, ...conversations]);
//     setActiveConversation(newConversation);
//     setMessages([]);
//     localStorage.setItem(`chat-${newId}`, JSON.stringify([]));
//   };

//   const loadConversationMessages = (conv) => {
//     const data = localStorage.getItem(`chat-${conv.id}`);
//     setMessages(data ? JSON.parse(data) : []);
//     setActiveConversation(conv);
//   };

//   const sendMessage = async (customText = null) => {
//     const textToSend = customText || input.trim();
//     if (!textToSend || isTypingResponse) return;

//     let conversation = activeConversation;
//     if (!conversation) {
//       const newId = Date.now();
//       conversation = { id: newId, title: `Conversation ${conversations.length + 1}` };
//       setConversations([conversation, ...conversations]);
//       setActiveConversation(conversation);
//       setMessages([]);
//     }

//     const userMessage = {
//       id: Date.now(),
//       text: textToSend,
//       sender: "user",
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);
//     setIsTypingResponse(true);

//     try {
//       const token = localStorage.getItem("authToken");
//       const { data } = await axios.post(
//         ENDPONITS.chat,
//         { query: textToSend },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const responseText = data.results?.combined_context || "No response";
//       const botMessage = {
//         id: Date.now() + 1,
//         text: responseText,
//         sender: "bot",
//       };
//       setTypingMessage(botMessage);
//     } catch (error) {
//       console.error("Error calling chat API:", error);
//       setTypingMessage({
//         id: Date.now() + 1,
//         text: "Sorry, something went wrong.",
//         sender: "bot",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteConversation = (id) => {
//     setConversations(prev => prev.filter(conv => conv.id !== id));
//     localStorage.removeItem(`chat-${id}`);
//     if (activeConversation?.id === id) {
//       setActiveConversation(null);
//       setMessages([]);
//     }
//     setDeleteConfirmId(null);
//   };

//   const handleMicClick = () => {
//     if (speakingMessageId !== null) {
//       synthRef.current.cancel();
//       setSpeakingMessageId(null);
//     }
//     setIsListening(true);
//   };

//   return (
//     <div className={styles.container}>
//       {/* Left Sidebar */}
//       <div className={`${styles.sidebar} ${leftCollapsed ? styles.collapsed : ""}`}>
//         <div className={styles.sidebarHeader}>
//           <button onClick={toggleLeft}>
//             {leftCollapsed ? <ChevronRight /> : <ChevronLeft />}
//           </button>
//           {!leftCollapsed && (
//             <>
//               <h3>Chat History</h3>
//               <button onClick={startNewConversation}>+ New Chat</button>
//             </>
//           )}
//         </div>
//         {!leftCollapsed && (
//           <div className={styles.sidebarContent}>
//             {conversations.map((conv) => (
//               <div key={conv.id} className={styles.chatItem}>
//                 <MessageSquare
//                   size={20}
//                   onClick={() => loadConversationMessages(conv)}
//                   style={{ cursor: "pointer" }}
//                 />
//                 {editingChatId === conv.id ? (
//                   <input
//                     className={styles.chatEditInput}
//                     value={editingTitle}
//                     autoFocus
//                     onChange={(e) => setEditingTitle(e.target.value)}
//                     onBlur={() => {
//                       setConversations((prev) =>
//                         prev.map((c) =>
//                           c.id === conv.id ? { ...c, title: editingTitle } : c
//                         )
//                       );
//                       setEditingChatId(null);
//                     }}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") e.target.blur();
//                     }}
//                   />
//                 ) : (
//                   <>
//                     <span
//                       className={styles.chatTitle}
//                       onClick={() => loadConversationMessages(conv)}
//                     >
//                       {conv.title}
//                     </span>
//                     <button
//                       className={styles.editButton}
//                       onClick={() => {
//                         setEditingChatId(conv.id);
//                         setEditingTitle(conv.title);
//                       }}
//                       title="Edit"
//                     >
//                       ✏️
//                     </button>
//                     <button
//                       className={styles.deleteButton}
//                       onClick={() => setDeleteConfirmId(conv.id)}
//                       title="Delete"
//                     >
//                       🗑️
//                     </button>
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Chat Area */}
//       <div className={styles.chatArea}>
//         <div className={styles.chatMessages} ref={chatMessagesRef}>
//           {messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={
//                 msg.sender === "user"
//                   ? styles.messageSent
//                   : `${styles.messageReceived} ${styles.messageText}`
//               }
//             >
//               <div className={styles.messageContent}>
//                 <span>{msg.text}</span>
//                 {msg.sender === "bot" && (
//                   <>
//                     <button
//                       className={styles.speakerButton}
//                       onClick={() =>
//                         setSpeakingMessageId(
//                           speakingMessageId === msg.id ? null : msg.id
//                         )
//                       }
//                     >
//                       {speakingMessageId === msg.id ? "⏹️" : "🔊"}
//                     </button>
//                     {speakingMessageId === msg.id && (
//                       <TextToSpeech
//                         text={msg.text}
//                         messageId={msg.id}
//                         speakingMessageId={speakingMessageId}
//                         setSpeakingMessageId={setSpeakingMessageId}
//                       />
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//           ))}

//           {loading && (
//             <div className={`${styles.messageReceived} ${styles.messageText}`}>
//               <TypingDots />
//             </div>
//           )}

//           {typingMessage && !loading && (
//             <div className={`${styles.messageReceived} ${styles.messageText}`}>
//               <TypingText
//                 text={typingMessage.text}
//                 speed={20}
//                 onComplete={() => {
//                   setMessages((prev) => [...prev, typingMessage]);
//                   setTypingMessage(null);
//                   setIsTypingResponse(false);
//                 }}
//               />
//             </div>
//           )}
//         </div>

//         {/* Input Area */}
//         <div className={styles.chatInput}>
//           <input
//             type="text"
//             placeholder="Type a message..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//             disabled={isTypingResponse}
//           />
//           <button
//             onClick={() => {
//               if (isTypingResponse) {
//                 setTypingMessage(null);
//                 setIsTypingResponse(false);
//                 setLoading(false);
//               } else {
//                 sendMessage();
//               }
//             }}
//             disabled={isTypingResponse && !typingMessage}
//           >
//             {isTypingResponse ? "Cancel" : "Send"}
//           </button>
//           <button
//             onClick={handleMicClick}
//             className={styles.micBtn}
//             disabled={isTypingResponse}
//           >
//             <Mic size={20} />
//           </button>
//         </div>
//       </div>

//       {/* Right Sidebar */}
//       <div
//         className={`${styles.sidebar} ${styles.right} ${
//           rightCollapsed ? styles.collapsed : ""
//         }`}
//       >
//         <div className={styles.sidebarHeader}>
//           <button onClick={toggleRight}>
//             {rightCollapsed ? <ChevronLeft /> : <ChevronRight />}
//           </button>
//           {!rightCollapsed && <h3>Suggestions</h3>}
//         </div>
//         {!rightCollapsed && (
//           <div className={styles.sidebarContent}>
//             {suggestions.map((q, idx) => (
//               <button
//                 key={idx}
//                 className={styles.suggestion}
//                 onClick={() => {
//                   setInput(q);
//                   setTimeout(() => sendMessage(q), 100);
//                 }}
//               >
//                 {q}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Listening Overlay */}
//       {isListening && (
//         <div className={styles.popupOverlay}>
//           <div className={styles.popup}>
//             <p>🎙️ Listening... Speak now.</p>
//             <button className={styles.cancelBtn} onClick={() => setIsListening(false)}>
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Popup */}
//       {deleteConfirmId && (
//         <div className={styles.popupOverlay}>
//           <div className={styles.dialog}>
//             <p>Are you sure you want to delete this chat?</p>
//             <div className={styles.dialogButtons}>
//               <button className={styles.confirm} onClick={() => deleteConversation(deleteConfirmId)}>Yes</button>
//               <button className={styles.cancel} onClick={() => setDeleteConfirmId(null)}>No</button>
//             </div>
//           </div>
//         </div>
//       )}

//       <SpeechToText
//         isListening={isListening}
//         setIsListening={setIsListening}
//         onResult={(text) => sendMessage(text)}
//       />
//     </div>
//   );
// };

// export default Chat;

