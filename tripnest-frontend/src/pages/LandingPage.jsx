import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import AnimatedPage from '../components/AnimatedPage';
import CountUp from '../components/CountUp';
import { 
  Compass, 
  Calendar, 
  Wallet, 
  Users, 
  FolderLock, 
  Bell, 
  ArrowRight, 
  CheckCircle2, 
  Plane, 
  Sparkles
} from 'lucide-react';

const features = [
  { icon: Calendar, title: 'Smart Itineraries', desc: 'Day-wise activity timelines with exact timings, locations, and flight schedules.' },
  { icon: Wallet, title: 'Budget Intelligence', desc: 'Set target budgets, track category expenses, and receive real-time overspend alerts.' },
  { icon: Users, title: 'Live Collaboration', desc: 'Invite friends, split trip expenses transparently, and chat in dedicated trip rooms.' },
  { icon: Compass, title: 'Destination Insights', desc: 'Discover curated local attractions, weather forecasts, and travel safety guides.' },
  { icon: FolderLock, title: 'Travel Vault', desc: 'Securely attach boarding passes, hotel reservations, and emergency contacts.' },
  { icon: Bell, title: 'Real-time Alerts', desc: 'Instant push notifications for flight changes, group activity, and expense updates.' },
];

const destinations = [
  { name: 'Goa', country: 'India', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80', count: '2.4k trips', tag: 'Beach Haven' },
  { name: 'Manali', country: 'India', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=80', count: '1.8k trips', tag: 'Alpine Escape' },
  { name: 'Jaipur', country: 'India', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&auto=format&fit=crop&q=80', count: '3.1k trips', tag: 'Royal Heritage' },
  { name: 'Munnar', country: 'India', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&auto=format&fit=crop&q=80', count: '2.0k trips', tag: 'Lush Hills' },
];

const steps = [
  { num: '01', title: 'Create Workspace', desc: 'Sign up free and setup your personalized travel hub.' },
  { num: '02', title: 'Build Itinerary', desc: 'Pick your destinations and outline day-by-day itineraries.' },
  { num: '03', title: 'Invite Travelers', desc: 'Share your trip link to co-plan and split expenses.' },
  { num: '04', title: 'Embark & Track', desc: 'Stay organized on the go with real-time budget sync.' },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  if (user) return null;

  return (
    <AnimatedPage className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Ambient background glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 -z-10 w-[700px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-cyan-400/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 -right-20 -z-10 w-[350px] h-[350px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6 shadow-glow-indigo">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Next-Gen Travel Operating System</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15] mb-6">
              Plan your perfect journey, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                without the chaos.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Seamlessly orchestrate day-by-day itineraries, group expenses, live chat, and destination intelligence — backed by smart real-time budget analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto primary-button text-base px-8 py-4 flex items-center justify-center gap-2 group"
              >
                <span>Start Planning Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto secondary-button text-base px-8 py-4"
              >
                Sign In to Account
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Real-time Group Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Smart Expense Splitter</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative ring */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-600 opacity-30 blur-lg group-hover:opacity-100 transition duration-1000" />

              {/* Main Preview Glass Card */}
              <div className="relative rounded-3xl border border-slate-800 bg-slate-900/90 p-6 backdrop-blur-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <Plane className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Bali Expedition 2026</h4>
                      <p className="text-xs text-slate-400">7 Days • 4 Travelers</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                    Ongoing
                  </span>
                </div>

                {/* Progress bar inside preview */}
                <div className="mb-5 bg-slate-800/60 rounded-xl p-3.5 border border-slate-800">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">Budget Spent</span>
                    <span className="text-cyan-400 font-bold">$1,240 / $2,000</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full w-[62%]" />
                  </div>
                </div>

                {/* Mini Itinerary items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xs">
                        🏖️
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Uluwatu Sunset Surf</p>
                        <p className="text-[10px] text-slate-400">04:30 PM • Day 3</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-300">$45</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs">
                        🍽️
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Seafood Dinner at Jimbaran</p>
                        <p className="text-[10px] text-slate-400">07:30 PM • Day 3</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-300">$85</span>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">A</div>
                    <div className="w-7 h-7 rounded-full bg-cyan-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">R</div>
                    <div className="w-7 h-7 rounded-full bg-purple-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">S</div>
                  </div>
                  <span className="text-indigo-400 font-medium">3 Active Collabs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="border-y border-slate-800/80 bg-slate-900/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              <CountUp end={10000} suffix="+" />
            </p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Trips Planned</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              <CountUp end={2.5} prefix="$" suffix="M+" />
            </p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Expenses Managed</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              <CountUp end={50000} suffix="+" />
            </p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Active Travelers</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              <CountUp end={99.9} suffix="%" />
            </p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">Designed for modern explorers</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Everything you need for stress-free travel</h2>
          <p className="text-slate-400 mt-3 text-base">Replace fragmented notes, spreadsheets, and group chats with one unified command center.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group relative rounded-2xl border border-slate-800/80 bg-slate-900/60 p-8 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/50 hover:bg-slate-900/90 hover:shadow-glow-indigo hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED DESTINATIONS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/30 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">Trending Hotspots</p>
              <h2 className="text-3xl font-extrabold text-white">Discover top destinations</h2>
            </div>
            <button
              onClick={() => navigate('/register')}
              className="mt-4 sm:mt-0 text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"
            >
              <span>Explore all destinations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((d) => (
              <div
                key={d.name}
                onClick={() => navigate('/register')}
                className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-1.5 hover:shadow-2xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={d.image}
                    alt={d.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-cyan-400 border border-slate-700">
                    {d.tag}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white text-base">{d.name}</h4>
                    <span className="text-xs text-slate-400">{d.country}</span>
                  </div>
                  <p className="text-xs text-slate-500">{d.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">Simple Workflow</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Get started in 4 easy steps</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {steps.map((s) => (
            <div key={s.num} className="relative rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md transition-transform hover:-translate-y-1">
              <span className="text-3xl font-black bg-gradient-to-br from-indigo-500 to-cyan-400 bg-clip-text text-transparent mb-4 block">
                {s.num}
              </span>
              <h4 className="text-lg font-bold text-white mb-2">{s.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-950/60 to-slate-900 border border-indigo-500/30 my-16 shadow-glow-indigo">
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Ready for your next adventure?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto mb-8">
            Join thousands of modern travelers who plan, collaborate, and travel smarter with TripNest.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="primary-button text-base px-10 py-4 shadow-xl shadow-indigo-500/30"
          >
            Create Free Account
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Plane className="w-4 h-4 transform -rotate-45" />
            </div>
            <span>TripNest</span>
          </div>
          <p>© 2026 TripNest Inc. All rights reserved. Travel planning re-imagined.</p>
        </div>
      </footer>
    </AnimatedPage>
  );
};

export default LandingPage;
