import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2Icon, PlusIcon, XIcon } from 'lucide-react';
import { AdminPanel, AdminTable, Td } from '../../components/admin/AdminTable';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { toast } from 'sonner';

export function AdminCategories() {
  const { isAdmin } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadCategories();
  }, [isAdmin]);

  async function loadCategories() {
    if (!isAdmin) return;
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*, stories(count)')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (!editingId) {
      setSlug(generateSlug(e.target.value));
    }
  };

  const openModal = (category: any = null) => {
    if (category) {
      setEditingId(category.id);
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description || '');
    } else {
      setEditingId(null);
      setName('');
      setSlug('');
      setDescription('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { name, slug, description };
      if (editingId) {
        const { error } = await supabase.from('categories').update(payload).eq('id', editingId);
        if (error) throw error;
        toast.success('Category updated');
      } else {
        const { error } = await supabase.from('categories').insert(payload);
        if (error) throw error;
        toast.success('Category created');
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      toast.success('Category deleted');
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      toast.error('Failed to delete category');
    }
  };

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="space-y-5 relative">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">Categories</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage story genres and categories</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 rounded-md bg-wine px-4 py-2 text-sm font-semibold text-cream transition-colors duration-150 ease-kisa hover:bg-wine-bright">
          <PlusIcon className="h-4 w-4" />
          Add Category
        </button>
      </header>

      <AdminPanel title="All Categories">
        {loading ? (
          <div className="flex h-40 justify-center items-center">
            <Loader2Icon className="h-6 w-6 animate-spin text-wine" />
          </div>
        ) : (
          <AdminTable columns={['Name', 'Slug', 'Description', 'Stories', 'Actions']}>
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-900/50">
                <Td className="font-medium text-zinc-100">{c.name}</Td>
                <Td className="font-mono text-xs text-zinc-500">{c.slug}</Td>
                <Td>
                  <span className="line-clamp-1 max-w-xs">{c.description || '-'}</span>
                </Td>
                <Td className="tabular-nums">{c.stories?.[0]?.count || 0}</Td>
                <Td>
                  <div className="flex flex-wrap gap-1.5">
                    <button onClick={() => openModal(c)} className="rounded border border-zinc-700 px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:border-zinc-500 hover:text-zinc-50">Edit</button>
                    <button onClick={() => handleDelete(c.id)} className="rounded border border-zinc-700 px-2.5 py-1 text-[11px] font-medium text-red-400 hover:border-red-500 hover:text-red-300">Delete</button>
                  </div>
                </Td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><Td colSpan={5} className="text-center py-4">No categories found</Td></tr>
            )}
          </AdminTable>
        )}
      </AdminPanel>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-[#131415] shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <h2 className="font-display text-lg font-bold text-zinc-50">{editingId ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-100">
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">Name</label>
                <input
                  required
                  value={name}
                  onChange={handleNameChange}
                  className="w-full rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">Slug</label>
                <input
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full resize-none rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-md bg-wine px-4 py-2.5 text-sm font-semibold text-cream hover:bg-wine-bright">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}