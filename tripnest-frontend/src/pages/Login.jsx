import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Plane, ArrowRight } from "lucide-react";

const Login = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        const msg = result.message || "Invalid email or password.";
        setError(msg);
        toast.error(msg);
      } else {
        toast.success("Welcome back!");
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg = "Login failed. Please verify credentials and try again.";
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
          <h2 className="text-2xl font-bold text-white mt-4">Welcome back</h2>
          <p className="text-sm text-slate-400 mt-1">Sign in to manage your itineraries & budgets</p>
        </div>

        {/* Form Card */}
        <div className={`rounded-3xl border border-slate-800 bg-slate-900/80 p-8 backdrop-blur-2xl shadow-2xl transition-all ${error ? 'border-rose-500/50' : ''}`}>
          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl mb-6 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="field">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="field">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full primary-button py-3.5 text-sm font-semibold flex items-center justify-center gap-2 group"
            >
              <span>{loading ? "Signing in..." : "Sign In"}</span>
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative bg-slate-900 px-3 text-xs text-slate-500 uppercase tracking-wider">
              Or continue with
            </span>
          </div>

          {/* Google OAuth Button */}
          <a
            href={`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/oauth2/authorization/google`}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-700 text-slate-200 text-sm font-medium transition duration-200"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-4 h-4"
            />
            <span>Google Workspace</span>
          </a>

          {/* Switch to Register */}
          <p className="text-center mt-6 text-xs text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-400 font-semibold hover:text-indigo-300 hover:underline transition"
            >
              Create free account
            </Link>
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Login;


