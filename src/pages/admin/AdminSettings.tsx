import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2Icon, UserIcon } from 'lucide-react';
import { AdminPanel } from '../../components/admin/AdminTable';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { toast } from 'sonner';
import { cn } from '../../utils/cn';

const inputClass =
  'w-full rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none';
const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-zinc-500';

export function AdminSettings() {
  const { user, profile, isAdmin } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || '');
      setEmail(profile.email || '');
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: name, email })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header>
        <h1 className="font-display text-2xl font-bold text-zinc-50">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage your admin profile and platform settings</p>
      </header>

      <AdminPanel title="Admin Profile">
        <form onSubmit={handleUpdateProfile} className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
              <UserIcon className="h-8 w-8" />
            </div>
            <div>
              <p className="font-medium text-zinc-100">{profile?.full_name}</p>
              <p className="text-sm text-zinc-500">{profile?.role}</p>
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelClass}>Full Name</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>
          
          <div className="border-t border-zinc-800 pt-4 mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex justify-center items-center gap-2 rounded-md bg-wine px-4 py-2.5 text-sm font-semibold text-cream hover:bg-wine-bright disabled:opacity-50">
              {isSubmitting && <Loader2Icon className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </AdminPanel>

      <AdminPanel title="Platform Settings" description="UI only - settings placeholder">
        <div className="p-4 sm:p-5 space-y-4 opacity-75 pointer-events-none">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Site Name</label>
              <input value="KISA Story Platform" readOnly className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Support Email</label>
              <input value="support@kisa.co.tz" readOnly className={inputClass} />
            </div>
          </div>
        </div>
      </AdminPanel>
    </div>
  );
}