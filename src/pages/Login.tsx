import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Square } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPass, setShowPass] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) {
      navigate('/');
    } else {
      toast({ title: 'Login failed', description: 'Invalid email or password.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7C3AED, transparent 70%)' }} />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00D4FF, transparent 70%)' }} />

      <div className="relative w-full max-w-sm animate-scale-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-xl font-black"
            style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)', color: '#fff' }}
          >
            S
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-widest uppercase" style={{ color: '#F97316' }}>□</span>
            <span className="text-sm font-bold tracking-widest uppercase text-foreground">STREAMHUB</span>
          </div>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-foreground text-center mb-1.5">Welcome Back</h1>
          <p className="text-sm text-muted-foreground text-center mb-7">Experience cinema in high definition</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[.05] border border-white/[.1] rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-foreground">Password</label>
                <Link to="/forgot-password" className="text-xs transition-colors hover:underline" style={{ color: '#00D4FF' }}>
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[.05] border border-white/[.1] rounded-lg px-4 py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-orange w-full py-3 rounded-lg text-sm font-bold uppercase tracking-wider disabled:opacity-60 mt-2"
            >
              {isLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Social */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[.08]" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">or continue with</span>
            <div className="flex-1 h-px bg-white/[.08]" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['Apple', 'Google', 'Facebook'].map((p) => (
              <button
                key={p}
                className="flex items-center justify-center py-2.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground transition-all border border-white/[.08] hover:border-white/[.16] hover:bg-white/[.04]"
              >
                {p[0]}
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold hover:underline" style={{ color: '#00D4FF' }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
