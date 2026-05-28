/**
 * @file supabase.ts
 * @description Server-side Supabase client.
 *
 * Uses the SERVICE_ROLE_KEY (never shipped to the browser — only used in
 * API routes and server components). If you add client-side Supabase calls
 * later, create a separate client using NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./supabase.types";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  // Soft-warn at module load time — the API route will handle the null client gracefully.
  console.warn(
    "[supabase] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. " +
      "Recommendations will fall back to hardcoded data."
  );
}

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient<Database>(supabaseUrl, supabaseKey)
    : null;
