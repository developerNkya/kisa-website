import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, InstagramIcon, MessageCircleIcon } from 'lucide-react';

const columns = [
{
  title: 'Gundua',
  links: [
  { label: 'Hadithi zote', to: '/hadithi' },
  { label: 'Zinazopendwa', to: '/zinazopendwa' },
  { label: 'Hadithi mpya', to: '/mpya' },
  { label: 'Makundi', to: '/makundi' }]

},
{
  title: 'Akaunti',
  links: [
  { label: 'Ingia', to: '/ingia' },
  { label: 'Jisajili', to: '/jisajili' },
  { label: 'KISA Premium', to: '/premium' },
  { label: 'Malipo', to: '/malipo' }]

},
{
  title: 'KISA',
  links: [
  { label: 'Kuhusu sisi', to: '/karibu' },
  { label: 'Waandishi', to: '/tafuta' },
  { label: 'Msaada', to: '/karibu' },
  { label: 'Admin', to: '/admin' }]

}];


export function Footer() {
  return (
    <footer className="border-t border-line bg-[#0A0809]">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <span className="font-display text-2xl font-black tracking-[0.14em] text-cream">KISA</span>
            <p className="mt-3 max-w-xs font-display text-lg italic text-gold">
              Hadithi zinazokufanya urudi.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-dust">
              Hadithi za kubuni za Kiswahili, sehemu baada ya sehemu. Imeundwa Tanzania, kwa wasomaji wa
              Afrika Mashariki.
            </p>
            <div className="mt-5 flex gap-2">
              {[MessageCircleIcon, FacebookIcon, InstagramIcon].map((Icon, i) =>
              <span
                key={i}
                className="grid h-9 w-9 place-items-center rounded-full border border-line text-mist">
                
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) =>
            <div key={col.title}>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) =>
                <li key={l.label}>
                      <Link
                    to={l.to}
                    className="text-sm text-mist transition-colors duration-150 ease-kisa hover:text-cream">
                    
                        {l.label}
                      </Link>
                    </li>
                )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line-soft pt-6 text-xs text-dust sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 KISA Media, Dar es Salaam. Haki zote zimehifadhiwa.</p>
          <p>KISA Premium — TZS 2,000 / mwezi</p>
        </div>
      </div>
    </footer>);

}