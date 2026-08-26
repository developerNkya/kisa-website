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
    
    // Reset error
    setError('');
    
    // Validate email
    if (!email.trim()) {
      setError('Tafadhali weka barua pepe yako.');
      return;
    }
    
    // Validate password
    if (password.length < 6) {
      setError('Password lazima iwe na herufi 6 au zaidi.');
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(email, password);
      
      // Check if there was an error
      if (result.error) {
        // Map Supabase error messages to user-friendly messages
        if (result.error.includes('Invalid login credentials')) {
          setError('Barua pepe au password si sahihi. Tafadhali jaribu tena.');
        } else if (result.error.includes('Email not confirmed')) {
          setError('Barua pepe yako haijathibitishwa. Tafadhali angalia email yako.');
        } else if (result.error.includes('User not found')) {
          setError('Barua pepe hii haijasajiliwa. Tafadhali jisajili kwanza.');
        } else if (result.error.includes('Invalid email')) {
          setError('Barua pepe si sahihi. Tafadhali ingiza email sahihi.');
        } else {
          setError(result.error);
        }
        setLoading(false);
        return;
      }
      
      // Login successful
      navigate(redirect);
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Kuna tatizo limejitokeza. Jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      headline="Karibu KISA"
      subtitle="Ingia na uendelee na hadithi yako."
      footer={
        <div className="space-y-2">
          <p className="text-gray-600">
            Huna akaunti?{' '}
            <Link to="/jisajili" className="font-semibold text-[#9B1B3B] hover:text-[#C42B53] transition-colors">
              Jisajili
            </Link>
          </p>
          <p className="text-sm text-gray-500">
            <Link to="/sahau-password" className="text-[#9B1B3B] hover:text-[#C42B53] transition-colors">
              Umesahau password?
            </Link>
          </p>
        </div>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <Field
          id="email"
          label="Barua Pepe"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="jina@email.com"
          autoComplete="email"
          required
          isLight={true}
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
          isLight={true}
        />

        <Button 
          type="submit" 
          size="lg" 
          className="w-full bg-[#9B1B3B] hover:bg-[#C42B53] text-white"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Inaingia...
            </span>
          ) : (
            'Ingia'
          )}
        </Button>
      </form>
    </AuthShell>
  );
}