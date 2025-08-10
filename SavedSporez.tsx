// src/SavedSporez.tsx  (adjust the import path if this file isn't inside /src)
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type Spore = { slug: string; url: string };

const SITE_BASE =
  import.meta.env.VITE_PUBLIC_BASE_URL || window.location.origin;

export default function SavedSporez() {
  const [spores, setSpores] = useState<Spore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const sessionId = sessionStorage.getItem("session_id") || null;

      // Query your existing profiles table for short links
      let query = supabase
        .from("profiles")
        .select("short_code, target_url")
        .eq("type", "short_link")
        .order("created_at", { ascending: false });

      if (sessionId) query = query.eq("session_id", sessionId);

      const { data, error } = await query;

      if (!error && data) {
        setSpores(
          data.map((r: any) => ({
            slug: r.short_code,
            url: r.target_url,
          }))
        );
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <p style={{ opacity: 0.5 }}>Loading…</p>;
  if (spores.length === 0) return <p style={{ opacity: 0.5 }}>🧬 No saved Sporez yet.</p>;

  return (
    <div style={{ width: "100%", maxWidth: 600 }}>
      <h2>Saved Sporez</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {spores.map(({ slug, url }) => (
          <li
            key={slug}
            style={{
              marginBottom: "1rem",
              background: "#001a26",
              padding: "1rem",
              borderRadius: "10px",
              border: "1px solid #00f0ff88",
            }}
          >
            {/* Target URL (destination) */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#00ff88", wordBreak: "break-all" }}
            >
              {url}
            </a>
            <br />
            {/* Short link hosted on your site */}
            <small style={{ color: "#00f0ff" }}>
              Short Link:{" "}
              <a
                href={`${SITE_BASE}/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#00ffcc" }}
              >
                {SITE_BASE}/{slug}
              </a>
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
