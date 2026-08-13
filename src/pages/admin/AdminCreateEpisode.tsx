import React, { useState } from 'react';
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  QuoteIcon,
  Redo2Icon,
  Undo2Icon } from
'lucide-react';
import { toast } from 'sonner';
import { AdminPanel } from '../../components/admin/AdminTable';
import { stories } from '../../data/stories';
import { episodeBody } from '../../data/readerText';
import { cn } from '../../utils/cn';

const inputClass =
'w-full rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none';
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500';

export function AdminCreateEpisode() {
  const [story, setStory] = useState(stories[0].title);
  const [number, setNumber] = useState('19');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(episodeBody.slice(0, 4).join('\n\n'));
  const [access, setAccess] = useState('Premium');
  const [status, setStatus] = useState('Draft');
  const [date, setDate] = useState('2026-08-17');

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 180));

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-bold text-zinc-50">Create Episode</h1>
        <p className="mt-1 text-sm text-zinc-500">Andika sehemu mpya ya hadithi.</p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.success('Episode published', { description: `${story} — Sehemu ya ${number}` });
        }}
        className="grid gap-4 xl:grid-cols-[1.6fr_1fr] xl:items-start">
        
        <div className="space-y-4">
          <AdminPanel title="Episode">
            <div className="grid gap-4 p-4 sm:grid-cols-[1fr_100px] sm:p-5">
              <div>
                <label htmlFor="ep-story" className={labelClass}>
                  Story
                </label>
                <select id="ep-story" value={story} onChange={(e) => setStory(e.target.value)} className={inputClass}>
                  {stories.map((s) =>
                  <option key={s.id}>{s.title}</option>
                  )}
                </select>
              </div>
              <div>
                <label htmlFor="ep-number" className={labelClass}>
                  Number
                </label>
                <input
                  id="ep-number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className={inputClass} />
                
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="ep-title" className={labelClass}>
                  Episode title
                </label>
                <input
                  id="ep-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ndoto Mbaya"
                  className={inputClass} />
                
              </div>
            </div>
          </AdminPanel>

          <AdminPanel
            title="Story content"
            description={`Maneno ${words.toLocaleString()} · Dakika ${minutes} za kusoma`}>
            
            <div className="border-b border-zinc-800 px-3 py-2">
              <div className="flex flex-wrap gap-1">
                {[BoldIcon, ItalicIcon, QuoteIcon, ListIcon, Undo2Icon, Redo2Icon].map((Icon, i) =>
                <button
                  key={i}
                  type="button"
                  aria-label="Formatting"
                  className="grid h-8 w-8 place-items-center rounded text-zinc-400 transition-colors duration-150 ease-kisa hover:bg-zinc-800 hover:text-zinc-100">
                  
                    <Icon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <label htmlFor="ep-content" className="sr-only">
                Story content
              </label>
              <textarea
                id="ep-content"
                rows={20}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={cn(
                  inputClass,
                  'resize-y font-read text-[15px] leading-[1.85] text-zinc-200'
                )} />
              
            </div>
          </AdminPanel>
        </div>

        <div className="space-y-4">
          <AdminPanel title="Publishing">
            <div className="space-y-4 p-4 sm:p-5">
              <div>
                <label htmlFor="ep-date" className={labelClass}>
                  Publication date
                </label>
                <input
                  id="ep-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputClass} />
                
              </div>
              <div>
                <label htmlFor="ep-minutes" className={labelClass}>
                  Reading time
                </label>
                <input id="ep-minutes" readOnly value={`Dakika ${minutes}`} className={inputClass} />
              </div>
              <div>
                <span className={labelClass}>Access</span>
                <div className="flex gap-2">
                  {['Free', 'Premium'].map((a) =>
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAccess(a)}
                    aria-pressed={access === a}
                    className={cn(
                      'flex-1 rounded-md border px-3 py-2 text-sm font-semibold transition-colors duration-150 ease-kisa',
                      access === a ?
                      'border-amber-500/50 bg-amber-500/10 text-amber-300' :
                      'border-zinc-800 text-zinc-400 hover:text-zinc-100'
                    )}>
                    
                      {a}
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="ep-status" className={labelClass}>
                  Status
                </label>
                <select
                  id="ep-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={inputClass}>
                  
                  <option>Draft</option>
                  <option>Scheduled</option>
                  <option>Published</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 border-t border-zinc-800 pt-4">
                <button
                  type="submit"
                  className="rounded-md bg-wine px-4 py-2.5 text-sm font-semibold text-cream hover:bg-wine-bright">
                  
                  Publish
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex-1 rounded-md border border-zinc-700 px-3 py-2.5 text-sm font-semibold text-zinc-200 hover:border-zinc-500">
                    
                    Save Draft
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-md border border-zinc-700 px-3 py-2.5 text-sm font-semibold text-zinc-200 hover:border-zinc-500">
                    
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </AdminPanel>

          <AdminPanel title="Reader preview">
            <div className="p-4 sm:p-5">
              <div className="rounded-md border border-line-soft bg-ink p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">{story}</p>
                <p className="mt-1.5 font-display text-lg font-bold text-cream">
                  Sehemu ya {number} — {title || 'Kichwa'}
                </p>
                <p className="mt-3 line-clamp-6 font-read text-[13px] leading-[1.8] text-cream/80">
                  {content}
                </p>
              </div>
            </div>
          </AdminPanel>
        </div>
      </form>
    </div>);

}