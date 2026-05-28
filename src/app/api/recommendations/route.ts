/**
 * @file app/api/recommendations/route.ts
 * @description GET /api/recommendations
 *
 * Returns all active recommendations ordered by sort_order ASC.
 * If Supabase is not configured (missing env vars) returns an empty array —
 * the client component falls back to hardcoded data in that case.
 *
 * Response shape: { data: Recommendation[] }
 */

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Database, Recommendation } from "@/lib/supabase.types";

type RecommendationRow = Database["public"]["Tables"]["recommendations"]["Row"];

export const revalidate = 60; // ISR — cache for 60 s, auto-refresh in background

export async function GET() {
  if (!supabase) {
    // Supabase not configured — return empty so client falls back to hardcoded
    return NextResponse.json({ data: [] });
  }

  const { data, error } = await supabase
    .from("recommendations")
    .select("name, role, quote, linkedin_url, image_url, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true }) as {
      data: Pick<RecommendationRow, "name" | "role" | "quote" | "linkedin_url" | "image_url" | "sort_order">[] | null;
      error: { message: string } | null;
    };

  if (error) {
    console.error("[/api/recommendations] Supabase error:", error.message);
    return NextResponse.json({ data: [] }, { status: 500 });
  }

  // Map DB column names → UI shape
  const recommendations: Recommendation[] = (data ?? []).map((row) => ({
    name: row.name,
    role: row.role,
    quote: row.quote,
    linkedIn: row.linkedin_url,
    ...(row.image_url ? { image: row.image_url } : {}),
  }));

  return NextResponse.json({ data: recommendations });
}
