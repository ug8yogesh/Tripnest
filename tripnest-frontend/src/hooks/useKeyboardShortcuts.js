import { useEffect } from 'react';

export const useKeyboardShortcuts = ({
  onToggleCommandPalette,
  onToggleHelpModal,
  onNewTrip,
  onFocusSearch,
  onEscape,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isInput =
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) ||
        e.target.isContentEditable;

      // Cmd+K or Ctrl+K -> Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onToggleCommandPalette?.();
        return;
      }

      // Escape -> close open modals
      if (e.key === 'Escape') {
        onEscape?.();
        return;
      }

      // If user is currently typing in an input field, skip single-key shortcuts
      if (isInput) return;

      // Shift + ? -> Help modal
      if (e.key === '?') {
        e.preventDefault();
        onToggleHelpModal?.();
        return;
      }

      // 'n' or 'N' -> New Trip
      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        onNewTrip?.();
        return;
      }

      // '/' -> Focus Search
      if (e.key === '/') {
        e.preventDefault();
        onFocusSearch?.();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleCommandPalette, onToggleHelpModal, onNewTrip, onFocusSearch, onEscape]);
};
