import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Mail, Lock, Eye, EyeOff, CheckCircle2, ArrowRight, AlertCircle, ShoppingBag, Car, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('BUYER'); // BUYER | SELLER | AUTHORITY
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !identifier.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const res = await signUp({
        email: identifier.includes('@') ? identifier.trim() : `${name.toLowerCase().replace(/\s+/g, '')}@carnodes.app`,
        password,
        name: name.trim(),
        phone: !identifier.includes('@') ? identifier.trim() : '',
        role: selectedRole,
      });

      const userRole = (res?.profile?.role || selectedRole || 'buyer').toLowerCase();

      // Navigate to home — App.jsx auto-redirects to dashboard based on auth role
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
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

      {/* Registration Card */}
      <div className="relative w-full max-w-lg bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-6">
        
        {/* Header Logo & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0F766E]/10 text-[#0F766E] mb-1">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Create an Account
          </h1>
          <p className="text-sm text-slate-500 font-normal">
            Join CarNodes verified vehicle protocol as a Buyer, Seller, or RTO Authority
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-all"
                required
              />
            </div>
          </div>

          {/* Email / Mobile */}
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
                placeholder="alex@example.com or 9876543210"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-all"
                required
              />
            </div>
          </div>

          {/* Password & Confirm Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Select Your Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Buyer Card */}
              <button
                type="button"
                onClick={() => setSelectedRole('BUYER')}
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  selectedRole === 'BUYER'
                    ? 'border-[#0F766E] bg-[#0F766E]/5 ring-2 ring-[#0F766E]/20'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <ShoppingBag className={`w-5 h-5 ${selectedRole === 'BUYER' ? 'text-[#0F766E]' : 'text-slate-500'}`} />
                  {selectedRole === 'BUYER' && <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] uppercase">Buyer</h4>
                  <p className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                    Browse & transfer
                  </p>
                </div>
              </button>

              {/* Seller Card */}
              <button
                type="button"
                onClick={() => setSelectedRole('SELLER')}
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  selectedRole === 'SELLER'
                    ? 'border-[#0F766E] bg-[#0F766E]/5 ring-2 ring-[#0F766E]/20'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Car className={`w-5 h-5 ${selectedRole === 'SELLER' ? 'text-[#0F766E]' : 'text-slate-500'}`} />
                  {selectedRole === 'SELLER' && <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] uppercase">Seller</h4>
                  <p className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                    List & upload RC
                  </p>
                </div>
              </button>

              {/* Authority Card */}
              <button
                type="button"
                onClick={() => setSelectedRole('AUTHORITY')}
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                  selectedRole === 'AUTHORITY'
                    ? 'border-[#0F766E] bg-[#0F766E]/5 ring-2 ring-[#0F766E]/20'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Shield className={`w-5 h-5 ${selectedRole === 'AUTHORITY' ? 'text-[#0F766E]' : 'text-slate-500'}`} />
                  {selectedRole === 'AUTHORITY' && <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] uppercase">Authority</h4>
                  <p className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                    RTO Audit & Verify
                  </p>
                </div>
              </button>

            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#0F766E] hover:bg-[#0D645E] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#0F766E]/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Redirect to Login */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-[#0F766E] font-extrabold hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Register;
