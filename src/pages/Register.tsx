import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { Field } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { useAuth } from '../lib/AuthContext';
import { AlertCircleIcon } from 'lucide-react';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Tuambie jina lako.';
    if (!email.trim()) next.email = 'Weka email yako.';
    if (password.length < 6) next.password = 'Namba ya siri iwe na herufi 6 au zaidi.';
    if (password !== repeatPassword) next.repeatPassword = 'Namba za siri hazifanani.';
    
    setErrors(next);
    setGlobalError('');
    if (Object.keys(next).length > 0) return;
    
    setLoading(true);
    
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err: any) {
      setGlobalError(err.message || 'Usajili umeshindikana. Tafadhali jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      headline="Anza safari yako ya hadithi."
      subtitle="Akaunti moja, hadithi zote za KISA."
      footer={
        <p>
          Una akaunti?{' '}
          <Link to="/ingia" className="font-semibold text-gold hover:text-cream">
            Ingia
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {globalError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-wine/50 bg-wine/10 px-4 py-3 text-sm text-cream"
          >
            <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-wine-bright" aria-hidden="true" />
            {globalError}
          </div>
        )}
      
        <Field id="name" label="Jina Kamili" value={name} onChange={setName} placeholder="Amina Hassan" required error={errors.name} />
        
        <Field id="email" label="Email" type="email" value={email} onChange={setEmail} placeholder="jina@email.com" autoComplete="email" required error={errors.email} />
        
        <Field
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="new-password"
          required
          error={errors.password}
        />
        
        <Field
          id="repeatPassword"
          label="Rudia Password"
          type="password"
          value={repeatPassword}
          onChange={setRepeatPassword}
          placeholder="••••••••"
          autoComplete="new-password"
          required
          error={errors.repeatPassword}
        />

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Inasajili...' : 'Jisajili'}
        </Button>
        <p className="text-center text-xs leading-relaxed text-dust">
          Kwa kujisajili unakubali masharti ya matumizi ya KISA.
        </p>
      </form>
    </AuthShell>
  );
}