import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Signup: React.FC = () => {
  const { signup, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPass, setShowPass] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: 'Password too short', description: 'At least 6 characters required.', variant: 'destructive' });
      return;
    }
    const ok = await signup(username, email, password);
    if (ok) {
      navigate('/');
    } else {
      toast({ title: 'Sign up failed', description: 'Please check your details and try again.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7C3AED, transparent 70%)' }} />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00D4FF, transparent 70%)' }} />

      <div className="relative w-full max-w-sm animate-scale-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 font-black text-xl"
            style={{ background: 'var(--gradient-cyan-purple)', color: 'hsl(220 20% 6%)' }}
          >
            S
          </div>
          <span className="text-sm font-bold tracking-widest uppercase" style={{ color: '#00D4FF' }}>STREAMHUB</span>
        </div>

        <div className="glass-panel rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-foreground text-center mb-1.5">Create Account</h1>
          <p className="text-sm text-muted-foreground text-center mb-7">Join millions of streamers worldwide</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Username</label>
              <input
                type="text" required placeholder="coolcreator"
                value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/[.05] border border-white/[.1] rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Email Address</label>
              <input
                type="email" required placeholder="name@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[.05] border border-white/[.1] rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} required placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[.05] border border-white/[.1] rounded-lg px-4 py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={isLoading}
              className="btn-cyan w-full py-3 rounded-lg text-sm font-bold uppercase tracking-wider disabled:opacity-60 mt-2"
            >
              {isLoading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: '#00D4FF' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
