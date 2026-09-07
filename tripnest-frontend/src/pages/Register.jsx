import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Shield, Eye, EyeOff, AlertCircle, Plane, ArrowRight } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'TRAVELER'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await register(
        form.name, form.email, form.password, form.role
      );
      if (!result.success) {
        const msg = result.message || 'Registration failed.';
        setError(msg);
        toast.error(msg);
      } else {
        toast.success('Account created successfully!');
      }
    } catch (err) {
      console.error("Register error:", err);
      const msg = "Registration failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage className="relative min-h-screen bg-[#0b0f19] text-slate-100 flex items-center justify-center px-4 py-12 overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-500/10 blur-[130px]" />

      <div className="w-full max-w-md">
        {/* Brand Logo Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200">
              <Plane className="w-6 h-6 text-white transform -rotate-45" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Trip<span className="text-indigo-400">Nest</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white mt-4">Create your account</h2>
          <p className="text-sm text-slate-400 mt-1">Start planning smarter travel in under 30 seconds</p>
        </div>

        {/* Form Card */}
        <div className={`rounded-3xl border border-slate-800 bg-slate-900/80 p-8 backdrop-blur-2xl shadow-2xl transition-all ${error ? 'border-rose-500/50' : ''}`}>
          {error && (
            <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl mb-6 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="field">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="field">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Password */}
            <div className="field">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Role Selector */}
            <div className="field">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Workspace Role
              </label>
              <div className="relative">
                <Shield className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-white text-sm outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="TRAVELER">Traveler (Default)</option>
                  <option value="GROUP_ADMIN">Group Admin</option>
                  <option value="ADMIN">System Admin</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full primary-button py-3.5 text-sm font-semibold flex items-center justify-center gap-2 group mt-2"
            >
              <span>{loading ? 'Creating Account...' : 'Get Started Free'}</span>
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Switch to Login */}
          <p className="text-center mt-6 text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline transition">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Register;
