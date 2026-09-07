import { useState, useEffect } from 'react';

const CountUp = ({ end, duration = 800, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const target = typeof end === 'number' ? end : parseFloat(end) || 0;

    if (target === 0) {
      setCount(0);
      return;
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    window.requestAnimationFrame(step);
  }, [end, duration]);

  const formatted = typeof end === 'number' && !Number.isInteger(end)
    ? count.toFixed(2)
    : count.toLocaleString();

  return (
    <span>
      {prefix}{formatted}{suffix}
    </span>
  );
};

export default CountUp;
