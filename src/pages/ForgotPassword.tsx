import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { AuthShell } from '../components/auth/AuthShell';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Tafadhali weka barua pepe yako');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSent(true);
      toast.success('Form ya kuweka password mpya imetumwa');
    } catch (err: any) {
      toast.error(err.message || 'Hitilafu imetokea. Jaribu tena.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthShell
        headline="Angalia Barua Pepe Yako"
        subtitle="Tumetuma form ya password mpya. Angalia spam ikiwa haujaipata."
        isLight={true}
        footer={
          <Link to="/ingia" className="font-semibold text-[#9B1B3B] hover:text-[#C42B53] transition-colors">
            <ArrowLeftIcon className="inline h-4 w-4 mr-1" />
            Rudi kwenye ingia
          </Link>
        }
      >
        <div className="text-center py-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-gray-600 text-sm mb-2">
            Tumetuma Form kwa <strong>{email}</strong>
          </p>
          <p className="text-gray-400 text-xs">
            Form itakua halali kwa muda wa dakika 60.
          </p>
          <button
            onClick={() => setSent(false)}
            className="mt-4 text-sm text-[#9B1B3B] hover:text-[#C42B53] transition-colors"
          >
            Tumia barua pepe nyingine
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      headline="Umesahau Password?"
      subtitle="Weka barua pepe yako na tutakutumia form ya kuweka password mpya."
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

        <Button 
          type="submit" 
          size="lg" 
          className="w-full bg-[#9B1B3B] hover:bg-[#C42B53] text-white"
          disabled={loading}
        >
          {loading ? 'Inatuma...' : 'Tuma'}
        </Button>

        <p className="text-xs text-center text-gray-400">
          Kiungo kitatumwa kwa barua pepe yako. Hakikisha umeingiza anwani sahihi.
        </p>
      </form>
    </AuthShell>
  );
}