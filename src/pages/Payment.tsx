import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircleIcon, CheckCircle2Icon, LoaderIcon, ShieldCheckIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { paymentMethods, premiumBenefits } from '../data/notifications';
import { useAuth } from '../lib/AuthContext';
import { cn } from '../utils/cn';

type Stage = 'form' | 'pending' | 'success' | 'failed';

export function Payment() {
  const { profile, refreshSubscription } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState(paymentMethods[0].id);
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [stage, setStage] = useState<Stage>('form');

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    setStage('pending');
    try {
      const res = await fetch('/api/subscription/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: method,
          phone,
          email: profile?.email,
          fullName: profile?.full_name,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Malipo hayajakamilika');
      if (data.payment_url) window.open(data.payment_url, '_blank');
      setStage('success');
      await refreshSubscription();
      toast.success('Malipo yamethibitishwa', { description: 'KISA Premium yako imeanza. Karibu!' });
    } catch (err: unknown) {
      setStage('failed');
      toast.error(err instanceof Error ? err.message : 'Tatizo limetokea');
    }
  };

  return (
    <div className="mx-auto max-w-[1000px] px-4 pb-24 pt-10 sm:px-6 lg:px-10">
      <header className="max-w-xl">
        <h1 className="font-display text-3xl font-black text-cream sm:text-[40px]">
          Malipo ya KISA Premium
        </h1>
        <p className="mt-2 text-sm text-mist">
          Chagua njia yako ya malipo. Usajili wako utaanza baada ya malipo kuthibitishwa.
        </p>
      </header>

      <div className="mt-9 grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <div className="rounded-2xl border border-line-soft bg-surface p-5 sm:p-7">
          {stage === 'success' ? (
            <div className="py-6 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-300">
                <CheckCircle2Icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-bold text-cream">Malipo yamekamilika</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-mist">
                Usajili wako wa KISA Premium umeanza leo na unaisha baada ya siku 30.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button onClick={() => navigate('/hadithi')} size="lg">Anza kusoma</Button>
                <Button variant="secondary" size="lg" onClick={() => navigate('/akaunti')}>Nenda kwenye akaunti</Button>
              </div>
            </div>
          ) : stage === 'pending' ? (
            <div className="py-10 text-center">
              <LoaderIcon className="mx-auto h-8 w-8 animate-spin text-gold" aria-hidden="true" />
              <h2 className="mt-5 font-display text-xl font-bold text-cream">Tunasubiri uthibitisho...</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-mist">
                Angalia simu yako {phone || ''} na weka namba ya siri ya {paymentMethods.find((m) => m.id === method)?.name} ili kukamilisha malipo ya TZS 2,000.
              </p>
            </div>
          ) : (
            <form onSubmit={pay} className="space-y-6">
              {stage === 'failed' && (
                <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-wine/50 bg-wine/10 px-4 py-3 text-sm text-cream">
                  <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-wine-bright" aria-hidden="true" />
                  <span>
                    <span className="block font-semibold">Malipo hayajakamilika</span>
                    Hatukuweza kuthibitisha malipo. Hakikisha namba ya simu ni sahihi na una salio la TZS 2,000.
                  </span>
                </div>
              )}

              <fieldset>
                <legend className="mb-3 text-[13px] font-medium text-mist">Njia ya malipo</legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {paymentMethods.map((m) => (
                    <label key={m.id} className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors duration-150 ease-kisa',
                      method === m.id ? 'border-gold/60 bg-gold/[0.07]' : 'border-line bg-surface-raised hover:border-mist/40'
                    )}>
                      <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} className="h-4 w-4 accent-[#C9A24A]" />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-cream">{m.name}</span>
                        <span className="block truncate text-xs text-dust">{m.hint}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <Field id="pay-phone" label="Namba ya simu ya malipo" type="tel" value={phone} onChange={setPhone} placeholder="0712 345 678" required hint="Utapokea ujumbe wa kuthibitisha malipo kwenye namba hii." />

              <Button type="submit" size="lg" className="w-full">Lipa TZS 2,000</Button>
              <p className="flex items-center justify-center gap-2 text-xs text-dust">
                <ShieldCheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Malipo yanachakatwa kwa usalama. Hatuhifadhi namba yako ya siri.
              </p>
            </form>
          )}
        </div>

        <aside className="rounded-2xl border border-gold/25 bg-[#171112] p-5 sm:p-6">
          <h2 className="font-display text-lg font-bold text-cream">Muhtasari wa malipo</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-mist">KISA Premium</dt>
              <dd className="font-semibold text-cream">Mwezi 1</dd>
            </div>
            <div className="flex items-center justify-between border-t border-line-soft pt-3">
              <dt className="text-mist">Kiasi</dt>
              <dd className="font-display text-2xl font-black text-cream">TZS 2,000</dd>
            </div>
          </dl>
          <ul className="mt-5 space-y-2 border-t border-line-soft pt-5">
            {premiumBenefits.map((b) => (
              <li key={b} className="text-[13px] text-mist">✓ {b}</li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}