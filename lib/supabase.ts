import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize the Supabase client
// For GitHub Pages (static site), these must be embedded during build via process.env
export const supabase = createClient(supabaseUrl || 'http://placeholder.url', supabaseAnonKey || 'placeholder.key');
