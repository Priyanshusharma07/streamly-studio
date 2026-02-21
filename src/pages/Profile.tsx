import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload, Settings, TrendingUp, Eye, Play,
  Clock, CreditCard, ChevronRight, Camera,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile, useChangePassword } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const HISTORY = [
  {
    id: '1',
    title: 'Mastering Cinematic Lighting in 2024',
    channel: 'Visual Arts Mastery',
    views: '1.2M views',
    time: '2 days ago',
    duration: '12:45',
    progress: 75,
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=320&h=180&fit=crop',
  },
  {
    id: '2',
    title: 'UI Design Trends that actually work',
    channel: 'Design Lab',
    views: '450K views',
    time: '5 days ago',
    duration: '08:30',
    progress: 40,
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=320&h=180&fit=crop',
  },
  {
    id: '3',
    title: 'Exploring Deep Space: New Horizon',
    channel: 'SpaceX Unofficial',
    views: '3M views',
    time: '1 week ago',
    duration: '15:10',
    progress: 20,
    thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=320&h=180&fit=crop',
  },
];

const TABS = ['Dashboard', 'Library', 'Community'];

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: profile } = useProfile();
  const { mutateAsync: changePassword, isPending: changingPw } = useChangePassword();

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');

  const displayUser = profile ?? user;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changePassword({ oldPassword: oldPw, newPassword: newPw });
      toast({ title: 'Password updated', description: 'Your password has been changed.' });
      setOldPw(''); setNewPw('');
    } catch {
      toast({ title: 'Failed', description: 'Could not change password.', variant: 'destructive' });
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Tab bar */}
        <div className="flex items-center gap-6 border-b border-white/[.05] mb-6 -mx-6 px-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={cn(
                'pb-3 text-sm font-medium transition-colors border-b-2 -mb-px',
                activeTab === t
                  ? 'text-foreground border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground',
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Sidebar profile ─────────────────────────────────────────── */}
          <div className="lg:w-52 flex-shrink-0">
            {/* Avatar */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative mb-3">
                <Avatar className="w-20 h-20 ring-2 ring-primary/30">
                  <AvatarImage src={displayUser?.avatar} />
                  <AvatarFallback
                    className="text-xl font-bold"
                    style={{ background: 'var(--gradient-cyan-purple)', color: 'hsl(220 20% 6%)' }}
                  >
                    {displayUser?.username?.charAt(0).toUpperCase() ?? 'A'}
                  </AvatarFallback>
                </Avatar>
                <button
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--gradient-cyan-purple)' }}
                >
                  <Camera className="w-3 h-3 text-white" />
                </button>
              </div>
              <h2 className="text-base font-bold text-foreground">{displayUser?.username ?? 'Alex Rivera'}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">@{displayUser?.email?.split('@')[0] ?? 'alex_creations'}</p>

              <Link to="/upload" className="btn-outline-cyan w-full mt-4 py-2 text-xs rounded-lg gap-1.5 justify-center">
                <Upload className="w-3.5 h-3.5" /> Upload Video
              </Link>
            </div>

            {/* Subscription */}
            <div className="p-4 rounded-xl bg-secondary/30">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 font-semibold">Subscription</p>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-foreground">StreamHub Pro</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white"
                  style={{ background: 'var(--gradient-cyan-purple)' }}>PRO</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[10px] text-muted-foreground">Renews Oct 12, 2025</span>
                <span className="text-[10px] font-semibold" style={{ color: '#00D4FF' }}>$8.99/mo</span>
              </div>
              <button className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-3 flex items-center gap-1">
                <CreditCard className="w-3 h-3" /> Manage Billing
              </button>
            </div>
          </div>

          {/* ── Main content ─────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="stat-card-cyan">
                <p className="text-xs text-muted-foreground mb-2">Total Video Views</p>
                <p className="text-3xl font-black text-foreground" style={{ color: '#00D4FF' }}>1.2M</p>
                <p className="text-xs mt-2 font-medium" style={{ color: '#00D4FF' }}>+12.5% this week</p>
              </div>
              <div className="stat-card-purple">
                <p className="text-xs text-muted-foreground mb-2">Total Engagement</p>
                <p className="text-3xl font-black text-foreground" style={{ color: '#A855F7' }}>85.4K</p>
                <p className="text-xs mt-2 font-medium" style={{ color: '#A855F7' }}>+4.2% this week</p>
              </div>
            </div>

            {/* Watch History */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Recent Watch History</h3>
                <button className="text-xs font-medium" style={{ color: '#00D4FF' }}>View All</button>
              </div>
              <div className="space-y-4">
                {HISTORY.map((item) => (
                  <Link key={item.id} to={`/watch/${item.id}`} className="flex gap-3 group">
                    <div className="relative w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: 'hsl(220 20% 6% / .5)' }}>
                        <Play className="w-6 h-6 text-white fill-white" />
                      </div>
                      <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded font-medium">
                        {item.duration}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 py-0.5">
                      <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">{item.channel} · {item.views} · {item.time}</p>
                      {/* Progress bar */}
                      <div className="mt-2 h-0.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${item.progress}%`, background: 'var(--gradient-cyan-purple)' }}
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Change Password */}
            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" /> Security
              </h3>
              <form onSubmit={handlePasswordChange} className="space-y-3 max-w-sm">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Current Password</label>
                  <input
                    type="password" required value={oldPw} onChange={(e) => setOldPw(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-secondary/40 border border-border/60 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">New Password</label>
                  <input
                    type="password" required value={newPw} onChange={(e) => setNewPw(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-secondary/40 border border-border/60 rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
                <button
                  type="submit" disabled={changingPw}
                  className="btn-cyan px-6 py-2 rounded-lg text-xs disabled:opacity-60"
                >
                  {changingPw ? 'Saving…' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
