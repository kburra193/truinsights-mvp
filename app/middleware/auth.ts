// app/middleware/auth.ts
import { supabase } from '@/lib/supabase';

export async function checkAuth() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    return null;
  }
}

export async function requireAuth() {
  const user = await checkAuth();
  if (!user) {
    return null;
  }
  return user;
}