import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('Supabase env vars are not set. The user counter and waitlist will be disabled until you add them.')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
