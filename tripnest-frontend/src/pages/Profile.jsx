import { useEffect, useState } from 'react';
import PageShell from '../components/PageShell';
import AnimatedPage from '../components/AnimatedPage';
import { destinationApi } from '../utils/destinationApi';
import { profileApi } from '../utils/profileApi';
import { User, Mail, Shield, Check, Heart } from 'lucide-react';
import SkeletonCard from '../components/Skeleton';
import toast from 'react-hot-toast';

const emptyForm = { name: '', bio: '', travelPreferences: '', profileImageUrl: '', favoriteDestinationIds: [] };

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([profileApi.get(), destinationApi.list()])
      .then(([profileResult, destinationResult]) => {
        setProfile(profileResult.data);
        setDestinations(destinationResult.data || []);
        setForm({ ...emptyForm, ...profileResult.data, favoriteDestinationIds: profileResult.data.favoriteDestinationIds || [] });
      })
      .catch((err) => setError(err.response?.data?.message || 'Unable to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const updateFavorites = (event) => {
    const ids = Array.from(event.target.selectedOptions, (option) => Number(option.value));
    setForm((current) => ({ ...current, favoriteDestinationIds: ids }));
  };

  const save = async (event) => {
    event.preventDefault();
    try {
      const result = await profileApi.update({
        name: form.name,
        bio: form.bio,
        travelPreferences: form.travelPreferences,
        profileImageUrl: form.profileImageUrl,
        favoriteDestinationIds: form.favoriteDestinationIds,
      });
      setProfile(result.data);
      setForm((current) => ({ ...current, favoriteDestinationIds: result.data.favoriteDestinationIds || [] }));
      toast.success('Explorer profile saved!');
      setError('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to save profile.';
      setError(msg);
      toast.error(msg);
    }
  };

  const initial = (profile?.name || profile?.email || 'U').charAt(0).toUpperCase();

  return (
    <AnimatedPage>
      <PageShell
        title="User Workspace Profile"
        subtitle="Manage your explorer identity, bio, and favorite travel destinations."
      >
      {error && (
        <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Avatar & Profile Card */}
          {profile && (
            <aside className="lg:col-span-4 glass-card p-6 text-center h-fit">
              <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-1 shadow-glow-indigo mb-4">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-black text-3xl text-white overflow-hidden">
                  {profile.profileImageUrl ? (
                    <img src={profile.profileImageUrl} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{initial}</span>
                  )}
                </div>
              </div>

              <h2 className="text-xl font-bold text-white">{profile.name}</h2>
              <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>{profile.email}</span>
              </p>

              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>{profile.role || 'EXPLORER'}</span>
              </div>

              {profile.bio && (
                <p className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-300 leading-relaxed text-left">
                  {profile.bio}
                </p>
              )}
            </aside>
          )}

          {/* Right Column: Edit Profile Form */}
          <form className="lg:col-span-8 glass-card p-6 sm:p-8 space-y-5" onSubmit={save}>
            <h2 className="text-xl font-bold text-white mb-6 pb-3 border-b border-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" />
              <span>Edit Explorer Identity</span>
            </h2>

            <div className="field">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Full Name</label>
              <input
                value={form.name || ''}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Your full name"
              />
            </div>

            <div className="field">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Bio & Travel Summary</label>
              <textarea
                rows="3"
                value={form.bio || ''}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Passionate adventurer, backpacker, foodie..."
              />
            </div>

            <div className="field">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Travel Preferences</label>
              <textarea
                rows="2"
                value={form.travelPreferences || ''}
                onChange={(e) => setForm({ ...form, travelPreferences: e.target.value })}
                placeholder="Luxury resorts, hiking trails, street food..."
              />
            </div>

            <div className="field">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Profile Avatar Image URL</label>
              <input
                value={form.profileImageUrl || ''}
                onChange={(e) => setForm({ ...form, profileImageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="field">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Favorite Destinations</span>
              </label>
              <select
                multiple
                value={(form.favoriteDestinationIds || []).map(String)}
                onChange={updateFavorites}
                className="min-h-36 rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id} className="py-1">
                    {d.name}, {d.country}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-500">Hold Ctrl/Cmd to select multiple destinations.</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button className="primary-button py-3 px-6 text-sm flex items-center gap-2" type="submit">
                <Check className="w-4 h-4" />
                <span>Save Profile Settings</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </PageShell>
  </AnimatedPage>
  );
};

export default Profile;

