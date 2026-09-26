const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Trash2, LogOut } from 'lucide-react';

import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import ChatMessage from '@/components/chat/ChatMessage';
import SpecialModeToggle from '@/components/chat/SpecialModeToggle';
import FastModeToggle from '@/components/chat/FastModeToggle';
import BirthdayCelebration from '@/components/chat/BirthdayCelebration';
import LoadingDots from '@/components/chat/LoadingDots';
import ImageLoadingAnimation from '@/components/chat/ImageLoadingAnimation';
import SuggestionChips from '@/components/chat/SuggestionChips';
import VoiceButton from '@/components/chat/VoiceButton';

export default function Chat() {
  const { user, isAuthenticated, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [specialMode, setSpecialMode] = useState(false);
  const [fastMode, setFastMode] = useState(false);
  const [showBirthday, setShowBirthday] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleVoiceTranscript = useCallback((transcript) => {
    setInput(transcript);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl text-center"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-200"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              V.AI
            </span>
          </h1>
          <p className="text-gray-500 mb-8">
            Please sign in to start chatting with V.AI and creating images.
          </p>
          <Button
            onClick={() => db.auth.redirectToLogin(window.location.href)}
            className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 rounded-xl py-6 text-lg"
          >
            Sign In to V.AI
          </Button>
          <p className="text-xs text-gray-400 mt-4">
            Sign in with Google, Apple, or Facebook
          </p>
        </motion.div>
      </div>
    );
  }

  const checkForBirthday = (text) => {
    const birthdayKeywords = ['happy birthday', 'my birthday', 'birthday today', "it's my birthday", 'celebrating birthday'];
    return birthdayKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const checkForImageRequest = (text) => {
    const imageKeywords = ['create image', 'generate image', 'make image', 'draw', 'create picture', 'generate picture', 'make picture', 'show me image', 'create an image', 'generate an image', 'make an image', 'paint', 'illustrate', 'design image'];
    return imageKeywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  const sendMessage = async (messageText) => {
    const text = messageText || input.trim();
    if (!text) return;

    // Check for birthday
    if (checkForBirthday(text)) {
      setShowBirthday(true);
    }

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Check if user wants an image
    if (checkForImageRequest(text)) {
      setIsGeneratingImage(true);
      try {
        const result = await db.integrations.Core.GenerateImage({
          prompt: text
        });

        const aiMessage = { 
          role: 'assistant', 
          content: specialMode ? '✨ Here\'s your special image creation! I hope you love it!' : 'Here\'s your generated image!',
          imageUrl: result.url
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error('Error:', error);
        const errorMessage = { 
          role: 'assistant', 
          content: 'I apologize, but I encountered an issue generating the image. Please try again!',
          sections: []
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        setIsGeneratingImage(false);
      }
      return;
    }

    const specialModeInstruction = specialMode 
      ? `IMPORTANT: The user has enabled SPECIAL MODE. Make your response extra delightful, personalized, warm, and encouraging. Add creative touches, use emojis tastefully, be enthusiastic, and make the user feel truly special and valued. Go above and beyond!`
      : '';

    const fastModeInstruction = fastMode
      ? `IMPORTANT: The user has enabled FAST MODE. Give a quick, direct, concise answer. Be brief and to the point. Only 1-2 short sections maximum. No fluff, just the essential information they need.`
      : '';

    const birthdayInstruction = checkForBirthday(text)
      ? `The user is celebrating a birthday! Make this response EXTRA special, celebratory, and joyful. Include birthday wishes, positive affirmations, and make them feel amazing!`
      : '';

    const prompt = fastMode 
      ? `You are V.AI in FAST MODE. Give a quick, direct, helpful answer. Be concise and to the point. You are an EXPERT programmer.

CRITICAL: Respond in the EXACT SAME LANGUAGE as the user's message.

${birthdayInstruction}

User's message: "${text}"

Respond with a JSON object:
{
  "response_type": "simple" or "detailed" or "code",
  "message": "your response text (used when simple) or friendly intro (when code)",
  "code": "the FULL working code (when code)",
  "language": "html" or "javascript" or "python" or "css" (when code)",
  "instructions": ["super simple step 1", "step 2", ...] (when code),
  "sections": [{"title": "...", "content": "..."}]
}

For FAST MODE: Use response_type "simple" with a short message for normal chat. BUT if the user asks for code, a website, or anything programming-related, use response_type "code" and write COMPLETE, WORKING code (no placeholders) with simple step-by-step instructions.`
      : `You are V.AI, a smart and adaptive AI assistant. You are an EXPERT programmer who truly understands coding. You respond in three ways depending on what the user says:

1. SIMPLE/CONVERSATIONAL: When the user is just chatting casually (greetings like "what's up", "hey", "how are you", small talk, simple questions, or anything that doesn't need detailed information), respond naturally like a friendly friend would. Just a normal conversational reply. Set response_type to "simple" and put your reply in "message".

2. CODE: When the user asks for code, wants to build a website, app, or program, asks how to code something, wants HTML/CSS/JavaScript/Python/etc., or anything programming-related, give a CODE response. You MUST:
   - Write REAL, COMPLETE, WORKING code that actually runs. No placeholders, no "// your code here", no "..." — write the FULL thing.
   - If it's a website, put the full HTML, CSS, and JavaScript together in ONE code block so it works by just saving and opening in a browser.
   - Set response_type to "code", put the full code in "code", the language in "language" (e.g. "html", "javascript", "python", "css"), and a friendly intro in "message".
   - Put step-by-step instructions in "instructions" — an array of super simple steps, so easy that even a 2-year-old could follow them. Each step should be one short, clear sentence.
   - NEVER give partial code or skip parts. The code must be functional and complete.

3. DETAILED/RICH: When the user asks for something complex, needs information, wants ideas, asks for help, advice, explanations, plans, or anything that benefits from multiple perspectives (and is NOT a coding request), give a RICH response with 3-5 distinct sections. Each section offers a different angle, idea, or type of help. Set response_type to "detailed" and put the sections in "sections".

CRITICAL: Respond in the EXACT SAME LANGUAGE as the user's message. Match their language perfectly.

${specialModeInstruction}
${birthdayInstruction}

Examples:
- "what's up?" → simple: "Hey! Not much, just here ready to help you out. What's on your mind? 😊"
- "hey" → simple: "Hi there! How's your day going? What can I do for you?"
- "make me a website" → code: full working HTML/CSS/JS in one block + simple instructions
- "how do I start a business?" → detailed: 4-5 sections with different aspects
- "give me ideas for a birthday party" → detailed: 3-5 sections with creative ideas

User's message: "${text}"

Respond with a JSON object:
{
  "response_type": "simple" or "detailed" or "code",
  "message": "your conversational reply (when simple) or friendly intro (when code)",
  "code": "the FULL working code (when code)",
  "language": "html" or "javascript" or "python" or "css" (when code)",
  "instructions": ["super simple step 1", "step 2", ...] (when code),
  "sections": [{"title": "...", "content": "..."}] (when detailed)
}

REMEMBER: Use the same language as the user! Be natural and friendly for casual chat, give COMPLETE working code for coding requests, rich and comprehensive for complex questions.`;

    try {
      const response = await db.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            response_type: { type: "string" },
            message: { type: "string" },
            code: { type: "string" },
            language: { type: "string" },
            instructions: {
              type: "array",
              items: { type: "string" }
            },
            sections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" }
                }
              }
            }
          }
        }
      });

      const isCode = response.response_type === 'code' && response.code;
      const isSimple = response.response_type === 'simple' || (response.message && (!response.sections || response.sections.length === 0) && !response.code);
      const aiMessage = {
        role: 'assistant',
        content: isCode
          ? (response.message || "Here's your code! 💻")
          : isSimple
          ? (response.message || "I'm here to help!")
          : (response.sections?.map(s => s.content).join('\n\n') || response.message || 'I\'m here to help!'),
        sections: isSimple || isCode ? [] : (response.sections || []),
        code: isCode ? response.code : undefined,
        language: isCode ? response.language : undefined,
        instructions: isCode ? (response.instructions || []) : undefined
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an issue. Please try again!',
        sections: []
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50 flex flex-col" dir="auto">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-pink-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-amber-200 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/70 backdrop-blur-xl border-b border-white/50 sticky top-0">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-violet-200">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-700 to-pink-600 bg-clip-text text-transparent">
                V.AI
              </h1>
              <p className="text-xs text-gray-500">
                {user?.email || 'More answers. More value. More you.'}
              </p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2">
            <FastModeToggle isOn={fastMode} onToggle={() => setFastMode(!fastMode)} />
            <SpecialModeToggle isOn={specialMode} onToggle={() => setSpecialMode(!specialMode)} />
            {messages.length > 0 && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={clearChat}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            )}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => logout()}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 relative z-10 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-[60vh] flex flex-col items-center justify-center text-center px-4"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 flex items-center justify-center mb-6 shadow-2xl shadow-violet-300"
                >
                  <Sparkles className="w-12 h-12 text-white" />
                </motion.div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                  Welcome to{' '}
                  <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                    V.AI
                  </span>
                </h2>
                <p className="text-gray-500 text-lg mb-8 max-w-md">
                  Ask me anything and I'll give you rich, comprehensive answers. I can also create images for you!
                </p>

                <SuggestionChips onSelect={sendMessage} />
              </motion.div>
            ) : (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2 pb-4"
              >
                {messages.map((msg, idx) => (
                  <ChatMessage
                    key={idx}
                    message={msg.content}
                    isUser={msg.role === 'user'}
                    isSpecialMode={specialMode}
                    sections={msg.sections}
                    imageUrl={msg.imageUrl}
                    code={msg.code}
                    language={msg.language}
                    instructions={msg.instructions}
                  />
                ))}
                {isGeneratingImage && <ImageLoadingAnimation isSpecialMode={specialMode} />}
                {isLoading && !isGeneratingImage && <LoadingDots isSpecialMode={specialMode} isFastMode={fastMode} />}
                <div ref={messagesEndRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Input Area */}
      <footer className="relative z-10 bg-white/70 backdrop-blur-xl border-t border-white/50 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <motion.div 
            className={`flex items-center gap-3 bg-white rounded-2xl border-2 transition-all duration-300 p-2 ${
              fastMode
                ? 'border-emerald-300 shadow-lg shadow-emerald-100'
                : specialMode 
                ? 'border-violet-300 shadow-lg shadow-violet-100' 
                : 'border-gray-200 shadow-sm hover:border-violet-200'
            }`}
            whileFocus={{ scale: 1.01 }}
          >
            <VoiceButton onTranscript={handleVoiceTranscript} disabled={isLoading} />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                fastMode 
                  ? "Ask me anything... I'll answer fast ⚡" 
                  : specialMode 
                  ? "Ask me anything... I'll make it special ✨" 
                  : "Ask me anything... or tap the mic 🎤"
              }
              className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              disabled={isLoading}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className={`rounded-xl px-5 py-6 transition-all duration-300 ${
                fastMode
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90'
                  : specialMode 
                  ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:opacity-90' 
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90'
              }`}
            >
              <Send className="w-5 h-5" />
            </Button>
          </motion.div>
          
          <p className="text-center text-xs text-gray-400 mt-3">
            V.AI gives you more. Try{' '}
            <button 
              onClick={() => setFastMode(!fastMode)}
              className="text-emerald-600 hover:underline font-medium"
            >
              Fast Mode
            </button>
            {' '}⚡ or{' '}
            <button 
              onClick={() => setSpecialMode(!specialMode)}
              className="text-violet-600 hover:underline font-medium"
            >
              Special Mode
            </button>
            {' '}✨
          </p>
        </div>
      </footer>

      {/* Birthday Celebration */}
      <BirthdayCelebration show={showBirthday} onClose={() => setShowBirthday(false)} />
    </div>
  );
}