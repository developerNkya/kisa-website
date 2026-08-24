import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircleIcon } from 'lucide-react';
import { AuthShell } from '../components/auth/AuthShell';
import { Field } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { useAuth } from '../lib/AuthContext';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get('redirect') || '/';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Weka email yako ili kuendelea.');
      return;
    }
    if (password.length < 4) {
      setError('Namba ya siri haijakamilika. Jaribu tena.');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate(redirect);
    } catch (err: any) {
      setError(err.message || 'Kuna tatizo limejitokeza. Jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      headline="Karibu KISA"
      subtitle="Ingia na uendelee na hadithi yako."
      footer={
        <p className="text-gray-600">
          Huna akaunti?{' '}
          <Link to="/jisajili" className="font-semibold text-[#9B1B3B] hover:text-[#C42B53] transition-colors">
            Jisajili
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />
            {error}
          </div>
        )}

        <Field
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="jina@email.com"
          autoComplete="email"
          required
        />
        
        <Field
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />

        <Button 
          type="submit" 
          size="lg" 
          className="w-full bg-[#9B1B3B] hover:bg-[#C42B53] text-white"
          disabled={loading}
        >
          {loading ? 'Inaingia...' : 'Ingia'}
        </Button>
      </form>
    </AuthShell>
  );
}