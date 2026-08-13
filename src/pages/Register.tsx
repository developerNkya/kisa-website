import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { Field } from '../components/ui/Field';
import { Button } from '../components/ui/Button';
import { useKisa } from '../contexts/KisaContext';

export function Register() {
  const { login } = useKisa();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Tuambie jina lako.';
    if (phone.replace(/\D/g, '').length < 9) next.phone = 'Weka namba ya simu sahihi.';
    if (password.length < 6) next.password = 'Namba ya siri iwe na herufi 6 au zaidi.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setLoading(true);
    window.setTimeout(() => {
      login(name);
      navigate('/premium');
    }, 700);
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
      }>
      
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field id="name" label="Jina" value={name} onChange={setName} placeholder="Amina Hassan" required error={errors.name} />
        <Field
          id="phone"
          label="Namba ya simu"
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder="0712 345 678"
          autoComplete="tel"
          required
          error={errors.phone}
          hint="Tunaitumia kwa malipo ya M-Pesa au Airtel Money." />
        
        <Field id="email" label="Email" type="email" value={email} onChange={setEmail} placeholder="jina@email.com" autoComplete="email" />
        <Field
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="new-password"
          required
          error={errors.password} />
        

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Inasajili...' : 'Jisajili'}
        </Button>
        <p className="text-center text-xs leading-relaxed text-dust">
          Kwa kujisajili unakubali masharti ya matumizi ya KISA.
        </p>
      </form>
    </AuthShell>);

}