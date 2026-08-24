import React from 'react';
import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Gundua',
    links: [
      { label: 'Hadithi zote', to: '/hadithi' },
      { label: 'Zinazopendwa', to: '/zinazopendwa' },
      { label: 'Hadithi mpya', to: '/mpya' },
      { label: 'Makundi', to: '/makundi' },
    ],
  },
  {
    title: 'Akaunti',
    links: [
      { label: 'Ingia', to: '/ingia' },
      { label: 'Jisajili', to: '/jisajili' },
      { label: 'Akaunti Yangu', to: '/akaunti' },
    ],
  },
  {
    title: 'KISA',
    links: [
      { label: 'Kuhusu sisi', to: '/karibu' },
      { label: 'Admin', to: '/admin' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <span className="font-display text-2xl font-black tracking-[0.14em] text-[#9B1B3B]">KISA</span>
            <p className="mt-3 max-w-xs font-display text-base italic text-gray-500">
              Hadithi zinazokufanya urudi.
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
              Hadithi za kubuni za Kiswahili, sehemu baada ya sehemu. Imeundwa Tanzania, kwa wasomaji wa Afrika Mashariki.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-gray-100 pt-6 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 KISA Media, Dar es Salaam. Haki zote zimehifadhiwa.</p>
          <p>Hadithi za Kubuni za Kiswahili</p>
        </div>
      </div>
    </footer>
  );
}