// lib/supabaseClient.js
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Function to create a new Supabase client per request
export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseKey);
};

// Or, if you want a single exported instance (simpler for most frontend usage)
export const supabase = createBrowserClient(supabaseUrl, supabaseKey);
