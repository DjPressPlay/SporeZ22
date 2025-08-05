// src/profile.ts
import { supabase } from "../supabaseClient";

// Define the structure of a remote session profile
export interface RemoteSessionData {
  sessionId: string;
  password?: string;
  spores?: any[];
  fusionPages?: any[];
  stats?: Record<string, any>;
  [key: string]: any;
}

// Fetch a profile by sessionId (and optional password)
export async function fetchRemoteSession(sessionId: string, password?: string): Promise<RemoteSessionData | null> {
  const query = supabase
    .from("spore_profiles")
    .select("*")
    .eq("sessionId", sessionId);

  // Only include password check if one is provided
  if (password) {
    query.eq("password", password);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    console.warn("No matching profile found");
    return null;
  }

  return data as RemoteSessionData;
}
