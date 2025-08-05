import { supabase } from "../supabaseClient";

export interface ProfileData {
  sessionId: string;
  password: string;
  spores?: any[];
  fusionPages?: any[];
  stats?: Record<string, any>;
  [key: string]: any;
}

export async function getProfile(sessionId: string, password: string): Promise<ProfileData | null> {
  const { data, error } = await supabase
    .from("spore_profiles")
    .select("*")
    .match({ sessionId, password })
    .single();

  if (error || !data) {
    console.warn("❌ Invalid session or password");
    return null;
  }

  return data as ProfileData;
}
