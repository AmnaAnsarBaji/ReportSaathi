import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Stethoscope,
  Bot,
  User as UserIcon,
} from 'lucide-react';
import { api } from '../../services/api';

export default function ReportChat({ report }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I can explain the values and parameters in your ${report?.title || 'laboratory report'}. What would you like to understand better?`,
      isSupported: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Suggested quick prompts based on report type
  const defaultPrompts = [
    'Explain my main findings in simple terms',
    'Are any of my values flagged outside normal range?',
    'What questions should I ask my doctor about these results?',
  ];

  const handleSendMessage = async (userText) => {
    const text = (userText || input).trim();
    if (!text || isLoading) return;

    setErrorMsg(null);
    setInput('');

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      isSupported: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await api.askReportQuestion(text, report, historyPayload);

      const botMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        isSupported: res.is_supported_by_report !== false,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const detail = err.response?.data?.detail || err.message || 'Unable to get response.';
      setErrorMsg(detail);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: 'I had trouble connecting to the medical assistant service. Please check your connection and try again.',
          isSupported: true,
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Conversation reset. Feel free to ask any question regarding your ${report?.title || 'laboratory report'}.`,
        isSupported: true,
      },
    ]);
    setErrorMsg(null);
  };

  return (
    <div className="bg-white rounded-[32px] border border-[#def1f5] shadow-sm overflow-hidden flex flex-col no-print print-card">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-[#def1f5] bg-gradient-to-r from-[#f1f8fa] to-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#189ab4] text-white flex items-center justify-center shadow-xs">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#11323c] flex items-center gap-2">
              <span>Ask About This Report</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#146578] bg-[#def1f5] px-2 py-0.5 rounded-full">
                Report-Grounded AI
              </span>
            </h2>
            <p className="text-xs text-[#558694]">
              Educational answers strictly derived from this document. Does not diagnose or prescribe.
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-[#def1f5]/60 transition"
          title="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Safety Notice Mini-Banner */}
      <div className="px-5 py-2.5 bg-amber-50/80 border-b border-amber-200/70 text-amber-900 text-[11px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Grounded Education:</strong> Questions not supported by your report will be flagged with advice to consult your clinician.
          </span>
        </div>
        {errorMsg && (
          <span className="text-rose-600 font-semibold text-[10px] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
            Notice: {errorMsg}
          </span>
        )}
      </div>

      {/* Messages Stream */}
      <div className="p-5 sm:p-6 space-y-4 max-h-[380px] min-h-[220px] overflow-y-auto bg-[#fafdfe]">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                  isUser
                    ? 'bg-[#189ab4] text-white'
                    : 'bg-[#def1f5] text-[#146578]'
                }`}
              >
                {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  isUser
                    ? 'bg-[#189ab4] text-white rounded-tr-none'
                    : 'bg-white border border-[#def1f5] text-[#11323c] rounded-tl-none'
                }`}
              >
                {!isUser && !m.isSupported && (
                  <div className="mb-2 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Information not supported by this report</span>
                  </div>
                )}

                <div className="whitespace-pre-line">{m.content}</div>

                {!isUser && !m.isSupported && (
                  <div className="mt-2 pt-2 border-t border-amber-200/50 flex items-center gap-1 text-[11px] text-amber-800 font-medium">
                    <Stethoscope className="w-3 h-3 text-amber-700" />
                    <span>Always ask a qualified healthcare professional</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#def1f5] text-[#146578] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-[#def1f5] rounded-2xl rounded-tl-none p-3.5 shadow-2xs flex items-center gap-1.5 text-xs text-[#558694]">
              <span className="w-2 h-2 rounded-full bg-[#189ab4] animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-[#189ab4] animate-bounce [animation-delay:0.15s]"></span>
              <span className="w-2 h-2 rounded-full bg-[#189ab4] animate-bounce [animation-delay:0.3s]"></span>
              <span className="ml-2 font-medium">Reviewing your report context...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="p-3 bg-white border-t border-[#def1f5] flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold uppercase text-[#558694] shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#189ab4]" />
          <span>Suggestions:</span>
        </span>
        {defaultPrompts.map((p, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => handleSendMessage(p)}
            className="shrink-0 text-[11px] px-3 py-1 rounded-full bg-[#f1f8fa] hover:bg-[#def1f5] text-[#175362] font-medium border border-[#def1f5] transition disabled:opacity-50"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3.5 sm:p-4 bg-white border-t border-[#def1f5] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this report (e.g. 'What does hemoglobin mean?')..."
          disabled={isLoading}
          className="flex-1 px-4 py-2.5 rounded-full border border-[#def1f5] text-xs sm:text-sm text-[#11323c] focus:outline-hidden focus:border-[#189ab4] bg-[#f8fcfe] disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-[#189ab4] hover:bg-[#137d94] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Ask</span>
        </button>
      </form>
    </div>
  );
}
