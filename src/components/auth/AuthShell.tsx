import React from 'react';
import { Link } from 'react-router-dom';
import { stories } from '../../data/stories';

export function AuthShell({
  headline,
  subtitle,
  children,
  footer





}: {headline: string;subtitle: string;children: React.ReactNode;footer: React.ReactNode;}) {
  const art = stories[0].cover;

  return (
    <div className="grid min-h-screen w-full bg-ink lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col justify-center px-5 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="inline-flex items-baseline gap-2">
            <span className="font-display text-2xl font-black tracking-[0.14em] text-cream">KISA</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold">Hadithi</span>
          </Link>

          <h1 className="mt-10 font-display text-3xl font-black leading-tight text-cream">{headline}</h1>
          <p className="mt-2 text-sm text-mist">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-8 text-sm text-mist">{footer}</div>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <img
          src={art}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-[50%_30%]" />
        
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/50 to-ink/20" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="font-display text-3xl font-black italic leading-tight text-cream">
            “Hadithi zinazokufanya urudi.”
          </p>
          <p className="mt-3 max-w-sm text-sm text-mist">
            Hadithi mpya za Kiswahili, sehemu baada ya sehemu — kwa TZS 2,000 kwa mwezi.
          </p>
        </div>
      </div>
    </div>);

}