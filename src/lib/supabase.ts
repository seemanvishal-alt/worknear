/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common operations

/**
 * Sign up a new user with email and password
 */
export async function signUpWithEmail(email: string, password: string, metadata?: any) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  return { data, error };
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // The app is a single-page application; Supabase restores the session on
      // the root page after Google redirects back.
      redirectTo: window.location.origin,
    },
  });
  return { data, error };
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

/**
 * Get the current session
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

/**
 * Database helpers
 */

// Example: Save user profile
export async function saveUserProfile(userId: string, profile: any) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...profile });
  return { data, error };
}

// Example: Get user profile
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

// Example: Save job posting
export async function saveJobPosting(job: any) {
  const { data, error } = await supabase
    .from('jobs')
    .insert(job);
  return { data, error };
}

// Example: Get all jobs
export async function getJobs(filters?: any) {
  let query = supabase.from('jobs').select('*');
  
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }
  
  const { data, error } = await query;
  return { data, error };
}

// Example: Save candidate profile
export async function saveCandidateProfile(candidate: any) {
  const { data, error } = await supabase
    .from('candidates')
    .insert(candidate);
  return { data, error };
}

// Example: Get candidates
export async function getCandidates(filters?: any) {
  let query = supabase.from('candidates').select('*');
  
  if (filters?.skills) {
    query = query.contains('skills', filters.skills);
  }
  
  const { data, error } = await query;
  return { data, error };
}

export default supabase;
