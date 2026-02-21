import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Users, Send, DollarSign, ChevronDown,
  AlertCircle, Play, Smile,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { liveStreams, mockChatMessages } from '@/data/mockData';
import { cn } from '@/lib/utils';

const CHAT_MOCK = [
  { id: '1', user: 'CyberSamurai', role: '', message: 'The lighting in this scene is absolutely insane! 🔥', donation: false },
  { id: '2', user: 'NeonKnight', role: 'MOD', message: 'Please keep the chat respectful everyone! 🙏', donation: false },
  { id: '3', user: 'RetroWave17', role: '', message: '🎶🎶🎶 LOVE THE VIBES!', donation: false, liked: true },
  { id: '4', user: 'GoldGamer', role: '', message: 'Just donated $50! Keep it up! 💎', donation: true },
  { id: '5', user: 'StreamFan99', role: '', message: 'First time watching – already subscribed 🚀', donation: false },
  { id: '6', user: 'TechWizard', role: '', message: 'This quality is unreal for a live stream', donation: false },
];

const Live: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const stream = (liveStreams.find((l) => l.id === id) ?? liveStreams[0]);
  const [message, setMessage] = useState('');
  const [chatSlowMode, setChatSlowMode] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row h-full min-h-0 overflow-hidden">
        {/* ── Left: Player + Info ─────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 overflow-y-auto">
          {/* Player */}
          <div className="relative aspect-video bg-black/90 flex items-center justify-center group cursor-pointer">
            <img
              src={stream.thumbnail}
              alt={stream.title}
              className="w-full h-full object-cover opacity-60"
            />
            {/* Placeholder play */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'hsl(220 14% 18% / .8)', border: '1px solid hsl(220 14% 28%)' }}
              >
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            </div>
            {/* LIVE overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-3">
              <span className="live-badge text-xs">Live</span>
              <span className="bg-black/70 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">
                <Users className="w-3 h-3" />
                {(stream.viewerCount ?? 28400).toLocaleString()} viewers
              </span>
            </div>
          </div>

          {/* Video info */}
          <div className="p-5">
            <h1 className="text-lg font-bold text-foreground leading-snug mb-2">{stream.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mb-4 text-sm text-muted-foreground">
              <span>{stream.views}</span>
              <span className="text-muted-foreground/40">•</span>
              <span>Streamed 2 hours ago</span>
              <span className="tag-pill">{stream.category}</span>
            </div>

            {/* Creator row */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30">
              <div
                className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm"
                style={{ background: 'var(--gradient-cyan-purple)', color: 'hsl(220 20% 6%)' }}
              >
                N
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-foreground">NeonSpeccter</span>
                  <span className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#00D4FF' }}>
                    <span className="text-[8px] text-black font-bold">✓</span>
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">2.4M subscribers</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-cyan py-2 px-4 text-xs rounded-lg">Subscribe</button>
                <button className="btn-outline-cyan py-2 px-3 text-xs rounded-lg gap-1.5">
                  <DollarSign className="w-3 h-3" /> Tip Creator
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4 p-4 rounded-xl bg-secondary/20">
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {stream.description}
              </p>
              <button className="text-xs mt-2 font-medium" style={{ color: '#00D4FF' }}>Show more</button>
            </div>
          </div>
        </div>

        {/* ── Right: Live Chat ─────────────────────────────────────────────── */}
        <div
          className="lg:w-80 xl:w-96 flex-shrink-0 flex flex-col border-l border-white/[.05]"
          style={{ background: 'hsl(220 20% 7%)' }}
        >
          {/* Chat header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[.05]">
            <span className="text-sm font-semibold text-foreground">Live Chat</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-medium">
                {(28400).toLocaleString()} <span style={{ color: '#00D4FF' }}>VIEWERS</span>
              </span>
            </div>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2 min-h-0">
            {CHAT_MOCK.map((m) => (
              <div key={m.id} className={cn(m.donation ? 'chat-msg-donation' : 'chat-msg')}>
                <div className="flex items-start gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold mt-0.5"
                    style={{ background: 'var(--gradient-cyan-purple)', color: 'hsl(220 20% 6%)' }}
                  >
                    {m.user[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-foreground mr-1.5">{m.user}</span>
                    {m.role && (
                      <span className="text-[9px] font-bold uppercase px-1 py-0.5 rounded mr-1.5"
                        style={{ background: '#00D4FF', color: 'hsl(220 20% 6%)' }}>
                        {m.role}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground leading-relaxed">{m.message}</span>
                    {m.liked && (
                      <p className="text-[10px] mt-1 font-medium uppercase tracking-wider" style={{ color: '#00D4FF' }}>
                        STREAMER LIKED THIS MESSAGE
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat input */}
          <div className="border-t border-white/[.05] p-3">
            <form onSubmit={sendMessage} className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--gradient-cyan-purple)', color: 'hsl(220 20% 6%)' }}
              >
                A
              </div>
              <div className="flex-1 relative">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Send a message..."
                  className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all pr-8"
                />
                <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <Smile className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                type="submit"
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors hover:opacity-90"
                style={{ background: 'var(--gradient-cyan-purple)' }}
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </form>
            <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
              <button
                onClick={() => setChatSlowMode(!chatSlowMode)}
                className={cn('hover:text-foreground transition-colors', chatSlowMode && 'text-primary')}
              >
                Slow Mode: {chatSlowMode ? 'On' : 'Off'}
              </button>
              <button className="hover:text-foreground transition-colors">Chat Rules</button>
              <button className="hover:text-foreground transition-colors">Full View</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Live;
