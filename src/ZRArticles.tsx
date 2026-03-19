// src/ZRArticles.tsx
// Zetsu Router Articles — public feed pulled from Supabase zr_articles table
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

type Article = {
  id: string;
  title: string;
  slug: string;
  html: string;
  niche: string;
  type: string;
  word_count: number;
  aff_count: number;
  source_url: string;
  published_at: string;
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function nicheColor(niche: string) {
  const map: Record<string, string> = {
    tech: "var(--n-cyan)", marketing: "var(--n-purple)", fitness: "var(--n-green)",
    finance: "var(--n-rose)", education: "var(--n-blue)", lifestyle: "var(--n-pink)",
    ecommerce: "var(--n-green)", business: "var(--n-cyan)",
  };
  return map[niche?.toLowerCase()] || "var(--n-purple)";
}

// ── ARTICLE READER VIEW ──
function ArticleReader({ article, onBack }: { article: Article; onBack: () => void }) {
  return (
    <div style={{ width: "100%", maxWidth: 780, margin: "0 auto" }}>
      <button
        className="blk r10"
        onClick={onBack}
        style={{
          background: "#0a0016", color: "var(--n-cyan)", border: "1px solid var(--n-cyan)",
          padding: "0.5rem 1.2rem", cursor: "pointer", marginBottom: "1.25rem",
          fontSize: "0.85rem", fontWeight: 700, letterSpacing: "1px",
        }}
      >
        ← Back to Articles
      </button>

      <div
        className="blk r14"
        style={{
          background: "linear-gradient(180deg,#070015,#00111a)",
          padding: "2rem",
          boxShadow: "0 18px 48px var(--glow-pink), 0 0 0 1px var(--glow-cyan) inset",
        }}
      >
        {/* Meta bar */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem", alignItems: "center" }}>
          <span style={{
            background: "rgba(0,0,0,0.4)", border: `1px solid ${nicheColor(article.niche)}`,
            color: nicheColor(article.niche), fontSize: "0.68rem", letterSpacing: "2px",
            padding: "3px 10px", textTransform: "uppercase", fontFamily: "monospace",
          }}>
            {article.niche || "general"}
          </span>
          <span style={{
            background: "rgba(0,0,0,0.4)", border: "1px solid rgba(155,92,255,.3)",
            color: "var(--n-purple)", fontSize: "0.68rem", letterSpacing: "2px",
            padding: "3px 10px", textTransform: "uppercase", fontFamily: "monospace",
          }}>
            {article.type}
          </span>
          <span style={{ color: "rgba(207,230,255,0.4)", fontSize: "0.75rem", marginLeft: "auto" }}>
            {article.word_count} words · {timeAgo(article.published_at)}
          </span>
        </div>

        {/* Article HTML */}
        <div
          className="zr-article-body"
          dangerouslySetInnerHTML={{ __html: article.html }}
        />

        {/* Source link */}
        {article.source_url && (
          <div style={{
            marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,47,209,.2)",
            fontSize: "0.78rem", color: "rgba(207,230,255,0.4)",
          }}>
            Source:{" "}
            <a href={article.source_url} target="_blank" rel="noopener noreferrer"
              style={{ color: "var(--n-cyan)" }}>
              {article.source_url}
            </a>
          </div>
        )}
      </div>

      <style>{`
        .zr-article-body { color: rgba(207,230,255,0.85); font-size: 0.95rem; line-height: 1.85; }
        .zr-article-body h1 { font-size: 1.8rem; color: #fff; margin-bottom: 1rem; line-height: 1.15; }
        .zr-article-body h2 { font-size: 1.25rem; color: var(--n-cyan); margin: 2rem 0 0.75rem; letter-spacing: 1px; }
        .zr-article-body h3 { font-size: 1rem; font-weight: 700; color: var(--n-purple); margin: 1.5rem 0 0.5rem; }
        .zr-article-body p { margin-bottom: 1rem; color: rgba(207,230,255,0.75); }
        .zr-article-body strong { color: #fff; font-weight: 700; }
        .zr-article-body a { color: var(--n-cyan); text-decoration: none; }
        .zr-article-body a:hover { text-decoration: underline; }
        .zr-article-body ul, .zr-article-body ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .zr-article-body li { color: rgba(207,230,255,0.7); margin-bottom: 0.4rem; }
        .zr-article-body blockquote {
          border-left: 3px solid var(--n-cyan); padding: 0.75rem 1rem;
          background: rgba(0,231,255,0.05); margin: 1.5rem 0;
          color: rgba(207,230,255,0.6); font-style: italic;
        }
        .zr-article-body .aff-link {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,107,53,0.12); border: 1px solid rgba(255,107,53,0.3);
          color: #ff6b35; padding: 2px 10px; font-size: 0.82rem; border-radius: 3px;
          text-decoration: none !important;
        }
        .zr-article-body .seo-block {
          background: rgba(0,162,255,0.06); border: 1px solid rgba(0,162,255,0.2);
          border-left: 3px solid var(--n-blue); padding: 1rem 1.25rem; margin-top: 2rem;
          font-size: 0.8rem;
        }
        .zr-article-body .seo-block-title {
          font-family: monospace; font-size: 0.62rem; letter-spacing: 2px;
          color: var(--n-blue); text-transform: uppercase; margin-bottom: 0.75rem;
        }
        .zr-article-body .seo-row { display: flex; gap: 8px; margin-bottom: 6px; }
        .zr-article-body .seo-key { color: rgba(207,230,255,0.4); min-width: 140px; font-family: monospace; font-size: 0.72rem; flex-shrink: 0; }
        .zr-article-body .seo-val { color: rgba(207,230,255,0.85); }
      `}</style>
    </div>
  );
}

// ── ARTICLE CARD ──
function ArticleCard({ article, onClick }: { article: Article; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const nc = nicheColor(article.niche);

  // Strip HTML for preview text
  const preview = article.html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160) + "...";

  return (
    <li
      className="blk r14"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        background: "linear-gradient(180deg,#070015,#00111a)",
        padding: "1.25rem",
        boxShadow: hovered
          ? `0 20px 50px var(--glow-pink), 0 0 0 1px ${nc}55 inset`
          : "0 12px 30px var(--glow-purp), 0 0 0 1px var(--glow-cyan) inset",
        transform: hovered ? "translateY(-3px)" : "none",
        transition: "all .2s ease",
        listStyle: "none",
        textAlign: "left",
      }}
    >
      {/* Niche + type badges */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{
          border: `1px solid ${nc}`, color: nc,
          fontSize: "0.62rem", letterSpacing: "2px", padding: "2px 8px",
          textTransform: "uppercase", fontFamily: "monospace",
          background: "rgba(0,0,0,0.4)",
        }}>
          {article.niche || "general"}
        </span>
        <span style={{
          border: "1px solid rgba(155,92,255,.35)", color: "var(--n-purple)",
          fontSize: "0.62rem", letterSpacing: "2px", padding: "2px 8px",
          textTransform: "uppercase", fontFamily: "monospace",
          background: "rgba(0,0,0,0.4)",
        }}>
          {article.type}
        </span>
        <span style={{ marginLeft: "auto", fontSize: "0.72rem", color: "rgba(207,230,255,0.35)" }}>
          {timeAgo(article.published_at)}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        margin: "0 0 0.5rem", fontSize: "1.05rem", fontWeight: 800,
        color: hovered ? "var(--n-cyan)" : "#fff",
        transition: "color .2s", lineHeight: 1.35,
      }}>
        {article.title}
      </h3>

      {/* Preview */}
      <p style={{ margin: "0 0 0.9rem", fontSize: "0.82rem", color: "rgba(207,230,255,0.5)", lineHeight: 1.65 }}>
        {preview}
      </p>

      {/* Footer */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderTop: "1px solid rgba(255,47,209,.15)", paddingTop: "0.75rem",
        fontSize: "0.72rem", color: "rgba(207,230,255,0.35)", fontFamily: "monospace",
      }}>
        <span>{article.word_count} words</span>
        {article.aff_count > 0 && <span style={{ color: "#ff6b35" }}>🔗 {article.aff_count} aff. links</span>}
        <span style={{ color: "var(--n-cyan)" }}>Read →</span>
      </div>
    </li>
  );
}

// ── MAIN COMPONENT ──
export default function ZRArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Article | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("zr_articles")
        .select("id,title,slug,html,niche,type,word_count,aff_count,source_url,published_at")
        .order("published_at", { ascending: false })
        .limit(50);

      if (err) {
        setError("Could not load articles. Make sure the zr_articles table exists in Supabase.");
      } else {
        setArticles(data || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  // Filter + search
  const niches = ["all", ...Array.from(new Set(articles.map(a => a.niche).filter(Boolean)))];
  const filtered = articles.filter(a => {
    const matchNiche = filter === "all" || a.niche === filter;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
    return matchNiche && matchSearch;
  });

  if (selected) {
    return <ArticleReader article={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div style={{ width: "100%", maxWidth: 780, margin: "0 auto" }}>

      {/* Header */}
      <div
        className="blk-inset r10"
        style={{
          marginBottom: "1.25rem", padding: "1rem 1.25rem",
          background: "#0a0016", borderBottom: "1px solid rgba(255,47,209,.3)",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "1.4rem" }}>
            <span className="txt-neon">Zetsu Router</span>
            <span style={{ color: "rgba(207,230,255,0.4)", fontSize: "1rem", marginLeft: "0.5rem" }}>
              // Articles
            </span>
          </h2>
          <div style={{ fontSize: "0.72rem", color: "rgba(207,230,255,0.35)", marginTop: "4px", fontFamily: "monospace", letterSpacing: "1px" }}>
            {articles.length} articles published · auto-generated from Skool
          </div>
        </div>
        <div style={{
          fontFamily: "monospace", fontSize: "0.65rem", letterSpacing: "2px",
          color: "var(--n-green)", border: "1px solid rgba(0,255,133,.25)",
          padding: "4px 12px", background: "rgba(0,255,133,.07)", textTransform: "uppercase",
        }}>
          ● Live Feed
        </div>
      </div>

      {/* Search + filter */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <input
          className="blk r10"
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 160, padding: "0.6rem 1rem",
            background: "#0a0016", color: "var(--txt)", fontSize: "0.85rem",
            outline: "none", border: "1px solid rgba(0,231,255,.25)",
          }}
        />
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {niches.map(n => (
            <button
              key={n}
              onClick={() => setFilter(n)}
              className="blk r10"
              style={{
                padding: "0.5rem 0.9rem", cursor: "pointer", fontSize: "0.72rem",
                fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
                background: filter === n ? "rgba(0,231,255,.12)" : "#0a0016",
                color: filter === n ? "var(--n-cyan)" : "rgba(207,230,255,0.45)",
                border: filter === n ? "1px solid var(--n-cyan)" : "1px solid rgba(207,230,255,.12)",
                transition: "all .15s",
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* States */}
      {loading && (
        <div style={{ textAlign: "center", padding: "3rem", color: "rgba(207,230,255,0.4)" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>🧬</div>
          <div style={{ fontFamily: "monospace", fontSize: "0.8rem", letterSpacing: "2px" }}>
            Loading articles...
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="blk r10" style={{
          padding: "1.25rem", background: "rgba(255,60,95,.08)",
          border: "1px solid rgba(255,60,95,.25)", color: "#ff4560",
          fontFamily: "monospace", fontSize: "0.82rem", lineHeight: 1.7,
        }}>
          <strong>Setup needed:</strong><br />{error}<br /><br />
          Run this in your Supabase SQL editor:<br />
          <code style={{ color: "var(--n-cyan)", fontSize: "0.75rem" }}>
            create table zr_articles (id uuid default gen_random_uuid() primary key, title text, slug text unique, html text, raw text, niche text, type text, word_count int, aff_count int, source_url text, published_at timestamptz default now());
          </code>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "rgba(207,230,255,0.35)" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem", opacity: 0.4 }}>📄</div>
          <div style={{ fontFamily: "monospace", fontSize: "0.8rem", letterSpacing: "1px" }}>
            {search || filter !== "all" ? "No articles match your filter." : "No articles yet — publish from Zetsu Router to see them here."}
          </div>
        </div>
      )}

      {/* Article grid */}
      {!loading && !error && filtered.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 14 }}>
          {filtered.map(a => (
            <ArticleCard key={a.id} article={a} onClick={() => setSelected(a)} />
          ))}
        </ul>
      )}
    </div>
  );
}
