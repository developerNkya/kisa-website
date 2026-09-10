import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { Field } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { useAuth } from '../lib/AuthContext';
import { AlertCircleIcon } from 'lucide-react';
import { analytics } from '../lib/analytics';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Tuambie jina lako.';
    if (!phone.trim()) next.phone = 'Weka namba yako ya simu (mfano 0712345678).';
    if (password.length < 6) next.password = 'Namba ya siri iwe na herufi 6 au zaidi.';
    if (password !== repeatPassword) next.repeatPassword = 'Password hazifanani.';
    
    setErrors(next);
    setGlobalError('');
    if (Object.keys(next).length > 0) return;
    
    setLoading(true);
    analytics.registerAttempt();
    
    try {
      const res = await register(name, phone, password, phone);
      if (res.error) {
        setGlobalError(res.error);
        analytics.registerFailed(res.error);
      } else {
        analytics.registerSuccess();
        navigate('/');
      }
    } catch (err: any) {
      const msg = err.message || 'Usajili umeshindikana. Tafadhali jaribu tena.';
      setGlobalError(msg);
      analytics.registerFailed(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      headline="Jisajili KISA"
      subtitle="Akaunti moja ya simu, hadithi zote ulizonunua."
      footer={
        <p className="text-gray-600">
          Una akaunti tayari?{' '}
          <Link to="/ingia" className="font-semibold text-[#9B1B3B] hover:text-[#C42B53] transition-colors">
            Ingia hapa
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {globalError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />
            {globalError}
          </div>
        )}
      
        <Field 
          id="name" 
          label="Jina Kamili" 
          value={name} 
          onChange={setName} 
          placeholder="Amina Hassan" 
          required 
          error={errors.name} 
          isLight={true}
        />
        
        <Field 
          id="phone" 
          label="Namba ya Simu" 
          type="tel" 
          value={phone} 
          onChange={setPhone} 
          placeholder="0712345678" 
          autoComplete="tel" 
          required 
          error={errors.phone}
          isLight={true} 
        />
        
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
          isLight={true}
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
          isLight={true}
        />

        <Button type="submit" size="lg" className="w-full bg-[#9B1B3B] hover:bg-[#C42B53] text-white" disabled={loading}>
          {loading ? 'Inasajili...' : 'Jisajili'}
        </Button>
        <p className="text-center text-xs leading-relaxed text-gray-500">
          Kwa kujisajili unakubali masharti ya matumizi ya KISA.
        </p>
      </form>
    </AuthShell>
  );
}