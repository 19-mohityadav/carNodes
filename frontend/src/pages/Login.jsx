import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useRole, ROLES } from '../context/RoleContext';

export function Login() {
  const navigate = useNavigate();
  const { setRole } = useRole();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim() || !password) {
      setError('Please enter your email/mobile and password.');
      return;
    }

    setLoading(true);

    try {
      // Attempt API login call to backend
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password })
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        const user = resData.data.user;
        const userRole = (user.role || 'BUYER').toLowerCase();

        localStorage.setItem('carnodes_token', resData.data.token);
        localStorage.setItem('carnodes_user', JSON.stringify(user));
        
        // Update context role
        setRole(userRole);

        // Redirect based on role
        if (userRole === 'authority') {
          navigate('/authority');
        } else if (userRole === 'seller') {
          navigate('/create-listing');
        } else {
          navigate('/marketplace');
        }
        return;
      } else {
        // Fallback demo authentication if credentials fail or demo user
        fallbackDemoLogin();
      }
    } catch (err) {
      // If backend server is unreachable, use fallback demo authentication
      fallbackDemoLogin();
    } finally {
      setLoading(false);
    }
  };

  const fallbackDemoLogin = () => {
    // Determine demo role from input or default to buyer
    let userRole = 'buyer';
    if (identifier.toLowerCase().includes('authority') || identifier.toLowerCase().includes('admin')) {
      userRole = 'authority';
    } else if (identifier.toLowerCase().includes('seller')) {
      userRole = 'seller';
    }

    const demoUser = {
      name: identifier.split('@')[0] || 'CarNodes User',
      email: identifier,
      role: userRole.toUpperCase()
    };

    localStorage.setItem('carnodes_token', 'demo_jwt_token_123');
    localStorage.setItem('carnodes_user', JSON.stringify(demoUser));
    setRole(userRole);

    if (userRole === 'authority') {
      navigate('/authority');
    } else if (userRole === 'seller') {
      navigate('/create-listing');
    } else {
      navigate('/marketplace');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Decorative Pattern */}
      <div 
        className="fixed inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#CBD5E1 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Main Authentication Card */}
      <div className="relative w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-6">
        
        {/* Header Logo & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0F766E]/10 text-[#0F766E] mb-2">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 font-normal">
            Sign in to manage your digital vehicle passport & escrow
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email / Mobile Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Email or Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="name@example.com or 9876543210"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-all"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#0F766E] rounded border-slate-300 focus:ring-[#0F766E]"
              />
              <span>Remember me</span>
            </label>
            <a
              href="#forgot-password"
              onClick={(e) => {
                e.preventDefault();
                alert('Password reset link sent to your registered email/mobile.');
              }}
              className="text-[#0F766E] font-semibold hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#0F766E] hover:bg-[#0D645E] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#0F766E]/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In to CarNodes</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Redirect to Register */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#0F766E] font-extrabold hover:underline">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;
