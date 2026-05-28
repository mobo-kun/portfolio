/**
 * @file supabase.types.ts
 * @description Minimal hand-written types for the Supabase tables used by this app.
 *
 * Run `npx supabase gen types typescript` after connecting the CLI to auto-generate
 * a full types file. Until then, these manual types are sufficient.
 */

export type Database = {
  public: {
    Tables: {
      recommendations: {
        Row: {
          id: number;
          name: string;
          role: string;
          quote: string;
          linkedin_url: string;
          image_url: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["recommendations"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["recommendations"]["Insert"]>;
      };
    };
  };
};

/** Shaped recommendation as used by the UI component */
export type Recommendation = {
  name: string;
  role: string;
  quote: string;
  linkedIn: string;
  image?: string;
};
