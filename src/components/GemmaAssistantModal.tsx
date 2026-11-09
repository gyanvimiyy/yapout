import React, { useState, useEffect, useRef } from 'react';
import { gemmaService, GemmaChatMessage } from '../services/gemmaService';
import { useApp } from '../context/AppContext';
import { X, Sparkles, Send, Bot, User, RotateCcw, ArrowRight, Lightbulb } from 'lucide-react';

interface GemmaAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GemmaAssistantModal: React.FC<GemmaAssistantModalProps> = ({ isOpen, onClose }) => {
  const { showToast, setIsCreateHangoutModalOpen } = useApp();

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<GemmaChatMessage[]>([
    {
      sender: 'gemma',
      text: 'Hey! I am your YapOut Social Copilot powered by Google Gemma 4. Ask me for hangout ideas, campus spot suggestions, fun icebreakers, or advice on meeting new people on campus!',
      timestamp: 'Now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Suggest a cozy 1-hour coffee spot for a casual first hangout',
    '3 un-awkward icebreakers for a 4-person study sprint',
    'Fun spontaneous Friday evening activity on campus for 3-5 students',
    'What should I bring to a sunset lawn hangout at Memorial Glade?'
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || loading) return;

    const userMsg: GemmaChatMessage = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const reply = await gemmaService.askAssistant(text, messages);
      const botMsg: GemmaChatMessage = {
        sender: 'gemma',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to connect to Gemma 4', 'error');
      setMessages(prev => [
        ...prev,
        {
          sender: 'gemma',
          text: `Sorry, I hit a snag: ${err.message || 'Please check your connection.'}`,
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden max-h-[88vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[var(--text-primary)]">
                  YapOut AI Copilot
                </h2>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: 'var(--accent-subtle)',
                    color: 'var(--accent-primary)',
                    border: '1px solid var(--accent-border)'
                  }}
                >
                  Gemma 4
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Powered by Google DeepMind's Gemma 4 model
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setMessages([
                  {
                    sender: 'gemma',
                    text: 'Chat reset! What campus hangout, spot, or social plan would you like help with?',
                    timestamp: 'Now'
                  }
                ]);
              }}
              className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-surface-hover)] transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-surface-hover)] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[var(--bg-subtle)]/40">
          {messages.map((m, idx) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isUser
                      ? 'bg-[var(--border-medium)] text-[var(--text-primary)]'
                      : 'text-white'
                  }`}
                  style={{
                    backgroundColor: !isUser ? 'var(--accent-primary)' : undefined
                  }}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-[85%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] mb-1">
                    <span className="font-semibold text-[var(--text-secondary)]">
                      {isUser ? 'You' : 'Gemma 4'}
                    </span>
                    {m.timestamp && <span>· {m.timestamp}</span>}
                  </div>

                  <div
                    className={`py-2.5 px-3.5 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'text-white rounded-tr-xs'
                        : 'bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-tl-xs shadow-xs'
                    }`}
                    style={{
                      backgroundColor: isUser ? 'var(--accent-primary)' : undefined
                    }}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl rounded-tl-xs p-3 text-xs text-[var(--text-secondary)] flex items-center gap-2 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)] animate-spin" />
                <span>Gemma 4 is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 pt-2 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[10px] font-semibold text-[var(--text-muted)] flex items-center gap-1 shrink-0">
            <Lightbulb className="w-3 h-3 text-[var(--accent-primary)]" />
            Try:
          </span>
          {quickPrompts.map(prompt => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-lg text-[10px] bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)] whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {prompt.length > 36 ? prompt.slice(0, 36) + '...' : prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-[var(--bg-surface)] flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            placeholder="Ask Gemma 4 for hangout ideas, spots, icebreakers..."
            className="flex-1 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-ring)]"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || loading}
            className="p-2.5 rounded-xl text-white disabled:opacity-40 shadow-xs cursor-pointer transition-transform active:scale-95 shrink-0"
            style={{ backgroundColor: 'var(--accent-primary)' }}
            title="Send to Gemma 4"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
