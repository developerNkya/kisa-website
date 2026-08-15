import React, { useEffect, useState } from 'react';
import { ImageIcon, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { AdminPanel } from '../../components/admin/AdminTable';
import { PremiumBadge } from '../../components/ui/Badge';
import { cn } from '../../utils/cn';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

const inputClass =
  'w-full rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none';
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500';

export function AdminEditStory() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [authors, setAuthors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [title, setTitle] = useState('');
  const [hook, setHook] = useState('');
  const [description, setDescription] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');
  const [isOriginal, setIsOriginal] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [existingCoverUrl, setExistingCoverUrl] = useState('');

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) loadAll();
  }, [isAdmin, id]);

  async function loadAll() {
    setLoading(true);
    try {
      const [storyRes, authRes, catRes] = await Promise.all([
        supabase.from('stories').select('*').eq('id', id).single(),
        supabase.from('authors').select('*').order('name'),
        supabase.from('categories').select('*').order('name'),
      ]);

      if (storyRes.error || !storyRes.data) throw new Error('Story not found');
      const s = storyRes.data;

      setTitle(s.title || '');
      setHook(s.hook || '');
      setDescription(s.description || '');
      setAuthorId(s.author_id || '');
      setCategoryId(s.category_id || '');
      setTags((s.tags || []).join(', '));
      setStatus(s.status || 'draft');
      setIsOriginal(s.is_original ?? true);
      setFeatured(s.is_featured ?? false);
      setExistingCoverUrl(s.cover_url || '');
      setCoverPreview(s.cover_url || '');

      if (authRes.data) setAuthors(authRes.data);
      if (catRes.data) setCategories(catRes.data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load story');
    } finally {
      setLoading(false);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !authorId || !categoryId) {
      toast.error('Please fill required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      let cover_url = existingCoverUrl;

      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('covers')
          .upload(fileName, coverFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('covers').getPublicUrl(fileName);
        cover_url = publicUrl;
      }

      const slug = generateSlug(title);
      const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);

      const { error } = await supabase.from('stories').update({
        title,
        slug,
        hook,
        description,
        author_id: authorId,
        category_id: categoryId,
        tags: tagArray,
        status,
        is_featured: featured,
        is_original: isOriginal,
        cover_url,
      }).eq('id', id);

      if (error) throw error;
      toast.success('Story updated successfully');
      navigate('/admin/stories');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to update story');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) return <Navigate to="/" replace />;
  if (loading) return <div className="flex h-40 items-center justify-center text-mist">Inapakia...</div>;

  const categoryName = categories.find(c => c.id === categoryId)?.name || 'Category';

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-2xl font-bold text-zinc-50">Edit Story</h1>
        <p className="mt-1 text-sm text-zinc-500">Hariri maelezo ya hadithi.</p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-4 xl:grid-cols-[1.5fr_1fr] xl:items-start">
        <div className="space-y-4">
          <AdminPanel title="Story details">
            <div className="space-y-4 p-4 sm:p-5">
              <div>
                <label htmlFor="story-title" className={labelClass}>Story title</label>
                <input id="story-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Siri ya Amina" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="story-hook" className={labelClass}>Hook (mstari mmoja)</label>
                <input id="story-hook" value={hook} onChange={e => setHook(e.target.value)} placeholder="Alijua alikuwa anadanganywa." className={inputClass} />
              </div>
              <div>
                <label htmlFor="story-desc" className={labelClass}>Description</label>
                <textarea id="story-desc" rows={6} value={description} onChange={e => setDescription(e.target.value)} placeholder="Maelezo ya hadithi..." className={cn(inputClass, 'resize-y leading-relaxed')} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="story-author" className={labelClass}>Author</label>
                  <select id="story-author" value={authorId} onChange={e => setAuthorId(e.target.value)} required className={inputClass}>
                    {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="story-cat" className={labelClass}>Category</label>
                  <select id="story-cat" value={categoryId} onChange={e => setCategoryId(e.target.value)} required className={inputClass}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="story-tags" className={labelClass}>Tags (comma-separated)</label>
                <input id="story-tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="Mapenzi, Drama, Usaliti" className={inputClass} />
              </div>
            </div>
          </AdminPanel>

          <AdminPanel title="Cover image">
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
              {coverPreview && (
                <img src={coverPreview} alt="Kielelezo cha jalada" className="h-40 w-[108px] shrink-0 rounded-md border border-zinc-800 object-cover" />
              )}
              <div className="flex flex-1 flex-col justify-center rounded-md border border-dashed border-zinc-700 px-4 py-6 text-center">
                <ImageIcon className="mx-auto h-6 w-6 text-zinc-600" aria-hidden="true" />
                <p className="mt-2 text-sm text-zinc-300">{coverPreview ? 'Badilisha jalada' : 'Upload cover art'}</p>
                <p className="mt-1 text-xs text-zinc-500">JPG au PNG · uwiano 2:3 · chini ya 400KB</p>
                <label className="mx-auto mt-3 cursor-pointer rounded-md border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:border-zinc-500">
                  Choose file
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            </div>
          </AdminPanel>
        </div>

        <div className="space-y-4">
          <AdminPanel title="Publishing">
            <div className="space-y-4 p-4 sm:p-5">
              <div>
                <label htmlFor="story-status" className={labelClass}>Status</label>
                <select id="story-status" value={status} onChange={e => setStatus(e.target.value)} className={inputClass}>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <label className="flex items-center gap-3 text-sm text-zinc-300">
                <input type="checkbox" checked={isOriginal} onChange={e => setIsOriginal(e.target.checked)} className="h-4 w-4 accent-[#C42B53]" />
                KISA Original
              </label>

              <label className="flex items-center gap-3 text-sm text-zinc-300">
                <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="h-4 w-4 accent-[#C42B53]" />
                Featured kwenye homepage
              </label>

              <div className="flex flex-col gap-2 border-t border-zinc-800 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex justify-center items-center gap-2 rounded-md bg-wine px-4 py-2.5 text-sm font-semibold text-cream hover:bg-wine-bright disabled:opacity-50">
                  {isSubmitting && <Loader2Icon className="h-4 w-4 animate-spin" />}
                  Update story
                </button>
              </div>
            </div>
          </AdminPanel>

          <AdminPanel title="Preview" description="Jinsi kadi itakavyoonekana kwa wasomaji">
            <div className="p-4 sm:p-5">
              <div className="w-[168px]">
                <div className="relative overflow-hidden rounded-card border border-line-soft">
                  <div className="aspect-[2/3] w-full bg-zinc-800 flex items-center justify-center">
                    {coverPreview ? (
                      <img src={coverPreview} alt="" aria-hidden="true" className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-zinc-700" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                  {isOriginal && (
                    <div className="absolute left-2 top-2">
                      <PremiumBadge />
                    </div>
                  )}
                </div>
                <p className="mt-2.5 font-display text-sm font-bold text-cream">
                  {title || 'Kichwa cha hadithi'}
                </p>
                <p className="text-xs text-mist">{categoryName} · Sehemu</p>
              </div>
            </div>
          </AdminPanel>
        </div>
      </form>
    </div>
  );
}
