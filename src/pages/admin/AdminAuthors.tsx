import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2Icon, PlusIcon, XIcon, UserIcon } from 'lucide-react';
import { AdminPanel, AdminTable, Td } from '../../components/admin/AdminTable';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { toast } from 'sonner';

export function AdminAuthors() {
  const { isAdmin } = useAuth();
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    loadAuthors();
  }, [isAdmin]);

  async function loadAuthors() {
    if (!isAdmin) return;
    try {
      const { data, error } = await supabase
        .from('authors')
        .select('*, stories(count)')
        .order('name');

      if (error) throw error;
      setAuthors(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load authors');
    } finally {
      setLoading(false);
    }
  }

  const openModal = (author: any = null) => {
    if (author) {
      setEditingId(author.id);
      setName(author.name);
      setBio(author.bio || '');
      setAvatarUrl(author.avatar_url || '');
    } else {
      setEditingId(null);
      setName('');
      setBio('');
      setAvatarUrl('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { name, bio, avatar_url: avatarUrl };
      if (editingId) {
        const { error } = await supabase.from('authors').update(payload).eq('id', editingId);
        if (error) throw error;
        toast.success('Author updated');
      } else {
        const { error } = await supabase.from('authors').insert(payload);
        if (error) throw error;
        toast.success('Author created');
      }
      setIsModalOpen(false);
      loadAuthors();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save author');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this author?')) return;
    try {
      const { error } = await supabase.from('authors').delete().eq('id', id);
      if (error) throw error;
      toast.success('Author deleted');
      setAuthors(authors.filter(a => a.id !== id));
    } catch (err) {
      toast.error('Failed to delete author');
    }
  };

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="space-y-5 relative">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-50">Authors</h1>
          <p className="mt-1 text-sm text-zinc-500">Manage writers</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 rounded-md bg-wine px-4 py-2 text-sm font-semibold text-cream transition-colors duration-150 ease-kisa hover:bg-wine-bright">
          <PlusIcon className="h-4 w-4" />
          Add Author
        </button>
      </header>

      <AdminPanel title="All Authors">
        {loading ? (
          <div className="flex h-40 justify-center items-center">
            <Loader2Icon className="h-6 w-6 animate-spin text-wine" />
          </div>
        ) : (
          <AdminTable columns={['Author', 'Bio', 'Stories', 'Joined', 'Actions']}>
            {authors.map((a) => (
              <tr key={a.id} className="hover:bg-zinc-900/50">
                <Td>
                  <div className="flex items-center gap-3">
                    {a.avatar_url ? (
                      <img src={a.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800">
                        <UserIcon className="h-4 w-4 text-zinc-400" />
                      </div>
                    )}
                    <span className="font-medium text-zinc-100">{a.name}</span>
                  </div>
                </Td>
                <Td>
                  <span className="line-clamp-1 max-w-xs">{a.bio || '-'}</span>
                </Td>
                <Td className="tabular-nums">{a.stories?.[0]?.count || 0}</Td>
                <Td className="text-zinc-500">{new Date(a.created_at).toLocaleDateString()}</Td>
                <Td>
                  <div className="flex flex-wrap gap-1.5">
                    <button onClick={() => openModal(a)} className="rounded border border-zinc-700 px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:border-zinc-500 hover:text-zinc-50">Edit</button>
                    <button onClick={() => handleDelete(a.id)} className="rounded border border-zinc-700 px-2.5 py-1 text-[11px] font-medium text-red-400 hover:border-red-500 hover:text-red-300">Delete</button>
                  </div>
                </Td>
              </tr>
            ))}
            {authors.length === 0 && (
              <tr><Td colSpan={5} className="text-center py-4">No authors found</Td></tr>
            )}
          </AdminTable>
        )}
      </AdminPanel>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-[#131415] shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <h2 className="font-display text-lg font-bold text-zinc-50">{editingId ? 'Edit Author' : 'Add Author'}</h2>
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
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">Avatar URL</label>
                <input
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500">Bio</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full resize-none rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-md bg-wine px-4 py-2.5 text-sm font-semibold text-cream hover:bg-wine-bright">
                  Save Author
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}