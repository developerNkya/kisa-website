import React, { useState } from 'react';
import { KeyIcon, LogOutIcon, ShieldCheckIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { Button, ButtonLink } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { StatusDot } from '../components/ui/Badge';
import { EmptyState } from '../components/states/EmptyState';
import { useKisa } from '../contexts/KisaContext';
import { cn } from '../utils/cn';
import { getDaysRemaining } from '../lib/subscription';

export function Profile() {
  const { user, profile, subscription, isPremium, logout } = useAuth();
  const { readerPrefs, setReaderPrefs } = useKisa();
  const [notif, setNotif] = useState({ episodes: true, reminders: true, promos: false });
  const [password, setPassword] = useState('');

  if (!user || !profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <EmptyState title="Hakuna akaunti iliyoingia" body="Ingia ili kuona na kubadilisha taarifa zako." ctaLabel="Ingia" ctaHref="/ingia" />
      </div>
    );
  }

  const daysLeft = subscription ? getDaysRemaining(subscription.expiry_date) : 0;

  const toggles: { key: keyof typeof notif; label: string; hint: string }[] = [
    { key: 'episodes', label: 'Sehemu mpya', hint: 'Tukujulishe pale sehemu mpya inatoka.' },
    { key: 'reminders', label: 'Kumbusho la usajili', hint: 'Tukujulishe kabla usajili kuisha.' },
    { key: 'promos', label: 'Matangazo ya KISA', hint: 'Hadithi mpya na ofa maalum.' },
  ];

  const handleChangePassword = async () => {
    if (!password.trim()) { toast.error('Weka password mpya'); return; }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { toast.error(error.message); return; }
    setPassword('');
    toast.success('Password imebadilishwa');
  };

  return (
    <div className="mx-auto max-w-[1000px] px-4 pb-24 pt-10 sm:px-6 lg:px-10">
      <h1 className="font-display text-3xl font-black text-cream sm:text-[40px]">Wasifu</h1>

      <section aria-labelledby="profile-info" className="mt-8 rounded-card border border-line-soft bg-surface p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-5">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-wine font-display text-3xl font-black text-cream">
            {profile.full_name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h2 id="profile-info" className="font-display text-2xl font-bold text-cream">{profile.full_name}</h2>
            {profile.phone && <p className="mt-1 text-sm text-mist">{profile.phone}</p>}
            <p className="text-sm text-mist">{profile.email}</p>
          </div>
          <div className="ml-auto rounded-xl border border-gold/25 bg-[#171112] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-gold">KISA Premium</p>
            <div className="mt-1.5">
              <StatusDot tone={isPremium ? 'green' : 'red'} label={isPremium ? 'Active' : 'Imeisha'} />
            </div>
            <p className="mt-1 text-xs text-mist">
              {isPremium ? `Inaisha baada ya siku ${daysLeft}` : 'Ongeza muda ili kuendelea'}
            </p>
          </div>
        </div>
        <p className="mt-5 text-xs text-dust">Mwanachama tangu {new Date(profile.created_at).toLocaleDateString('sw-TZ')}</p>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="reading-prefs" className="rounded-card border border-line-soft bg-surface p-5 sm:p-6">
          <h2 id="reading-prefs" className="font-display text-lg font-bold text-cream">Mapendeleo ya kusoma</h2>

          <div className="mt-5">
            <p className="text-[13px] font-medium text-mist">Ukubwa wa maandishi</p>
            <div className="mt-2 flex items-center gap-3">
              <input type="range" min={16} max={26} value={readerPrefs.fontSize} onChange={(e) => setReaderPrefs((p) => ({ ...p, fontSize: Number(e.target.value) }))} aria-label="Ukubwa wa maandishi" className="w-full accent-[#9B1B3B]" />
              <span className="w-12 shrink-0 text-right text-sm tabular-nums text-cream">{readerPrefs.fontSize}px</span>
            </div>
            <p className="mt-3 rounded-lg border border-line-soft bg-surface-raised px-4 py-3 font-read text-cream/85" style={{ fontSize: `${readerPrefs.fontSize}px`, lineHeight: 1.85 }}>
              Amina alisimama mlangoni, akiwa hajui kama aingie au arudi.
            </p>
          </div>

          <div className="mt-6">
            <p className="text-[13px] font-medium text-mist">Mandhari ya kusoma</p>
            <div className="mt-2 flex gap-2">
              {(['dark', 'light'] as const).map((m) => (
                <button key={m} onClick={() => setReaderPrefs((p) => ({ ...p, mode: m }))} aria-pressed={readerPrefs.mode === m} className={cn('flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors duration-150 ease-kisa', readerPrefs.mode === m ? 'border-gold/60 bg-gold/10 text-gold' : 'border-line bg-surface-raised text-mist hover:text-cream')}>
                  {m === 'dark' ? 'Usiku' : 'Mchana'}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[13px] font-medium text-mist">Upana wa kusoma</p>
            <div className="mt-2 flex gap-2">
              {(['narrow', 'wide'] as const).map((w) => (
                <button key={w} onClick={() => setReaderPrefs((p) => ({ ...p, width: w }))} aria-pressed={readerPrefs.width === w} className={cn('flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors duration-150 ease-kisa', readerPrefs.width === w ? 'border-gold/60 bg-gold/10 text-gold' : 'border-line bg-surface-raised text-mist hover:text-cream')}>
                  {w === 'narrow' ? 'Nyembamba' : 'Pana'}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <section aria-labelledby="notif-prefs" className="rounded-card border border-line-soft bg-surface p-5 sm:p-6">
            <h2 id="notif-prefs" className="font-display text-lg font-bold text-cream">Taarifa</h2>
            <ul className="mt-4 space-y-4">
              {toggles.map((t) => (
                <li key={t.key} className="flex items-start justify-between gap-4">
                  <span>
                    <span className="block text-sm font-medium text-cream">{t.label}</span>
                    <span className="block text-xs text-dust">{t.hint}</span>
                  </span>
                  <button role="switch" aria-checked={notif[t.key]} aria-label={t.label} onClick={() => setNotif((n) => ({ ...n, [t.key]: !n[t.key] }))} className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150 ease-kisa', notif[t.key] ? 'bg-wine' : 'bg-surface-high')}>
                    <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-cream transition-transform duration-150 ease-kisa', notif[t.key] ? 'translate-x-[22px]' : 'translate-x-0.5')} />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="security" className="rounded-card border border-line-soft bg-surface p-5 sm:p-6">
            <h2 id="security" className="flex items-center gap-2 font-display text-lg font-bold text-cream">
              <ShieldCheckIcon className="h-4 w-4 text-gold" aria-hidden="true" />
              Usalama wa akaunti
            </h2>
            <div className="mt-4 space-y-4">
              <Field id="new-password" label="Password mpya" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
              <Button variant="secondary" className="w-full" onClick={handleChangePassword}>
                <KeyIcon className="h-4 w-4" />
                Badilisha password
              </Button>
              <div className="flex flex-col gap-2 border-t border-line-soft pt-4 sm:flex-row">
                <ButtonLink to="/premium" variant="secondary" className="flex-1">Simamia usajili</ButtonLink>
                <Button variant="ghost" className="flex-1" onClick={async () => { await logout(); toast.message('Umetoka kwenye akaunti'); }}>
                  <LogOutIcon className="h-4 w-4" />
                  Toka
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}