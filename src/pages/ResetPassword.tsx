import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { AuthShell } from '../components/auth/AuthShell';

export function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // ✅ Extract token from URL hash
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const type = params.get('type');

    console.log('🔑 Token from URL:', { accessToken, refreshToken, type });

    if (accessToken && type === 'recovery') {
      setToken(accessToken);
      // ✅ Set the session with the token
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken || '',
      }).then(({ data, error }) => {
        if (error) {
          console.error('Error setting session:', error);
          setError('Kiungo haki halali au kimeisha muda wake.');
        } else {
          console.log('✅ Session set successfully');
        }
      });
    } else if (!accessToken) {
      setError('Kiungo haki halali au kimeisha muda wake.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password lazima iwe na herufi 6 au zaidi');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Password hazifanani');
      return;
    }

    setLoading(true);
    try {
      // ✅ Update the password using the current session
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error('Update error:', error);
        throw error;
      }

      setSuccess(true);
      toast.success('Password imebadilishwa kikamilifu');

      // Sign out after password change
      await supabase.auth.signOut();

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/ingia');
      }, 3000);
    } catch (err: any) {
      console.error('Error:', err);
      toast.error(err.message || 'Hitilafu imetokea. Jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <AuthShell
        headline="Kiungo Haki Halali"
        subtitle="Tafadhali omba kiungo kipya cha kuweka password mpya."
        isLight={true}
        footer={
          <Link to="/sahau-password" className="font-semibold text-[#9B1B3B] hover:text-[#C42B53] transition-colors">
            <ArrowLeftIcon className="inline h-4 w-4 mr-1" />
            Omba kiungo kipya
          </Link>
        }
      >
        <div className="text-center py-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertCircleIcon className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </AuthShell>
    );
  }

  if (success) {
    return (
      <AuthShell
        headline="Password Imebadilishwa! ✅"
        subtitle="Password yako imebadilishwa kikamilifu. Unaelekezwa kwenye ukurasa wa ingia."
        isLight={true}
        footer={
          <Link to="/ingia" className="font-semibold text-[#9B1B3B] hover:text-[#C42B53] transition-colors">
            <ArrowLeftIcon className="inline h-4 w-4 mr-1" />
            Ingia sasa
          </Link>
        }
      >
        <div className="text-center py-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-gray-500 text-sm">
            Password yako imebadilishwa. Sasa unaweza kuingia na password mpya.
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      headline="Weka Password Mpya"
      subtitle="Ingiza password mpya unayotaka kutumia."
      isLight={true}
      footer={
        <Link to="/ingia" className="font-semibold text-[#9B1B3B] hover:text-[#C42B53] transition-colors">
          <ArrowLeftIcon className="inline h-4 w-4 mr-1" />
          Rudi kwenye ingia
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          id="password"
          label="Password Mpya"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="new-password"
          required
          isLight={true}
          hint="Lazima iwe na herufi 6 au zaidi"
        />

        <Field
          id="confirm-password"
          label="Thibitisha Password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="••••••••"
          autoComplete="new-password"
          required
          isLight={true}
        />

        <Button 
          type="submit" 
          size="lg" 
          className="w-full bg-[#9B1B3B] hover:bg-[#C42B53] text-white"
          disabled={loading}
        >
          {loading ? 'Inabadilisha...' : 'Badilisha Password'}
        </Button>
      </form>
    </AuthShell>
  );
}