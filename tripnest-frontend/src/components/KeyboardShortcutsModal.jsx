import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard, Command } from 'lucide-react';

const SHORTCUTS = [
  { keys: ['Ctrl', 'K'], label: 'Open Command Palette & Global Search' },
  { keys: ['?'], label: 'Toggle Keyboard Shortcuts Help' },
  { keys: ['N'], label: 'Create a New Trip (Trips Page)' },
  { keys: ['/'], label: 'Focus Search Bar' },
  { keys: ['Esc'], label: 'Close Active Modal or Overlay' },
];

const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 light:bg-white/95 p-6 shadow-2xl backdrop-blur-xl z-10"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 light:border-slate-200">
            <div className="flex items-center gap-2.5 text-white light:text-slate-900">
              <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
                <Keyboard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Keyboard Shortcuts</h3>
                <p className="text-xs text-slate-400 light:text-slate-500">Quick hotkeys for fast navigation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white light:hover:text-slate-900 hover:bg-slate-800 light:hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {SHORTCUTS.map((sc, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 light:bg-slate-100/70 border border-slate-800/80 light:border-slate-200/80"
              >
                <span className="text-xs font-medium text-slate-300 light:text-slate-700">{sc.label}</span>
                <div className="flex items-center gap-1">
                  {sc.keys.map((k, idx) => (
                    <kbd
                      key={idx}
                      className="px-2 py-1 text-[10px] font-extrabold uppercase rounded-md bg-slate-800 light:bg-white text-indigo-400 light:text-indigo-600 border border-slate-700 light:border-slate-300 shadow-sm"
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 light:border-slate-200 text-center">
            <p className="text-[11px] text-slate-500 light:text-slate-400">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">Esc</kbd> anytime to dismiss overlays
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default KeyboardShortcutsModal;
