import { useState } from "react";

interface Nicho {
  label: string;
  emoji: string;
  keywords: string[];
}

interface LinkItem {
  label: string;
  url: string;
}

interface Plataforma {
  id: string;
  nome: string;
  cor: string;
  bg: string;
  emoji: string;
  descricao: string;
  gerarLinks: (kws: string[]) => LinkItem[];
}

interface Dica {
  emoji: string;
  texto: string;
}

const NICHOS: Nicho[] = [
  { label: "Moda Feminina", emoji: "👗", keywords: ["moda feminina", "roupas femininas", "blusas vestidos"] },
  { label: "Calçados", emoji: "👟", keywords: ["calçados", "tênis sandálias", "sapatos femininos"] },
  { label: "Atacado", emoji: "🏭", keywords: ["atacado roupas", "revenda moda", "compra atacado vestuário"] },
  { label: "Brechó", emoji: "♻️", keywords: ["brechó", "roupas segunda mão", "brechó online"] },
  { label: "Plus Size", emoji: "💕", keywords: ["moda plus size", "roupas plus size", "moda inclusiva"] },
  { label: "Moda Masculina", emoji: "👔", keywords: ["moda masculina", "roupas masculinas", "streetwear"] },
  { label: "Infantil", emoji: "👶", keywords: ["moda infantil", "roupas infantis", "kids moda"] },
  { label: "Acessórios", emoji: "👜", keywords: ["bolsas acessórios moda", "cintos carteiras", "acessórios femininos"] },
];

const PLATAFORMAS: Plataforma[] = [
  {
    id: "google",
    nome: "Google",
    cor: "#4285f4",
    bg: "#4285f415",
    emoji: "🔍",
    descricao: "Links públicos indexados",
    gerarLinks: (kws: string[]): LinkItem[] => [
      { label: "Links de convite públicos", url: `https://www.google.com/search?q=${encodeURIComponent(`"chat.whatsapp.com" ${kws[0]}`)}` },
      { label: "Grupos em sites agregadores", url: `https://www.google.com/search?q=${encodeURIComponent(`grupo whatsapp ${kws[0]} site:participei.com.br OR site:whatsappgrupos.com`)}` },
      { label: "Posts com links de grupos", url: `https://www.google.com/search?q=${encodeURIComponent(`"entrar no grupo" whatsapp ${kws[0]}`)}` },
    ],
  },
  {
    id: "facebook",
    nome: "Facebook",
    cor: "#1877f2",
    bg: "#1877f215",
    emoji: "📘",
    descricao: "Grupos e comunidades ativas",
    gerarLinks: (kws: string[]): LinkItem[] => [
      { label: `Grupos: ${kws[0]}`, url: `https://www.facebook.com/search/groups/?q=${encodeURIComponent(kws[0])}` },
      { label: `Grupos: ${kws[1] ?? kws[0]}`, url: `https://www.facebook.com/search/groups/?q=${encodeURIComponent((kws[1] ?? kws[0]) + " brasil")}` },
      { label: "Posts com link de grupo WhatsApp", url: `https://www.facebook.com/search/posts/?q=${encodeURIComponent(`grupo whatsapp ${kws[0]}`)}` },
    ],
  },
  {
    id: "instagram",
    nome: "Instagram",
    cor: "#e1306c",
    bg: "#e1306c15",
    emoji: "📸",
    descricao: "Perfis e bios com links",
    gerarLinks: (kws: string[]): LinkItem[] => [
      { label: `#${kws[0].replace(/ /g, "")}`, url: `https://www.instagram.com/explore/tags/${encodeURIComponent(kws[0].replace(/ /g, ""))}` },
      { label: `Busca: ${kws[0]} grupo`, url: `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(kws[0] + " grupo whatsapp")}` },
      { label: `#grupowhatsapp${kws[0].split(" ")[0]}`, url: `https://www.instagram.com/explore/tags/${encodeURIComponent("grupowhatsapp" + kws[0].split(" ")[0])}` },
    ],
  },
  {
    id: "whatsapp",
    nome: "WhatsApp",
    cor: "#25d366",
    bg: "#25d36615",
    emoji: "💬",
    descricao: "Sites com grupos públicos listados",
    gerarLinks: (kws: string[]): LinkItem[] => [
      { label: "Participei.com.br — buscar grupos", url: `https://www.participei.com.br/grupos-de-whatsapp/${encodeURIComponent(kws[0].replace(/ /g, "-"))}` },
      { label: "WhatsAppGrupos.net — buscar grupos", url: `https://whatsappgrupos.net/?s=${encodeURIComponent(kws[0])}` },
      { label: "GruposWhats.com — buscar grupos", url: `https://www.gruposwhats.com/?s=${encodeURIComponent(kws[0])}` },
    ],
  },
  {
    id: "telegram",
    nome: "Telegram",
    cor: "#0088cc",
    bg: "#0088cc15",
    emoji: "✈️",
    descricao: "Canais que agregam links de grupos",
    gerarLinks: (kws: string[]): LinkItem[] => [
      { label: `Canais: ${kws[0]}`, url: `https://t.me/s/${encodeURIComponent(kws[0].replace(/ /g, ""))}` },
      { label: "Busca no Google por canais", url: `https://www.google.com/search?q=${encodeURIComponent(`site:t.me ${kws[0]} grupo whatsapp`)}` },
      { label: "Grupos de divulgação moda", url: `https://www.google.com/search?q=${encodeURIComponent(`telegram canal ${kws[0]} links grupos whatsapp`)}` },
    ],
  },
];

const DICAS: Dica[] = [
  { emoji: "✅", texto: "Leia as regras do grupo antes de postar" },
  { emoji: "✅", texto: "Apresente-se primeiro e interaja antes de divulgar" },
  { emoji: "✅", texto: "Poste nos horários permitidos pelo admin" },
  { emoji: "✅", texto: "Use fotos de qualidade dos seus produtos" },
  { emoji: "⛔", texto: "Não dispare a mesma mensagem em vários grupos de uma vez" },
  { emoji: "⛔", texto: "Não ignore as regras — banimento é permanente" },
];

export default function App() {
  const [nichoIdx, setNichoIdx] = useState<number | null>(null);
  const [customKeyword, setCustomKeyword] = useState<string>("");
  const [plataformaAtiva, setPlataformaAtiva] = useState<string>("google");
  const [copiado, setCopiado] = useState<number | null>(null);

  const nicho = nichoIdx !== null ? NICHOS[nichoIdx] : null;
  const keywords: string[] | null = nicho
    ? nicho.keywords
    : customKeyword
    ? [customKeyword, customKeyword + " brasil", customKeyword + " grupo"]
    : null;

  const plataforma = PLATAFORMAS.find((p) => p.id === plataformaAtiva) as Plataforma;
  const links: LinkItem[] = keywords ? plataforma.gerarLinks(keywords) : [];

  const copiarLink = (url: string, idx: number): void => {
    navigator.clipboard.writeText(url);
    setCopiado(idx);
    setTimeout(() => setCopiado(null), 1500);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f5f2", fontFamily: "'Georgia', 'Times New Roman', serif", color: "#1a1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .pill-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
        .link-card:hover { background: #fff !important; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transform: translateY(-1px); }
        .plat-btn:hover { opacity: 0.9; transform: scale(1.02); }
        a { text-decoration: none; }
      `}</style>

      <div style={{ background: "#1a1a1a", padding: "28px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>
            Caça Grupos <span style={{ color: "#d4a853" }}>Moda</span>
          </div>
          <div style={{ fontSize: 12, color: "#ffffff50", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
            Buscas otimizadas para encontrar grupos de vestuário
          </div>
        </div>
        <div style={{ background: "#25d36620", border: "1px solid #25d36640", borderRadius: 8, padding: "6px 14px", fontSize: 12, color: "#25d366", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
          🌱 100% Orgânico
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 24px" }}>

        {/* Step 1 */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: "#d4a853", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>
            01 — Escolha seu nicho
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
            {NICHOS.map((n, i) => (
              <button key={i} className="pill-btn" onClick={() => { setNichoIdx(i); setCustomKeyword(""); }}
                style={{ padding: "9px 18px", borderRadius: 100, border: "1.5px solid", borderColor: nichoIdx === i ? "#1a1a1a" : "#d0ccc5", background: nichoIdx === i ? "#1a1a1a" : "#fff", color: nichoIdx === i ? "#fff" : "#555", fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6 }}>
                {n.emoji} {n.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ height: 1, flex: 1, background: "#d0ccc5" }} />
            <span style={{ fontSize: 11, color: "#aaa", fontFamily: "'DM Sans', sans-serif" }}>ou digite seu nicho</span>
            <div style={{ height: 1, flex: 1, background: "#d0ccc5" }} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <input value={customKeyword} onChange={e => { setCustomKeyword(e.target.value); setNichoIdx(null); }}
              placeholder="Ex: moda praia, lingerie, uniformes..."
              style={{ flex: 1, padding: "11px 16px", border: "1.5px solid #d0ccc5", borderRadius: 10, fontSize: 14, fontFamily: "'DM Sans', sans-serif", background: "#fff", outline: "none", color: "#1a1a1a" }} />
          </div>
        </div>

        {/* Step 2 */}
        {keywords && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: "#d4a853", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>
              02 — Escolha onde buscar
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
              {PLATAFORMAS.map(p => (
                <button key={p.id} className="plat-btn" onClick={() => setPlataformaAtiva(p.id)}
                  style={{ padding: "14px 16px", borderRadius: 12, border: "2px solid", borderColor: plataformaAtiva === p.id ? p.cor : "#e0dbd4", background: plataformaAtiva === p.id ? p.bg : "#fff", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{p.emoji}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, color: plataformaAtiva === p.id ? p.cor : "#1a1a1a" }}>{p.nome}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#999", marginTop: 2 }}>{p.descricao}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {keywords && links.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: "#d4a853", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>
              03 — Buscas prontas para abrir
            </div>
            <div style={{ background: plataforma.bg, border: `1.5px solid ${plataforma.cor}30`, borderRadius: 14, padding: "6px 0", overflow: "hidden" }}>
              {links.map((link, i) => (
                <div key={i} className="link-card"
                  style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, borderBottom: i < links.length - 1 ? "1px solid #e8e4de" : "none", transition: "all 0.15s", background: "transparent", cursor: "default" }}>
                  <div style={{ width: 32, height: 32, flexShrink: 0, background: plataforma.bg, border: `1px solid ${plataforma.cor}30`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                    {plataforma.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, color: "#1a1a1a", marginBottom: 2 }}>{link.label}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#aaa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{decodeURIComponent(link.url).slice(0, 70)}...</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer"
                      style={{ padding: "7px 14px", background: plataforma.cor, borderRadius: 8, color: "#fff", fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                      Abrir →
                    </a>
                    <button onClick={() => copiarLink(link.url, i)}
                      style={{ padding: "7px 12px", background: "#f0ece6", border: "1px solid #d0ccc5", borderRadius: 8, color: "#555", fontSize: 12, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                      {copiado === i ? "✓" : "📋"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: "12px 16px", background: "#fff8ec", border: "1px solid #f0d080", borderRadius: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#8a6a00", lineHeight: 1.6 }}>
              💡 <strong>Dica:</strong> Abra cada busca, explore os resultados e salve manualmente os links de grupos que parecerem ativos e relevantes pro seu nicho.
            </div>
          </div>
        )}

        {/* Dicas */}
        <div style={{ background: "#fff", border: "1.5px solid #e8e4de", borderRadius: 16, padding: "24px" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#1a1a1a" }}>
            Boas práticas para vender organicamente
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 8 }}>
            {DICAS.map((d, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", background: d.emoji === "✅" ? "#f0faf4" : "#fff5f5", borderRadius: 8, border: `1px solid ${d.emoji === "✅" ? "#b8e8c8" : "#fcc"}` }}>
                <span style={{ fontSize: 14 }}>{d.emoji}</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#333", lineHeight: 1.5 }}>{d.texto}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
