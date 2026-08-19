import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpenIcon, CheckIcon, SmartphoneIcon } from 'lucide-react';
import { ButtonLink } from '../components/ui/Button';
import { StoryRail } from '../components/StoryRail';
import { featuredStory, stories, trendingStories } from '../data/stories';

export function Landing() {
  const art = featuredStory.cover;

  return (
    <>
      <section className="relative w-full overflow-hidden">
        <img
          src={art}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-[50%_25%]" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/90 to-ink/50" />

        <div className="relative mx-auto flex min-h-[86vh] max-w-3xl flex-col items-center justify-center px-5 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}>
            
            <span className="font-display text-3xl font-black tracking-[0.18em] text-cream">KISA</span>
            <h1 className="mt-7 font-display text-[34px] font-black leading-[1.05] text-cream sm:text-[56px]">
              Hadithi zinazokufanya urudi.
            </h1>
            <p className="mx-auto mt-5 max-w-md text-base text-mist sm:text-lg">
              Soma hadithi mpya za Kiswahili, sehemu baada ya sehemu.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <ButtonLink to="/hadithi" size="lg" className="w-full sm:w-auto sm:px-10">
                Anza Kusoma
              </ButtonLink>
              <ButtonLink to="/zinazopendwa" variant="secondary" size="lg" className="w-full sm:w-auto">
                Tazama Zinazopendwa
              </ButtonLink>
            </div>

            <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[13px] text-cream/80">
              {['Sehemu 3 za kwanza ni bure', 'Lipia mara moja tu kwa kila kitabu', 'Inafanya kazi kwa simu yako'].map(
                (t) =>
                <li key={t} className="inline-flex items-center gap-1.5">
                    <CheckIcon className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                    {t}
                  </li>

              )}
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-line-soft bg-[#0A0809] py-12">
        <div className="mx-auto grid max-w-[1100px] gap-8 px-4 sm:px-6 md:grid-cols-3 lg:px-10">
          {[
          {
            icon: BookOpenIcon,
            title: 'Hadithi zinazoendelea',
            body: 'Sehemu mpya kila wiki. Fuata hadithi na urudi kujua kinachoendelea.'
          },
          {
            icon: SmartphoneIcon,
            title: 'Imeundwa kwa simu',
            body: 'Nyepesi, inatumia data kidogo, na inasomeka vizuri kwenye simu yako.'
          },
          {
            icon: CheckIcon,
            title: 'Malipo ya mara moja',
            body: 'Hakuna usajili wa kila mwezi. Lipia hadithi unayoipenda tu na ibaki yako milele.'
          }].
          map((f) =>
          <div key={f.title}>
              <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                <f.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-display text-lg font-bold text-cream">{f.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-mist">{f.body}</p>
            </div>
          )}
        </div>
      </section>

      <StoryRail
        title="Anza na hizi"
        blurb="Hadithi zinazozungumzwa Tanzania sasa."
        stories={trendingStories}
        href="/hadithi" />
      

      <section className="pb-20">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col items-start gap-5 rounded-2xl border border-gold/25 bg-[#171112] px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <div>
              <p className="font-display text-2xl font-black text-cream">Gundua Hadithi Mpya</p>
              <p className="mt-1.5 text-sm text-mist">
                Anza kusoma sehemu 3 za kwanza za kila hadithi bure kabisa sasa.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <ButtonLink to="/hadithi" size="lg">
                Anza Kusoma Bure
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>);

}