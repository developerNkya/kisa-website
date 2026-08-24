import React from 'react';
import { Link } from 'react-router-dom';
import { stories } from '../../data/stories';
import { cn } from '../../utils/cn';

interface AuthShellProps {
  headline: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  isLight?: boolean;
}

export function AuthShell({
  headline,
  subtitle,
  children,
  footer,
  isLight = true,
}: AuthShellProps) {
  const art = stories[0]?.cover || '';

  return (
    <div className={cn(
      'grid min-h-screen w-full lg:grid-cols-[1fr_1.1fr]',
      isLight ? 'bg-gray-50' : 'bg-ink'
    )}>
      {/* Left Column - Form */}
      <div className={cn(
        'flex flex-col justify-center px-5 py-12 sm:px-10 lg:px-16',
        isLight ? 'bg-white' : 'bg-ink'
      )}>
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="inline-flex items-baseline gap-2">
            <span className={cn(
              'font-display text-2xl font-black tracking-[0.14em]',
              isLight ? 'text-[#9B1B3B]' : 'text-cream'
            )}>
              KISA
            </span>
            <span className={cn(
              'text-[10px] uppercase tracking-[0.2em]',
              isLight ? 'text-[#9B1B3B]/70' : 'text-gold'
            )}>
              Hadithi
            </span>
          </Link>

          <h1 className={cn(
            'mt-10 font-display text-3xl font-black leading-tight',
            isLight ? 'text-gray-900' : 'text-cream'
          )}>
            {headline}
          </h1>
          <p className={cn(
            'mt-2 text-sm',
            isLight ? 'text-gray-500' : 'text-mist'
          )}>
            {subtitle}
          </p>

          <div className="mt-8">
            <div className={isLight ? 'text-gray-900' : ''}>
              {children}
            </div>
          </div>

          <div className={cn(
            'mt-8 text-sm',
            isLight ? 'text-gray-500' : 'text-mist'
          )}>
            {footer}
          </div>
        </div>
      </div>

      {/* Right Column - Image - Clean, no overlay */}
      <div className="relative hidden lg:block">
        <img
          src={art}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
        />
        
        {/* Minimal left gradient only - no overlay */}
        <div className={cn(
          'absolute inset-y-0 left-0 w-1/3',
          isLight 
            ? 'bg-gradient-to-r from-white to-transparent'
            : 'bg-gradient-to-r from-ink to-transparent'
        )} />
        
        {/* Bottom quote section with clean background */}
        <div className="absolute inset-x-0 bottom-0 p-12">
          <div className="max-w-sm">
            <div className="inline-block rounded-lg bg-black/40 backdrop-blur-sm px-4 py-1 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-white">
                KISA Originals
              </span>
            </div>
            <p className="font-display text-3xl font-black italic leading-tight text-white drop-shadow-lg">
              “Hadithi zinazokufanya urudi tena.”
            </p>
            <p className="mt-3 max-w-sm text-sm text-white/90 drop-shadow-md">
              Hadithi mpya za Kiswahili, sehemu baada ya sehemu. Soma, furahia, na urudi kila siku.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}