/**
 * auth.ts — All Supabase Auth operations in one place.
 * Components should import from here, never call supabase.auth directly.
 */
import { supabase } from './supabase'
import type { Database } from './database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']

// ─── Sign Up ─────────────────────────────────────────────────────────────────
export async function signUp(
  email: string,
  password: string,
  name: string,
  referralCode?: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name.trim(),
        referred_by: referralCode ?? null,
      },
    },
  })
  if (error) throw error
  return data
}

// ─── Sign In ─────────────────────────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

// ─── Sign Out ────────────────────────────────────────────────────────────────
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// ─── Password Reset ──────────────────────────────────────────────────────────
export async function requestPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/#/reset-password`,
  })
  if (error) throw error
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}

// ─── Profile ─────────────────────────────────────────────────────────────────
export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function updateProfile(
  userId: string,
  updates: Database['public']['Tables']['profiles']['Update']
) {
  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
  if (error) throw error
}

// ─── Staff Role ───────────────────────────────────────────────────────────────
export async function getStaffRole(userId: string): Promise<string | null> {
  const { data } = await supabase
    .from('staff_roles')
    .select('role')
    .eq('user_id', userId)
    .single()
  return data?.role ?? null
}

// ─── Session ─────────────────────────────────────────────────────────────────
export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}
