// src/profile.ts

import { supabase } from "../supabaseClient";

// Structure definition for a remote session profile
export interface RemoteSessionData {
  sessionId: string;
  password?: string;
  spores?: any[];
  fusionPages?: any[];
  stats?: Record<string, any>;
  [key: string]: any;
}

// Main profile fetcher by session ID and optional password
export async function getProfile(sessionId: string, password?: string): Promise<RemoteSessionData | null> {
  try {
    let query = supabase
      .from("spore_profiles")
      .select("*")
      .eq("sessionId", sessionId);

    if (password) {
      query = query.eq("password", password);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      console.warn("Profile fetch failed:", error?.message || "No data");
      return null;
    }

    return data as RemoteSessionData;

  } catch (err) {
    console.error("Unexpected error in getProfile:", err);
    return null;
  }
}
