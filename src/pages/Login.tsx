import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircleIcon } from 'lucide-react';
import { AuthShell } from '../components/auth/AuthShell';
import { Field } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { useKisa } from '../contexts/KisaContext';

export function Login() {
  const { login } = useKisa();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone && !email) {
      setError('Weka namba ya simu au email ili kuendelea.');
      return;
    }
    if (password.length < 4) {
      setError('Namba ya siri haijakamilika. Jaribu tena.');
      return;
    }
    setError('');
    setLoading(true);
    window.setTimeout(() => {
      login();
      navigate('/akaunti');
    }, 700);
  };

  return (
    <AuthShell
      headline="Karibu KISA"
      subtitle="Ingia na uendelee na hadithi yako."
      footer={
      <p>
          Huna akaunti?{' '}
          <Link to="/jisajili" className="font-semibold text-gold hover:text-cream">
            Jisajili
          </Link>
        </p>
      }>
      
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error &&
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-wine/50 bg-wine/10 px-4 py-3 text-sm text-cream">
          
            <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-wine-bright" aria-hidden="true" />
            {error}
          </div>
        }

        <Field
          id="phone"
          label="Namba ya simu"
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder="0712 345 678"
          autoComplete="tel"
          required />
        
        <Field
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="jina@email.com"
          autoComplete="email" />
        
        <Field
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="current-password"
          required />
        

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Inaingia...' : 'Ingia'}
        </Button>

        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-line" />
          <span className="text-xs text-dust">au</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <Button type="button" variant="secondary" size="lg" className="w-full" onClick={() => login()}>
          Endelea na Google
        </Button>
      </form>
    </AuthShell>);

}