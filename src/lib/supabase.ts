// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// ✅ TEMPORARY - Hardcode for Vercel deployment
// Once working, switch back to environment variables
const supabaseUrl = 'https://ucyyxukvxkouvwlvzhnb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjeXl4dWt2eGtvdXZ3bHZ6aG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2OTIyMjksImV4cCI6MjEwMjI2ODIyOX0.1H9tW-xA9G4vtTIXEWjtFyVAUtsxHjion5pff8OvvLw';

// ✅ Keep this for debugging
console.log('🔍 Supabase URL:', supabaseUrl);
console.log('🔍 Supabase ANON Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});