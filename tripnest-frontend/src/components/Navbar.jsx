import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { notificationApi } from '../utils/notificationApi';
import CommandPalette from './CommandPalette';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { 
  Compass, 
  LayoutDashboard, 
  MapPin, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Shield, 
  Plane,
  Sun,
  Moon,
  Search,
  Keyboard
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isScroll, setIsScroll] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const location = useLocation();

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  useKeyboardShortcuts({
    onToggleCommandPalette: () => setIsCommandOpen((prev) => !prev),
    onToggleHelpModal: () => setIsShortcutsOpen((prev) => !prev),
    onEscape: () => {
      setIsCommandOpen(false);
      setIsShortcutsOpen(false);
      setIsMenuOpen(false);
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScroll(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!user) return;
    notificationApi.list()
      .then(({ data }) => setUnread(data.filter((item) => !item.isRead).length))
      .catch(() => setUnread(0));
  }, [user, location.pathname]);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Trips', path: '/trips', icon: MapPin },
    { label: 'Discover', path: '/destinations', icon: Compass },
    { label: 'Alerts', path: '/notifications', icon: Bell, badge: unread },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  if (user && (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN')) {
    navItems.push({ label: 'Admin', path: '/admin/destinations', icon: Shield });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ${
          isScroll
            ? 'bg-slate-950/85 light:bg-white/85 backdrop-blur-xl border-b border-slate-800/80 light:border-slate-200/80 shadow-2xl py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center gap-2.5 group text-xl font-bold tracking-tight text-white light:text-slate-900"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <Plane className="w-5 h-5 text-white transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </div>
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 light:from-slate-900 light:via-slate-800 light:to-slate-600 bg-clip-text text-transparent">
              Trip<span className="text-indigo-500 font-extrabold">Nest</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <ul className="flex items-center gap-1 rounded-full bg-slate-900/70 light:bg-white/90 border border-slate-800/80 light:border-slate-200 px-3 py-1.5 backdrop-blur-md shadow-inner">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`relative flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                          active
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 hover:bg-slate-800/60 light:hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                        {item.badge > 0 && (
                          <span className="flex items-center justify-center min-w-[18px] h-4 text-[10px] font-bold rounded-full bg-rose-500 text-white px-1 shadow-sm animate-pulse">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Command Palette Trigger Button */}
              <button
                onClick={() => setIsCommandOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 light:text-slate-600 bg-slate-900/70 light:bg-white/90 border border-slate-800 light:border-slate-200 rounded-full hover:border-indigo-500/50 hover:text-indigo-400 transition shadow-sm"
                title="Search Command Palette (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden lg:inline text-[11px]">Search...</span>
                <kbd className="px-1.5 py-0.5 text-[10px] font-extrabold bg-slate-800 light:bg-slate-100 text-slate-300 light:text-slate-700 rounded border border-slate-700 light:border-slate-300">
                  Ctrl+K
                </kbd>
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="secondary-button text-sm py-2 px-4">
                Sign In
              </Link>
              <Link to="/register" className="primary-button text-sm py-2 px-4">
                Get Started
              </Link>
            </div>
          )}

          {/* Right Action Icons & User Info */}
          <div className="flex items-center gap-2.5">
            {/* Keyboard Shortcuts Help Button */}
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="p-2 rounded-xl text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-slate-800/60 light:hover:bg-slate-100 transition"
              title="Keyboard Shortcuts (?)"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 light:text-amber-500 hover:text-white light:hover:text-amber-600 hover:bg-slate-800/60 light:hover:bg-slate-100 transition transform hover:rotate-12 duration-200"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {user ? (
              <div className="hidden lg:flex items-center gap-3 pl-2 border-l border-slate-800 light:border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-indigo-500/20">
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-medium text-slate-200 light:text-slate-800 max-w-[130px] truncate">
                      {user.email}
                    </span>
                    <span className="text-[9px] font-semibold text-indigo-400 light:text-indigo-600 uppercase tracking-wider">
                      {user.role || 'EXPLORER'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition duration-200 ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : null}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={openMenu}
              className="md:hidden p-2 rounded-xl text-slate-300 light:text-slate-700 hover:text-white light:hover:text-slate-900 hover:bg-slate-800 light:hover:bg-slate-100 transition"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md md:hidden transition-opacity"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Side Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-slate-900 light:bg-white border-l border-slate-800 light:border-slate-200 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-slate-800 light:border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Plane className="w-4 h-4" />
              </div>
              <span className="font-bold text-white light:text-slate-900">TripNest</span>
            </div>
            <button
              onClick={closeMenu}
              className="p-2 rounded-lg text-slate-400 hover:text-white light:hover:text-slate-900 hover:bg-slate-800 light:hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {user ? (
            <ul className="mt-6 flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={closeMenu}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition ${
                        active
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                          : 'text-slate-300 light:text-slate-700 hover:bg-slate-800 light:hover:bg-slate-100 hover:text-white light:hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge > 0 && (
                        <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-8 flex flex-col gap-3">
              <Link
                to="/login"
                onClick={closeMenu}
                className="secondary-button text-center w-full"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="primary-button text-center w-full"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {user && (
          <div className="pt-6 border-t border-slate-800 light:border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white">
                {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white light:text-slate-900 truncate">{user.email}</p>
                <span className="text-xs text-indigo-400 light:text-indigo-600 uppercase font-semibold">{user.role}</span>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                closeMenu();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-medium text-sm transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>

      {/* Global Modals */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
      <KeyboardShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
    </>
  );
};

export default Navbar;