import { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Link, useParams } from 'react-router-dom';
import PageShell from '../components/PageShell';
import AnimatedPage from '../components/AnimatedPage';
import { budgetApi } from '../utils/budgetApi';
import SkeletonCard from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import MorphTransition from '../components/MorphTransition';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { 
  Wallet, 
  Navigation, 
  Hotel, 
  Utensils, 
  ShoppingBag, 
  Film, 
  CreditCard, 
  Plus, 
  Trash2, 
  Edit2, 
  ArrowLeft, 
  Check, 
  PieChart,
  Sliders,
  Sparkles,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const categories = ['TRANSPORTATION', 'HOTEL', 'FOOD', 'SHOPPING', 'ENTERTAINMENT', 'MISCELLANEOUS'];

const CATEGORY_CONFIG = {
  TRANSPORTATION: { icon: Navigation, label: 'Transportation', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  HOTEL: { icon: Hotel, label: 'Hotel & Stay', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  FOOD: { icon: Utensils, label: 'Food & Dining', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  SHOPPING: { icon: ShoppingBag, label: 'Shopping', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  ENTERTAINMENT: { icon: Film, label: 'Entertainment', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  MISCELLANEOUS: { icon: CreditCard, label: 'Misc & Extra', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
};

const emptyExpense = { description: '', amount: '', category: 'FOOD', expenseDate: '' };

const Budget = () => {
  const { tripId } = useParams();
  const { theme } = useTheme();
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});
  const [form, setForm] = useState(emptyExpense);
  const [budgetForm, setBudgetForm] = useState({ 
    totalAmount: '', currency: 'USD', transportationBudget: '', hotelBudget: '', foodBudget: '', shoppingBudget: '', miscBudget: '' 
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Interactivity features: Linked hover & What-If simulator
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [whatIfMultiplier, setWhatIfMultiplier] = useState(100);

  const load = async () => {
    setLoading(true);
    try {
      const results = await Promise.all([
        budgetApi.get(tripId).catch(() => ({ data: null })),
        budgetApi.expenses(tripId),
        budgetApi.summary(tripId)
      ]);
      setBudget(results[0].data);
      setExpenses(results[1].data || []);
      setSummary(results[2].data || {});
      if (results[0].data) setBudgetForm(results[0].data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load budget.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [tripId]);

  const saveBudget = async (event) => {
    event.preventDefault();
    try {
      const result = await budgetApi.save(tripId, Object.fromEntries(
        Object.entries(budgetForm).map(([key, value]) => [key, key === 'currency' ? value : value === '' ? null : Number(value)])
      ));
      setBudget(result.data);
      toast.success('Target budget saved');
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to save budget.';
      setError(msg);
      toast.error(msg);
    }
  };

  // OPTIMISTIC EXPENSE ADD / UPDATE
  const saveExpense = async (event) => {
    event.preventDefault();
    const payload = { ...form, amount: Number(form.amount) };
    
    // Store previous state for rollback
    const previousExpenses = [...expenses];
    const previousSummary = { ...summary };
    const tempId = `temp-${Date.now()}`;
    const optimisticItem = editingId
      ? { ...payload, id: editingId }
      : { ...payload, id: tempId, expenseDate: payload.expenseDate || new Date().toISOString().split('T')[0] };

    // Optimistic UI update
    setExpenses((current) =>
      editingId ? current.map((e) => (e.id === editingId ? optimisticItem : e)) : [optimisticItem, ...current]
    );

    // Optimistically update summary
    const cat = payload.category;
    setSummary((prev) => ({
      ...prev,
      [cat]: (prev[cat] || 0) + (editingId ? 0 : payload.amount)
    }));

    setForm(emptyExpense);
    setEditingId(null);

    try {
      const result = editingId
        ? await budgetApi.updateExpense(tripId, editingId, payload)
        : await budgetApi.addExpense(tripId, payload);

      setExpenses((current) =>
        current.map((e) => (e.id === tempId || e.id === editingId ? result.data : e))
      );
      toast.success(editingId ? 'Expense updated' : 'Expense recorded');
      
      const summaryResult = await budgetApi.summary(tripId);
      setSummary(summaryResult.data || {});
    } catch (err) {
      // Rollback optimistic state
      setExpenses(previousExpenses);
      setSummary(previousSummary);
      const msg = err.response?.data?.message || 'Unable to save expense. Reverted changes.';
      setError(msg);
      toast.error(msg);
    }
  };

  // OPTIMISTIC EXPENSE REMOVE
  const removeExpense = async (id) => {
    const previousExpenses = [...expenses];
    const previousSummary = { ...summary };
    const targetItem = expenses.find((e) => e.id === id);

    // Optimistic removal
    setExpenses((current) => current.filter((e) => e.id !== id));
    if (targetItem) {
      setSummary((prev) => ({
        ...prev,
        [targetItem.category]: Math.max(0, (prev[targetItem.category] || 0) - targetItem.amount)
      }));
    }

    try {
      await budgetApi.removeExpense(tripId, id);
      toast.success('Expense deleted');
      const summaryResult = await budgetApi.summary(tripId);
      setSummary(summaryResult.data || {});
    } catch (err) {
      // Rollback
      setExpenses(previousExpenses);
      setSummary(previousSummary);
      const msg = err.response?.data?.message || 'Unable to remove expense. Reverted changes.';
      setError(msg);
      toast.error(msg);
    }
  };

  // What-If Simulator Calculations
  const originalTarget = budget?.totalAmount || 0;
  const simulatedTarget = (originalTarget * whatIfMultiplier) / 100;
  const currentSpent = budget?.totalSpent || expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const simulatedRemaining = simulatedTarget - currentSpent;

  // Chart Theme colors
  const isLight = theme === 'light';
  const textColor = isLight ? '#334155' : '#94a3b8';
  const gridColor = isLight ? '#e2e8f0' : '#1e293b';

  const chartLabels = Object.keys(summary);
  const chartValues = Object.values(summary);

  const doughnutData = {
    labels: chartLabels.map(c => CATEGORY_CONFIG[c]?.label || c),
    datasets: [{
      data: chartValues,
      backgroundColor: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e'],
      borderColor: isLight ? '#ffffff' : '#131b2e',
      borderWidth: 3,
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onHover: (event, chartElement) => {
      if (chartElement.length > 0) {
        const index = chartElement[0].index;
        setHoveredCategory(chartLabels[index]);
      } else {
        setHoveredCategory(null);
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
          font: { family: 'sans-serif', size: 11 },
          padding: 12,
        }
      },
      tooltip: {
        backgroundColor: isLight ? '#ffffff' : '#1e293b',
        titleColor: isLight ? '#0f172a' : '#f8fafc',
        bodyColor: isLight ? '#334155' : '#cbd5e1',
        borderColor: isLight ? '#cbd5e1' : '#334155',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      }
    }
  };

  const barData = {
    labels: ['Target Budget', 'Simulated', 'Actual Spent'],
    datasets: [{
      label: budget?.currency || 'USD',
      data: [originalTarget, simulatedTarget, currentSpent],
      backgroundColor: ['#6366f1', '#06b6d4', currentSpent > simulatedTarget ? '#f43f5e' : '#10b981'],
      borderRadius: 8,
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isLight ? '#ffffff' : '#1e293b',
        titleColor: isLight ? '#0f172a' : '#f8fafc',
        bodyColor: isLight ? '#334155' : '#cbd5e1',
        borderColor: isLight ? '#cbd5e1' : '#334155',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      x: { ticks: { color: textColor }, grid: { display: false } },
      y: { ticks: { color: textColor }, grid: { color: gridColor } }
    }
  };

  return (
    <AnimatedPage>
      <PageShell
        title="Budget & Expense Tracker"
        subtitle="Monitor trip spending, category allocations, receipts, and interactive budget scenarios."
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
          <>
            {/* WHAT-IF INTERACTIVE BUDGET SIMULATOR BANNER */}
            <div className="glass-card p-6 mb-8 border-indigo-500/40 shadow-glow-indigo">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 light:border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white light:text-slate-900 flex items-center gap-2">
                      <span>Interactive "What-If" Budget Scenario Simulator</span>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </h3>
                    <p className="text-xs text-slate-400 light:text-slate-600">
                      Drag the slider to test budget scaling and see real-time projected balances.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-950/60 light:bg-slate-100 px-4 py-2 rounded-xl border border-slate-800 light:border-slate-200">
                  <span className="text-xs text-slate-400 light:text-slate-600 font-semibold">Scale:</span>
                  <span className="text-sm font-black text-indigo-400 light:text-indigo-600">{whatIfMultiplier}%</span>
                </div>
              </div>

              <div className="mt-4 grid gap-6 md:grid-cols-12 items-center">
                <div className="md:col-span-6 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-300 light:text-slate-700">
                    <span>Tight Budget (50%)</span>
                    <span>Baseline (100%)</span>
                    <span>Expanded (200%)</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    step="5"
                    value={whatIfMultiplier}
                    onChange={(e) => setWhatIfMultiplier(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 light:bg-slate-200 rounded-lg"
                  />
                </div>

                <div className="md:col-span-6 grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 light:bg-slate-100 border border-slate-800 light:border-slate-200">
                    <p className="text-[11px] font-semibold text-slate-400 light:text-slate-600">Simulated Target</p>
                    <p className="text-lg font-black text-white light:text-slate-900">${simulatedTarget.toLocaleString()}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/60 light:bg-slate-100 border border-slate-800 light:border-slate-200">
                    <p className="text-[11px] font-semibold text-slate-400 light:text-slate-600">Projected Remaining</p>
                    <p className={`text-lg font-black ${simulatedRemaining < 0 ? 'text-rose-500' : 'text-emerald-400'}`}>
                      ${simulatedRemaining.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 mb-8">
              {/* TRIP BUDGET CONFIGURATION */}
              <section className="glass-card p-6 sm:p-8">
                <h2 className="text-xl font-bold text-white light:text-slate-900 mb-6 pb-3 border-b border-slate-800 light:border-slate-200 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-indigo-400" />
                  <span>Target Budget Allocations</span>
                </h2>

                <form onSubmit={saveBudget} className="grid gap-4 sm:grid-cols-2">
                  <label className="field">
                    <span className="text-xs uppercase text-slate-400 light:text-slate-600 font-semibold">Total Target</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={budgetForm.totalAmount || ''}
                      onChange={(e) => setBudgetForm({ ...budgetForm, totalAmount: e.target.value })}
                      required
                      placeholder="3000"
                    />
                  </label>

                  <label className="field">
                    <span className="text-xs uppercase text-slate-400 light:text-slate-600 font-semibold">Currency</span>
                    <input
                      value={budgetForm.currency || 'USD'}
                      onChange={(e) => setBudgetForm({ ...budgetForm, currency: e.target.value })}
                      required
                      placeholder="USD"
                    />
                  </label>

                  {['transportationBudget', 'hotelBudget', 'foodBudget', 'shoppingBudget', 'miscBudget'].map((key) => (
                    <label className="field" key={key}>
                      <span className="text-xs uppercase text-slate-400 light:text-slate-600 font-semibold">
                        {key.replace('Budget', '')}
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={budgetForm[key] || ''}
                        onChange={(e) => setBudgetForm({ ...budgetForm, [key]: e.target.value })}
                        placeholder="0.00"
                      />
                    </label>
                  ))}

                  <button className="primary-button sm:col-span-2 py-3 text-sm flex items-center justify-center gap-2" type="submit">
                    <Check className="w-4 h-4" />
                    <span>Save Target Budget</span>
                  </button>
                </form>
              </section>

              {/* SPENDING SNAPSHOT (CHART.JS WITH LINKED HOVER) */}
              <section className="glass-card p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800 light:border-slate-200">
                    <h2 className="text-xl font-bold text-white light:text-slate-900 flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-cyan-400" />
                      <span>Category Breakdown</span>
                    </h2>
                    {hoveredCategory && (
                      <span className="text-xs font-bold text-indigo-400 light:text-indigo-600 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20 animate-pulse">
                        Filtering: {CATEGORY_CONFIG[hoveredCategory]?.label || hoveredCategory}
                      </span>
                    )}
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 items-center">
                    <div className="h-56 relative flex items-center justify-center">
                      {chartLabels.length > 0 ? (
                        <Doughnut data={doughnutData} options={doughnutOptions} />
                      ) : (
                        <p className="text-center text-xs text-slate-500">No expenses recorded yet.</p>
                      )}
                    </div>

                    <div className="h-56 relative flex items-center justify-center">
                      <Bar data={barData} options={barOptions} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800/80 light:border-slate-200 text-xs text-slate-400 light:text-slate-600 flex items-center justify-between">
                  <span>Hover chart segments to filter expense ledger below</span>
                  <span className="text-indigo-400 font-medium">Live Linked State</span>
                </div>
              </section>
            </div>

            {/* EXPENSE FORM & LEDGER */}
            <section className="grid gap-8 lg:grid-cols-12 items-start">
              {/* Left: Add/Edit Expense Form */}
              <div className="lg:col-span-5 glass-card p-6 sm:p-8">
                <h2 className="text-xl font-bold text-white light:text-slate-900 mb-6 pb-3 border-b border-slate-800 light:border-slate-200 flex items-center gap-2">
                  {editingId ? <Edit2 className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
                  <span>{editingId ? 'Edit Expense Record' : 'Record New Expense'}</span>
                </h2>

                <form onSubmit={saveExpense} className="space-y-4">
                  <div className="field">
                    <label className="text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider">Description</label>
                    <input
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      required
                      placeholder="e.g. Dinner at Shibuya izakaya"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="field">
                      <label className="text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider">Amount ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        required
                        placeholder="45.00"
                      />
                    </div>

                    <div className="field">
                      <label className="text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider">Category</label>
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {CATEGORY_CONFIG[category]?.label || category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="field">
                    <label className="text-xs font-semibold text-slate-300 light:text-slate-700 uppercase tracking-wider">Date</label>
                    <input
                      type="date"
                      value={form.expenseDate}
                      onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button className="primary-button flex-1 py-3 text-sm flex items-center justify-center gap-2" type="submit">
                      <Check className="w-4 h-4" />
                      <span>{editingId ? 'Update Expense' : 'Add Expense (Optimistic)'}</span>
                    </button>
                    {editingId && (
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => { setEditingId(null); setForm(emptyExpense); }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Right: Expense Ledger List with Linked Hovering */}
              <div className="lg:col-span-7 glass-card p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800 light:border-slate-200">
                  <h2 className="text-xl font-bold text-white light:text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-400" />
                    <span>Expense Ledger</span>
                  </h2>
                  <div className="flex items-center gap-2">
                    {hoveredCategory && (
                      <button
                        onClick={() => setHoveredCategory(null)}
                        className="text-xs text-indigo-400 hover:underline"
                      >
                        Clear Filter
                      </button>
                    )}
                    <span className="text-xs text-slate-400 light:text-slate-600 bg-slate-950 light:bg-slate-100 px-3 py-1 rounded-full border border-slate-800 light:border-slate-200">
                      {expenses.length} Records
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {expenses.length === 0 ? (
                    <EmptyState
                      icon={CreditCard}
                      title="No expenses logged yet"
                      description="Use the form on the left to record your first trip expense."
                    />
                  ) : (
                    expenses.map((expense) => {
                      const config = CATEGORY_CONFIG[expense.category] || CATEGORY_CONFIG.MISCELLANEOUS;
                      const Icon = config.icon;
                      const isHighlighted = !hoveredCategory || hoveredCategory === expense.category;

                      return (
                        <div
                          key={expense.id}
                          onMouseEnter={() => setHoveredCategory(expense.category)}
                          onMouseLeave={() => setHoveredCategory(null)}
                          className={`flex items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-200 ${
                            isHighlighted
                              ? 'bg-slate-950/40 light:bg-slate-50 border-slate-800/80 light:border-slate-200 opacity-100 ring-1 ring-indigo-500/30 shadow-md'
                              : 'bg-slate-950/20 light:bg-slate-50/30 border-slate-900 light:border-slate-100 opacity-40 blur-[0.3px]'
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${config.color}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-white light:text-slate-900 text-sm group-hover:text-indigo-300 transition">
                                {expense.description}
                              </p>
                              <p className="text-xs text-slate-400 light:text-slate-500 flex items-center gap-2 mt-0.5">
                                <span className="text-slate-300 light:text-slate-700 font-medium">{config.label}</span>
                                <span>•</span>
                                <span>{expense.expenseDate}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <strong className="text-base font-extrabold text-white light:text-slate-900">
                              ${(expense.amount || 0).toLocaleString()}
                            </strong>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => { setEditingId(expense.id); setForm(expense); }}
                                className="p-1.5 rounded-lg border border-slate-800 light:border-slate-200 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => removeExpense(expense.id)}
                                className="p-1.5 rounded-lg border border-slate-800 light:border-slate-200 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </section>
          </>
        </MorphTransition>
      </PageShell>
    </AnimatedPage>
  );
};

export default Budget;
