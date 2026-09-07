import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Compass, 
  Bell, 
  LayoutDashboard, 
  User, 
  Plus, 
  ArrowRight, 
  X,
  Calendar,
  Sparkles
} from 'lucide-react';
import { tripApi } from '../utils/tripApi';
import { destinationApi } from '../utils/destinationApi';
import { notificationApi } from '../utils/notificationApi';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [trips, setTrips] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setLoading(true);

      setTimeout(() => inputRef.current?.focus(), 50);

      Promise.all([
        tripApi.list().catch(() => ({ data: [] })),
        destinationApi.list().catch(() => ({ data: [] })),
        notificationApi.list().catch(() => ({ data: [] })),
      ])
        .then(([tripsRes, destsRes, notifsRes]) => {
          setTrips(tripsRes.data || []);
          setDestinations(destsRes.data || []);
          setNotifications(notifsRes.data || []);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const quickNav = [
    { type: 'nav', id: 'nav-dash', title: 'Go to Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { type: 'nav', id: 'nav-trips', title: 'Go to Trips', path: '/trips', icon: MapPin, category: 'Navigation' },
    { type: 'nav', id: 'nav-create-trip', title: 'Create New Trip', path: '/trips?action=create', icon: Plus, category: 'Actions' },
    { type: 'nav', id: 'nav-dest', title: 'Discover Destinations', path: '/destinations', icon: Compass, category: 'Navigation' },
    { type: 'nav', id: 'nav-notif', title: 'View Notifications & Alerts', path: '/notifications', icon: Bell, category: 'Navigation' },
    { type: 'nav', id: 'nav-profile', title: 'View Profile', path: '/profile', icon: User, category: 'Navigation' },
  ];

  const filteredNav = quickNav.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTrips = trips.filter(trip =>
    (trip.title || '').toLowerCase().includes(query.toLowerCase()) ||
    (trip.destination || '').toLowerCase().includes(query.toLowerCase())
  ).map(trip => ({
    type: 'trip',
    id: `trip-${trip.id}`,
    title: trip.title,
    subtitle: `${trip.destination} · ${trip.startDate || ''}`,
    path: `/trips/${trip.id}`,
    icon: MapPin,
    category: 'Trips'
  }));

  const filteredDestinations = destinations.filter(dest =>
    (dest.name || '').toLowerCase().includes(query.toLowerCase()) ||
    (dest.country || '').toLowerCase().includes(query.toLowerCase())
  ).map(dest => ({
    type: 'destination',
    id: `dest-${dest.id}`,
    title: dest.name,
    subtitle: dest.country,
    path: `/destinations/${dest.id}`,
    icon: Compass,
    category: 'Destinations'
  }));

  const filteredNotifications = notifications.filter(n =>
    (n.message || '').toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4).map(n => ({
    type: 'notification',
    id: `notif-${n.id}`,
    title: n.message,
    subtitle: n.notificationType || 'Alert',
    path: '/notifications',
    icon: Bell,
    category: 'Notifications'
  }));

  const allResults = [...filteredNav, ...filteredTrips, ...filteredDestinations, ...filteredNotifications];

  const handleSelect = (item) => {
    onClose();
    if (item.path) {
      navigate(item.path);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, allResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + allResults.length) % Math.max(1, allResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allResults[selectedIndex]) {
        handleSelect(allResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Command Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 light:bg-white/95 shadow-2xl backdrop-blur-xl z-10 flex flex-col max-h-[80vh]"
        >
          {/* Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-800 light:border-slate-200">
            <Search className="w-5 h-5 text-indigo-400 shrink-0 mr-3" />
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-transparent text-sm text-white light:text-slate-900 placeholder-slate-500 outline-none"
              placeholder="Type a command, trip, or destination... (e.g. Tokyo, Budget, Japan)"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="ml-2 hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-800 light:bg-slate-200 rounded border border-slate-700 light:border-slate-300">
              ESC
            </kbd>
          </div>

          {/* Search Results List */}
          <div className="overflow-y-auto p-2 space-y-4 max-h-[420px] custom-scrollbar">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading global search index...</div>
            ) : allResults.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No matching results found for "<span className="text-indigo-400">{query}</span>"
              </div>
            ) : (
              <>
                {['Actions', 'Navigation', 'Trips', 'Destinations', 'Notifications'].map((cat) => {
                  const itemsInCat = allResults.filter((r) => r.category === cat);
                  if (itemsInCat.length === 0) return null;

                  return (
                    <div key={cat}>
                      <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 light:text-slate-400">
                        {cat}
                      </p>
                      <div className="mt-1 space-y-1">
                        {itemsInCat.map((item) => {
                          const globalIdx = allResults.indexOf(item);
                          const isSelected = globalIdx === selectedIndex;
                          const Icon = item.icon;

                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSelect(item)}
                              onMouseEnter={() => setSelectedIndex(globalIdx)}
                              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-left transition ${
                                isSelected
                                  ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-600/20'
                                  : 'text-slate-300 light:text-slate-700 hover:bg-slate-800/60 light:hover:bg-slate-100'
                              }`}
                            >
                              <div className="flex items-center gap-3 truncate">
                                <div className={`p-2 rounded-lg shrink-0 ${
                                  isSelected ? 'bg-indigo-500/30 text-white' : 'bg-slate-800/80 light:bg-slate-200 text-indigo-400'
                                }`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="truncate">
                                  <p className="font-semibold text-sm truncate">{item.title}</p>
                                  {item.subtitle && (
                                    <p className={`text-[11px] truncate ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                                      {item.subtitle}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                                isSelected ? 'translate-x-1 text-white' : 'opacity-0'
                              }`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Footer Guide */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/60 light:bg-slate-100/80 border-t border-slate-800 light:border-slate-200 text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 light:bg-white text-slate-300 light:text-slate-700">↑↓</kbd> Navigate</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 light:bg-white text-slate-300 light:text-slate-700">↵</kbd> Select</span>
            </div>
            <span>Global SaaS Search</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommandPalette;
