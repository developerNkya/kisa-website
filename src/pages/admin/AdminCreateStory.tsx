import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { AdminPanel } from '../../components/admin/AdminTable';
import { authors, genres, stories } from '../../data/stories';
import { PremiumBadge } from '../../components/ui/Badge';
import { cn } from '../../utils/cn';

const inputClass =
'w-full rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none';
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500';

export function AdminCreateStory() {
  const [title, setTitle] = useState('');
  const [hook, setHook] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState(authors[0].name);
  const [category, setCategory] = useState('Mapenzi');
  const [tags, setTags] = useState('#Mapenzi #Drama');
  const [status, setStatus] = useState('Draft');
  const [access, setAccess] = useState('Premium');
  const [featured, setFeatured] = useState(false);
  const cover = stories[0].cover;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-bold text-zinc-50">Create Story</h1>
        <p className="mt-1 text-sm text-zinc-500">Ongeza hadithi mpya kwenye maktaba ya KISA.</p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.success('Story saved', { description: `${title || 'Untitled'} imehifadhiwa kama ${status}.` });
        }}
        className="grid gap-4 xl:grid-cols-[1.5fr_1fr] xl:items-start">
        
        <div className="space-y-4">
          <AdminPanel title="Story details">
            <div className="space-y-4 p-4 sm:p-5">
              <div>
                <label htmlFor="story-title" className={labelClass}>
                  Story title
                </label>
                <input
                  id="story-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Siri ya Amina"
                  className={inputClass} />
                
              </div>
              <div>
                <label htmlFor="story-hook" className={labelClass}>
                  Hook (mstari mmoja)
                </label>
                <input
                  id="story-hook"
                  value={hook}
                  onChange={(e) => setHook(e.target.value)}
                  placeholder="Alijua alikuwa anadanganywa. Hakujua ni kwa nini."
                  className={inputClass} />
                
              </div>
              <div>
                <label htmlFor="story-desc" className={labelClass}>
                  Description
                </label>
                <textarea
                  id="story-desc"
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Maelezo ya hadithi..."
                  className={cn(inputClass, 'resize-y leading-relaxed')} />
                
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="story-author" className={labelClass}>
                    Author
                  </label>
                  <select
                    id="story-author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className={inputClass}>
                    
                    {authors.map((a) =>
                    <option key={a.id}>{a.name}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label htmlFor="story-cat" className={labelClass}>
                    Category
                  </label>
                  <select
                    id="story-cat"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputClass}>
                    
                    {genres.
                    filter((g) => g !== 'Zote').
                    map((g) =>
                    <option key={g}>{g}</option>
                    )}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="story-tags" className={labelClass}>
                  Tags
                </label>
                <input
                  id="story-tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className={inputClass} />
                
              </div>
            </div>
          </AdminPanel>

          <AdminPanel title="Cover image">
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
              <img
                src={cover}
                alt="Kielelezo cha jalada"
                className="h-40 w-[108px] shrink-0 rounded-md border border-zinc-800 object-cover" />
              
              <div className="flex flex-1 flex-col justify-center rounded-md border border-dashed border-zinc-700 px-4 py-6 text-center">
                <ImageIcon className="mx-auto h-6 w-6 text-zinc-600" aria-hidden="true" />
                <p className="mt-2 text-sm text-zinc-300">Drop cover art here</p>
                <p className="mt-1 text-xs text-zinc-500">JPG au PNG · uwiano 2:3 · chini ya 400KB</p>
                <button
                  type="button"
                  className="mx-auto mt-3 rounded-md border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-zinc-500">
                  
                  Choose file
                </button>
              </div>
            </div>
          </AdminPanel>
        </div>

        <div className="space-y-4">
          <AdminPanel title="Publishing">
            <div className="space-y-4 p-4 sm:p-5">
              <div>
                <label htmlFor="story-status" className={labelClass}>
                  Status
                </label>
                <select
                  id="story-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={inputClass}>
                  
                  <option>Draft</option>
                  <option>Scheduled</option>
                  <option>Published</option>
                </select>
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
              <label className="flex items-center gap-3 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 accent-[#C42B53]" />
                
                Featured kwenye homepage
              </label>

              <div className="flex flex-col gap-2 border-t border-zinc-800 pt-4">
                <button
                  type="submit"
                  className="rounded-md bg-wine px-4 py-2.5 text-sm font-semibold text-cream hover:bg-wine-bright">
                  
                  Save story
                </button>
                <button
                  type="button"
                  className="rounded-md border border-zinc-700 px-4 py-2.5 text-sm font-semibold text-zinc-200 hover:border-zinc-500">
                  
                  Save draft
                </button>
              </div>
            </div>
          </AdminPanel>

          <AdminPanel title="Preview" description="Jinsi kadi itakavyoonekana kwa wasomaji">
            <div className="p-4 sm:p-5">
              <div className="w-[168px]">
                <div className="relative overflow-hidden rounded-card border border-line-soft">
                  <img src={cover} alt="" aria-hidden="true" className="aspect-[2/3] w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                  {access === 'Premium' &&
                  <div className="absolute left-2 top-2">
                      <PremiumBadge />
                    </div>
                  }
                </div>
                <p className="mt-2.5 font-display text-sm font-bold text-cream">
                  {title || 'Kichwa cha hadithi'}
                </p>
                <p className="text-xs text-mist">{category} · 0 Sehemu</p>
              </div>
            </div>
          </AdminPanel>
        </div>
      </form>
    </div>);

}