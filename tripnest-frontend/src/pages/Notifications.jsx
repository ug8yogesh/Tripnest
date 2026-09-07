import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageShell from '../components/PageShell';
import AnimatedPage from '../components/AnimatedPage';
import { notificationApi } from '../utils/notificationApi';
import SkeletonRow from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import MorphTransition from '../components/MorphTransition';
import toast from 'react-hot-toast';
import { 
  Bell, 
  AlertTriangle, 
  UserPlus, 
  Check, 
  CheckCheck, 
  Calendar, 
  Wallet 
} from 'lucide-react';

const NOTIF_CONFIG = {
  BUDGET_ALERT: { icon: AlertTriangle, label: 'Budget Alert', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  BUDGET: { icon: Wallet, label: 'Budget Update', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  GROUP_INVITE: { icon: UserPlus, label: 'Group Invitation', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  INVITATION: { icon: UserPlus, label: 'Invitation', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  TRIP_UPDATE: { icon: Calendar, label: 'Trip Update', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  DEFAULT: { icon: Bell, label: 'System Notice', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
};

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await notificationApi.list();
      setItems(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // OPTIMISTIC MARK-AS-READ WITH FULL ROLLBACK
  const markRead = async (id) => {
    // Save previous state for rollback on error
    const previousItems = [...items];

    // Optimistic UI state update (instantly update card & restore/decrement unread badge)
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );

    try {
      const result = await notificationApi.markRead(id);
      setItems((current) =>
        current.map((item) => (item.id === id ? result.data : item))
      );
      toast.success('Marked as read');
    } catch (err) {
      // Revert optimistic update back to unread and restore badge count
      setItems(previousItems);
      const msg = err.response?.data?.message || 'Unable to mark notification. Reverted to unread.';
      setError(msg);
      toast.error(msg);
    }
  };

  const unreadCount = items.filter((i) => !i.isRead).length;

  return (
    <AnimatedPage>
      <PageShell
        title="Alerts & Notifications"
        subtitle="A central inbox for trip reminders, group invites, and real-time budget updates."
        action={
          unreadCount > 0 ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-glow-indigo animate-pulse">
              <Bell className="w-3.5 h-3.5 animate-pulse text-rose-400" />
              <span>{unreadCount} Unread Alert{unreadCount !== 1 ? 's' : ''}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-900 light:bg-slate-100 text-slate-400 light:text-slate-600 border border-slate-800 light:border-slate-200">
              <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>All Caught Up</span>
            </span>
          )
        }
      >
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-xs text-rose-400 hover:text-white">Dismiss</button>
          </div>
        )}

        <div className="glass-card p-6 sm:p-8">
          <MorphTransition
            loading={loading}
            skeleton={
              <div className="space-y-4">
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </div>
            }
          >
            {items.length === 0 ? (
              <EmptyState
                icon={Bell}
                title="Your inbox is empty"
                description="You don't have any pending notifications or budget alerts right now."
              />
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {items.map((item) => {
                    const config = NOTIF_CONFIG[item.notificationType] || NOTIF_CONFIG.DEFAULT;
                    const Icon = config.icon;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 8, scale: item.isRead ? 1 : 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition duration-200 ${
                          item.isRead
                            ? 'bg-slate-950/40 light:bg-slate-50 border-slate-800/60 light:border-slate-200 opacity-80'
                            : 'bg-indigo-950/30 light:bg-indigo-50/50 border-indigo-500/40 border-l-4 border-l-cyan-400 shadow-md ring-1 ring-cyan-500/20'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${config.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${config.color}`}>
                                {config.label}
                              </span>
                              {!item.isRead && (
                                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-glow-cyan animate-pulse ring-4 ring-cyan-500/20" />
                              )}
                            </div>

                            <p className="text-sm font-bold text-white light:text-slate-900 leading-snug">
                              {item.message}
                            </p>

                            {item.createdAt && (
                              <p className="text-[10px] text-slate-500 light:text-slate-400 mt-1">
                                {item.createdAt}
                              </p>
                            )}
                          </div>
                        </div>

                        {!item.isRead ? (
                          <button
                            onClick={() => markRead(item.id)}
                            className="self-end sm:self-center primary-button text-xs py-2 px-3 flex items-center gap-1.5 shrink-0"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Read</span>
                          </button>
                        ) : (
                          <span className="self-end sm:self-center text-xs text-slate-500 light:text-slate-600 font-medium px-3 py-1 rounded-lg bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-200">
                            Read
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </MorphTransition>
        </div>
      </PageShell>
    </AnimatedPage>
  );
};

export default Notifications;
