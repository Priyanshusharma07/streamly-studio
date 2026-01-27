import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Users,
  Send,
  Heart,
  ChevronLeft,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { VideoCard } from '@/components/video/VideoCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { liveStreams, mockChatMessages, Video } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const LivePage: React.FC = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [stream, setStream] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState(mockChatMessages);
  const [showControls, setShowControls] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (id) {
      const foundStream = liveStreams.find((s) => s.id === id);
      setStream(foundStream || liveStreams[0]);
    } else {
      setStream(liveStreams[0]);
    }
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate incoming chat messages
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessages = [
        'Wow this is amazing! 🔥',
        'Great quality!',
        'Hello from Brazil! 🇧🇷',
        'Love this stream',
        'GG!',
        '❤️❤️❤️',
        'First time here!',
      ];
      const randomUsers = ['StreamFan', 'Viewer', 'User', 'Guest', 'Watcher'];

      const newMessage = {
        id: Date.now().toString(),
        user: `${randomUsers[Math.floor(Math.random() * randomUsers.length)]}${Math.floor(Math.random() * 1000)}`,
        message: randomMessages[Math.floor(Math.random() * randomMessages.length)],
        timestamp: 'now',
      };

      setMessages((prev) => [...prev.slice(-20), newMessage]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to chat.',
        variant: 'destructive',
      });
      return;
    }

    if (!chatMessage.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      user: user?.username || 'You',
      message: chatMessage,
      timestamp: 'now',
    };

    setMessages((prev) => [...prev, newMessage]);
    setChatMessage('');
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const otherStreams = liveStreams.filter((s) => s.id !== stream?.id);

  if (!stream) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/" className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <div
              className="relative aspect-video bg-black rounded-xl overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => isPlaying && setShowControls(false)}
            >
              <img
                src={stream.thumbnail}
                alt={stream.title}
                className="w-full h-full object-cover"
              />

              {/* Live Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-3">
                <span className="live-badge">Live</span>
                <span className="flex items-center gap-1 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  <Users className="w-4 h-4" />
                  {stream.viewerCount?.toLocaleString()} watching
                </span>
              </div>

              {/* Controls */}
              <div
                className={cn(
                  'absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent transition-opacity',
                  showControls ? 'opacity-100' : 'opacity-0'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </Button>
                    <span className="text-white text-sm">LIVE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                    >
                      <Settings className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                    >
                      <Maximize className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stream Info */}
            <div className="mt-6">
              <h1 className="text-2xl font-bold text-foreground">{stream.title}</h1>
              <p className="text-muted-foreground mt-2">{stream.description}</p>

              <div className="flex items-center gap-4 mt-4">
                <Button variant="secondary" className="gap-2">
                  <Heart className="w-4 h-4" />
                  Follow
                </Button>
              </div>
            </div>

            {/* Other Live Streams */}
            {otherStreams.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-foreground mb-4">More Live Streams</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {otherStreams.map((s) => (
                    <VideoCard key={s.id} video={s} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live Chat */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-xl overflow-hidden h-[600px] flex flex-col">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Live Chat</h2>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className="animate-fade-in">
                      <span className="font-medium text-primary">{msg.user}</span>
                      <span className="text-muted-foreground">: </span>
                      <span className="text-foreground">{msg.message}</span>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    placeholder={isAuthenticated ? 'Send a message...' : 'Sign in to chat'}
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    disabled={!isAuthenticated}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!isAuthenticated}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LivePage;
