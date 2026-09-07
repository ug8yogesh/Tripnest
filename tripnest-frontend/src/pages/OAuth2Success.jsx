import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuth2Success = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Authenticating session...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const email = params.get('email');
    const role  = params.get('role');

    if (token && email && role) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ token, email, role }));

      setStatus('Authentication successful! Redirecting...');

      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500);
    } else {
      setStatus('Authentication failed! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1000);
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="glass-card p-10 max-w-sm w-full text-center space-y-4 border-slate-800">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 animate-spin">
          ⏳
        </div>
        <p className="text-sm font-semibold text-slate-300">{status}</p>
      </div>
    </div>
  );
};

export default OAuth2Success;