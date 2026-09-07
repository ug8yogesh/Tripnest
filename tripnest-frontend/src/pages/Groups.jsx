import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageShell from '../components/PageShell';
import AnimatedPage from '../components/AnimatedPage';
import { groupApi } from '../utils/groupApi';
import { useAuth } from '../context/AuthContext';
import SkeletonCard from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import MorphTransition from '../components/MorphTransition';
import toast from 'react-hot-toast';
import { 
  Users, 
  MessageSquare, 
  Send, 
  UserPlus, 
  Shield, 
  Trash2, 
  ArrowLeft, 
  CreditCard,
  CheckCheck
} from 'lucide-react';

const Groups = () => {
  const { tripId } = useParams();
  const { user: currentUser } = useAuth();
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [settlement, setSettlement] = useState({});
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const chatBottomRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const result = await groupApi.list();
      const matching = (result.data || []).filter((item) => String(item.tripId) === String(tripId));
      setGroups(result.data || []);
      if (matching[0]) {
        const [groupRes, msgRes, setRes] = await Promise.all([
          groupApi.get(matching[0].id),
          groupApi.messages(matching[0].id),
          groupApi.settlement(matching[0].id)
        ]);
        setGroup(groupRes.data);
        setMessages(msgRes.data || []);
        setSettlement(setRes.data || {});
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load group information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [tripId]);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, sending, isTyping]);

  const create = async (event) => {
    event.preventDefault();
    try {
      const res = await groupApi.create({ name, tripId: Number(tripId) });
      setGroup(res.data);
      setName('');
      toast.success('Group room created');
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to create group.';
      setError(msg);
      toast.error(msg);
    }
  };

  const invite = async (event) => {
    event.preventDefault();
    try {
      const res = await groupApi.invite(group.id, email);
      setGroup(res.data);
      setEmail('');
      toast.success(`Invite sent to ${email}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to invite member.';
      setError(msg);
      toast.error(msg);
    }
  };

  const removeMember = async (member) => {
    try {
      await groupApi.removeMember(group.id, member.userId);
      setGroup((current) => ({
        ...current,
        members: current.members.filter((item) => item.userId !== member.userId)
      }));
      toast.success('Member removed');
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to remove member.';
      setError(msg);
      toast.error(msg);
    }
  };

  // OPTIMISTIC CHAT SENDING WITH ROLLBACK
  const send = async (event) => {
    event.preventDefault();
    if (!message.trim() || sending) return;

    const msgText = message;
    setMessage('');
    setSending(true);

    const tempId = `temp-msg-${Date.now()}`;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const optimisticMsg = {
      id: tempId,
      content: msgText,
      senderName: currentUser?.email?.split('@')[0] || 'You',
      senderEmail: currentUser?.email,
      timestamp: nowStr,
      isPending: true,
    };

    // Append optimistically
    const previousMessages = [...messages];
    setMessages((current) => [...current, optimisticMsg]);

    try {
      const result = await groupApi.sendMessage(group.id, msgText);
      setMessages((current) =>
        current.map((m) => (m.id === tempId ? { ...result.data, isPending: false } : m))
      );
    } catch (err) {
      // Rollback optimistic message
      setMessages(previousMessages);
      const msg = err.response?.data?.message || 'Unable to send message. Reverted.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (e.target.value.length > 0 && !isTyping) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    }
  };

  const isAdmin = group?.members?.some(
    (member) => member.groupRole === 'GROUP_ADMIN' && member.userId === group.createdById
  );

  return (
    <AnimatedPage>
      <PageShell
        title="Group Collaboration & Chat"
        subtitle="Co-plan itineraries, chat in real time, and balance shared expenses seamlessly."
        action={
          <Link className="secondary-button text-xs flex items-center gap-1.5" to={`/trips/${tripId}`}>
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Trip Details</span>
          </Link>
        }
      >
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-xs text-rose-400 hover:text-white">Dismiss</button>
          </div>
        )}

        <MorphTransition
          loading={loading}
          skeleton={
            <div className="grid gap-6 lg:grid-cols-2">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          }
        >
          {!group ? (
            <section className="glass-card max-w-xl mx-auto p-8 text-center border-indigo-500/30">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-4 shadow-glow-indigo">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-white light:text-slate-900 mb-2">Create a Group Room</h2>
              <p className="text-xs text-slate-400 light:text-slate-600 mb-6">
                Start a collaboration group for this trip to invite friends, chat live, and split expenses.
              </p>

              <form onSubmit={create} className="flex flex-col sm:flex-row gap-3">
                <input
                  className="flex-1 rounded-xl bg-slate-950 light:bg-slate-100 border border-slate-800 light:border-slate-300 px-4 py-3 text-sm text-white light:text-slate-900 outline-none focus:border-indigo-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Summer Crew 2026"
                  required
                />
                <button className="primary-button text-sm px-6 py-3" type="submit">
                  Create Group
                </button>
              </form>
            </section>
          ) : (
            <div className="grid gap-8 lg:grid-cols-12 items-start">
              {/* Left Column: Group Members & Settlement */}
              <section className="lg:col-span-5 space-y-6">
                {/* Members Card */}
                <div className="glass-card p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800 light:border-slate-200">
                    <div>
                      <h2 className="text-xl font-bold text-white light:text-slate-900">{group.name}</h2>
                      <p className="text-xs text-slate-400 light:text-slate-500 mt-0.5">{group.members?.length || 0} Members Enrolled</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      Active Room
                    </span>
                  </div>

                  {/* Members List */}
                  <div className="space-y-3 mb-6">
                    {group.members?.map((member) => {
                      const isOwner = member.groupRole === 'GROUP_ADMIN' || member.userId === group.createdById;
                      const initial = (member.name || member.email || 'M').charAt(0).toUpperCase();

                      return (
                        <div
                          key={member.userId}
                          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 light:bg-slate-100/80 border border-slate-800/80 light:border-slate-200/80"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-sm ring-2 ring-indigo-500/20">
                              {initial}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white light:text-slate-900 max-w-[160px] truncate">
                                {member.name || member.email}
                              </p>
                              <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                                isOwner 
                                  ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
                                  : 'bg-slate-800 light:bg-slate-200 text-slate-400 light:text-slate-600 border-slate-700 light:border-slate-300'
                              }`}>
                                {isOwner ? <Shield className="w-2.5 h-2.5" /> : null}
                                <span>{member.groupRole || 'MEMBER'}</span>
                              </span>
                            </div>
                          </div>

                          {isAdmin && member.userId !== group.createdById && (
                            <button
                              onClick={() => removeMember(member)}
                              className="p-1.5 rounded-lg border border-slate-800 light:border-slate-200 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                              title="Remove member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Invite Member Form */}
                  <form onSubmit={invite} className="pt-4 border-t border-slate-800 light:border-slate-200">
                    <label className="text-xs font-semibold text-slate-400 light:text-slate-600 uppercase tracking-wider mb-2 block">
                      Invite Co-Traveler
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        className="flex-1 rounded-xl bg-slate-950 light:bg-slate-100 border border-slate-800 light:border-slate-300 px-3.5 py-2.5 text-xs text-white light:text-slate-900 placeholder-slate-500 outline-none focus:border-indigo-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="friend@example.com"
                        required
                      />
                      <button className="primary-button text-xs px-4 py-2.5 flex items-center gap-1 shrink-0" type="submit">
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Invite</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Expense Settlement Summary Card */}
                <div className="glass-card p-6">
                  <h3 className="text-base font-bold text-white light:text-slate-900 mb-4 pb-3 border-b border-slate-800 light:border-slate-200 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-cyan-400" />
                    <span>Expense Balances & Settlement</span>
                  </h3>

                  {Object.keys(settlement).length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">No balances to settle yet.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {Object.entries(settlement).map(([person, amount]) => (
                        <div
                          key={person}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 light:bg-slate-100 border border-slate-800 light:border-slate-200 text-xs"
                        >
                          <span className="font-semibold text-slate-200 light:text-slate-800">{person}</span>
                          <span className={`font-bold px-2.5 py-1 rounded-full text-[11px] border ${
                            amount >= 0 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {amount >= 0 ? `Receives $${amount}` : `Owes $${Math.abs(amount)}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Right Column: Real Chat Interface */}
              <section className="lg:col-span-7 glass-card p-6 flex flex-col justify-between h-[650px] border-slate-800/90 light:border-slate-200">
                {/* Chat Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 light:border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white light:text-slate-900 text-base">{group.name} Chat</h3>
                      <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Real-time connected</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Messages Feed */}
                <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-2 custom-scrollbar">
                  {messages.length === 0 ? (
                    <EmptyState
                      icon={MessageSquare}
                      title="No messages yet"
                      description="Be the first to post a message or share an itinerary idea in this group."
                    />
                  ) : (
                    <AnimatePresence initial={false}>
                      {messages.map((item, idx) => {
                        const isMe = 
                          item.senderEmail === currentUser?.email || 
                          item.senderName === currentUser?.name ||
                          item.senderName === currentUser?.email ||
                          item.senderName === currentUser?.email?.split('@')[0];

                        // Decorative UI read receipt: mark messages as "Seen by group members"
                        const isLastMessage = idx === messages.length - 1;

                        return (
                          <motion.div
                            key={item.id || item.timestamp || idx}
                            initial={{ opacity: 0, y: 12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[11px] font-semibold text-slate-400 light:text-slate-600">
                                {isMe ? 'You' : (item.senderName || 'Member')}
                              </span>
                              {item.timestamp && (
                                <span className="text-[9px] text-slate-600 light:text-slate-400">{item.timestamp}</span>
                              )}
                            </div>

                            <div
                              className={`p-3.5 max-w-[82%] text-xs leading-relaxed transition-all shadow-md ${
                                isMe
                                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl rounded-tr-none shadow-indigo-600/20'
                                  : 'bg-slate-900 light:bg-slate-100 border border-slate-800 light:border-slate-200 text-slate-100 light:text-slate-900 rounded-2xl rounded-tl-none'
                              }`}
                            >
                              {item.content}
                            </div>

                            {/* DECORATIVE READ RECEIPT UI INDICATOR FOR SENDER */}
                            {isMe && (
                              <div className="flex items-center gap-1 mt-1 text-[10px] text-indigo-400/80 light:text-indigo-600/80">
                                <CheckCheck className="w-3 h-3" />
                                <span>{isLastMessage ? 'Seen by group' : 'Delivered'}</span>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}

                  {/* DECORATIVE TYPING INDICATOR UI AREA */}
                  {(sending || isTyping) && (
                    <div className="flex items-center gap-2 text-xs text-indigo-400 italic py-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                      <span>Someone is typing a response...</span>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                {/* Chat Message Input Bar */}
                <form onSubmit={send} className="flex gap-2 pt-3 border-t border-slate-800 light:border-slate-200">
                  <input
                    className="flex-1 rounded-xl bg-slate-950 light:bg-slate-100 border border-slate-800 light:border-slate-300 px-4 py-3 text-xs text-white light:text-slate-900 placeholder-slate-500 outline-none focus:border-indigo-500"
                    value={message}
                    onChange={handleInputChange}
                    placeholder="Type a message... (Live UI feedback)"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={sending || !message.trim()}
                    className="primary-button px-5 py-3 text-xs flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </section>
            </div>
          )}
        </MorphTransition>
      </PageShell>
    </AnimatedPage>
  );
};

export default Groups;
