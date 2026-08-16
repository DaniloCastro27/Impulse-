import React, { useState, useEffect, useRef } from "react";
import {
  Zap, Home, Layers, BookOpen, Trophy, User, LogOut,
  ChevronRight, ChevronLeft, RotateCw, Check, X, Clock,
  Flame, Star, Mail, Lock, ArrowRight, Sparkles, Loader2,
  Library, Download, GraduationCap, FileText, BookMarked,
  Landmark, Calculator, FlaskConical, CheckCircle2, Circle,
  PenTool, AlignLeft, AlertTriangle, Flag, XCircle, ListChecks,
  ArrowLeft, Lightbulb, Atom,
} from "lucide-react";
import * as api from "./api";
import { getSocket } from "./socket";

/* ---------------------------------------------------------------
   IMPULSE+ — frontend conectado ao backend real (SQLite + Socket.IO)
   Token system:
   bg #0F0E2E · surface #161447 · surface2 #211D5E
   accent #29F0C9 · amber #FFB627 · ink #F3F1FF · inkDim #9C9AD6
------------------------------------------------------------------*/

const COLORS = {
  bg: "#0F0E2E", surface: "#161447", surface2: "#211D5E",
  accent: "#29F0C9", accentDim: "#1BA98F", amber: "#FFB627",
  ink: "#F3F1FF", inkDim: "#9C9AD6", danger: "#FF5C7A",
};

const OPTION_COLORS = ["#29F0C9", "#FFB627", "#FF5C7A", "#8C7CFF"];

const BG_KEYFRAMES = `
@keyframes floatSlow { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-22px) rotate(6deg); } }
@keyframes floatSlow2 { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(18px) rotate(-8deg); } }
@keyframes driftBlob { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-20px) scale(1.08); } }
@keyframes driftBlob2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-25px,25px) scale(1.05); } }
`;

const FLOATING_BOOKS = [
  { Icon: BookOpen, top: "8%", left: "6%", size: 34, dur: "9s", anim: "floatSlow" },
  { Icon: GraduationCap, top: "18%", left: "88%", size: 40, dur: "11s", anim: "floatSlow2" },
  { Icon: BookMarked, top: "62%", left: "4%", size: 30, dur: "10s", anim: "floatSlow2" },
  { Icon: FileText, top: "80%", left: "82%", size: 28, dur: "8s", anim: "floatSlow" },
  { Icon: BookOpen, top: "40%", left: "94%", size: 24, dur: "12s", anim: "floatSlow" },
  { Icon: Sparkles, top: "72%", left: "48%", size: 22, dur: "9s", anim: "floatSlow2" },
];

function StudentIllustration({ size = 340, opacity = 1 }) {
  return (
    <svg viewBox="0 0 400 420" width={size} height={size * 1.05} style={{ opacity, display: "block" }}>
      <defs>
        <radialGradient id="bookGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={COLORS.accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bookPages" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={COLORS.accent} />
          <stop offset="100%" stopColor={COLORS.amber} />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="404" rx="118" ry="12" fill="rgba(0,0,0,0.28)" />
      <circle cx="200" cy="235" r="95" fill="url(#bookGlow)" />
      <path d="M92,398 Q88,340 130,320 Q170,304 200,320 Q230,304 270,320 Q312,340 308,398 Z" fill={COLORS.surface2} />
      <path d="M148,330 Q140,250 150,205 Q160,168 200,168 Q240,168 250,205 Q260,250 252,330 Q200,346 148,330 Z" fill={COLORS.surface2} stroke={COLORS.accent} strokeOpacity="0.25" strokeWidth="2" />
      <path d="M156,225 Q125,235 122,270 Q120,290 148,296" fill="none" stroke={COLORS.surface2} strokeWidth="26" strokeLinecap="round" />
      <path d="M244,225 Q275,235 278,270 Q280,290 252,296" fill="none" stroke={COLORS.surface2} strokeWidth="26" strokeLinecap="round" />
      <circle cx="200" cy="120" r="42" fill={COLORS.surface2} stroke={COLORS.accent} strokeOpacity="0.3" strokeWidth="2" />
      <path d="M200,255 L128,272 L128,232 Q160,218 200,228 Z" fill="url(#bookPages)" opacity="0.92" />
      <path d="M200,255 L272,272 L272,232 Q240,218 200,228 Z" fill="url(#bookPages)" opacity="0.92" />
      <line x1="145" y1="238" x2="182" y2="234" stroke={COLORS.bg} strokeOpacity="0.35" strokeWidth="2" />
      <line x1="145" y1="248" x2="182" y2="244" stroke={COLORS.bg} strokeOpacity="0.35" strokeWidth="2" />
      <line x1="218" y1="234" x2="255" y2="238" stroke={COLORS.bg} strokeOpacity="0.35" strokeWidth="2" />
      <line x1="218" y1="244" x2="255" y2="248" stroke={COLORS.bg} strokeOpacity="0.35" strokeWidth="2" />
      <circle cx="200" cy="170" r="4" fill={COLORS.accent} opacity="0.8" style={{ animation: "floatSlow 5s ease-in-out infinite" }} />
      <circle cx="175" cy="150" r="2.5" fill={COLORS.amber} opacity="0.7" style={{ animation: "floatSlow2 6s ease-in-out infinite" }} />
      <circle cx="228" cy="155" r="3" fill={COLORS.accent} opacity="0.6" style={{ animation: "floatSlow 7s ease-in-out infinite" }} />
    </svg>
  );
}

function AppBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
      <style>{BG_KEYFRAMES}</style>
      <div style={{ position: "absolute", top: "-10%", left: "-8%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(41,240,201,0.16), transparent 70%)", filter: "blur(10px)", animation: "driftBlob 16s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "-15%", right: "-10%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,182,39,0.13), transparent 70%)", filter: "blur(10px)", animation: "driftBlob2 20s ease-in-out infinite" }} />
      <div style={{ position: "absolute", top: "35%", left: "60%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(140,124,255,0.12), transparent 70%)", filter: "blur(10px)", animation: "driftBlob 22s ease-in-out infinite reverse" }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.35, backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
      {FLOATING_BOOKS.map((b, i) => (
        <b.Icon key={i} size={b.size} color="#29F0C9" style={{ position: "absolute", top: b.top, left: b.left, opacity: 0.09, animation: `${b.anim} ${b.dur} ease-in-out infinite` }} />
      ))}
      <div style={{ position: "absolute", bottom: "-4%", right: "-2%" }}>
        <StudentIllustration size={280} opacity={0.05} />
      </div>
    </div>
  );
}

const FRASES_MOTIVACIONAIS = [
  "Todo grande resultado começa com um pequeno impulso.",
  "Impulso é o que te tira do lugar — o resto o estudo constrói.",
  "Um passo hoje, um ponto a mais na prova amanhã.",
  "Sua aprovação começa no primeiro flashcard.",
  "Constância vence talento quando talento não estuda.",
];

/* ---------------- Componentes pequenos ---------------- */

function PulseBar({ value }) {
  const bars = 24;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 40 }}>
      {Array.from({ length: bars }).map((_, i) => {
        const active = i / bars < value;
        const h = 8 + Math.abs(Math.sin(i * 0.9)) * 28;
        return (
          <div key={i} style={{
            width: 4, height: h, borderRadius: 2,
            background: active ? `linear-gradient(180deg, ${COLORS.accent}, ${COLORS.accentDim})` : "rgba(255,255,255,0.08)",
            transition: "background 0.4s ease",
          }} />
        );
      })}
    </div>
  );
}

function Loading({ label }) {
  return (
    <div style={{
      minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 12, color: COLORS.inkDim, fontFamily: "Inter",
    }}>
      <Loader2 size={26} className="spin" color={COLORS.accent} />
      <span style={{ fontSize: 13.5 }}>{label}</span>
      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ErrorBox({ message, onRetry }) {
  return (
    <div style={{
      minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 12, color: COLORS.inkDim, fontFamily: "Inter", padding: 24, textAlign: "center",
    }}>
      <span style={{ color: COLORS.danger, fontSize: 14 }}>{message}</span>
      {onRetry && (
        <button onClick={onRetry} style={{
          padding: "9px 18px", borderRadius: 10, border: "none", background: COLORS.accent,
          color: COLORS.bg, fontFamily: "Sora", fontWeight: 700, fontSize: 13, cursor: "pointer",
        }}>Tentar de novo</button>
      )}
    </div>
  );
}

function Header({ onLogout, user }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px",
      background: COLORS.surface, borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 20,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Zap size={18} color={COLORS.bg} strokeWidth={2.5} />
        </div>
        <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 18, color: COLORS.ink, letterSpacing: -0.5 }}>
          impulse<span style={{ color: COLORS.accent }}>+</span>
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 5, fontFamily: "JetBrains Mono", fontSize: 12.5,
          color: COLORS.amber, background: "rgba(255,182,39,0.1)", padding: "5px 10px", borderRadius: 20,
        }}>
          <Flame size={13} /> {user.streak}
        </div>
        <button onClick={onLogout} style={{ background: "none", border: "none", color: COLORS.inkDim, cursor: "pointer", display: "flex", padding: 6 }}>
          <LogOut size={17} />
        </button>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Início", icon: Home },
  { id: "aulas", label: "Aulas", icon: GraduationCap },
  { id: "estudos", label: "Estudos", icon: Landmark },
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "resumos", label: "Resumos", icon: BookOpen },
  { id: "comocomecar", label: "Como Começar", icon: Flag },
  { id: "redacao", label: "Redação", icon: PenTool },
  { id: "biblioteca", label: "Biblioteca", icon: Library },
  { id: "quiz", label: "Quiz", icon: Zap },
  { id: "perfil", label: "Progresso", icon: Trophy },
];

function Sidebar({ view, setView }) {
  return (
    <div style={{
      width: 64, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center",
      gap: 4, padding: "16px 0", background: COLORS.surface, borderRight: "1px solid rgba(255,255,255,0.06)",
      position: "sticky", top: 61, alignSelf: "flex-start", height: "calc(100vh - 61px)", overflowY: "auto",
    }}>
      {NAV_ITEMS.map((it) => {
        const Icon = it.icon;
        const active = view === it.id;
        return (
          <button
            key={it.id}
            onClick={() => setView(it.id)}
            title={it.label}
            style={{
              width: 46, height: 46, borderRadius: 12, border: "none",
              background: active ? "rgba(41,240,201,0.14)" : "transparent",
              color: active ? COLORS.accent : COLORS.inkDim,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.15s ease", flexShrink: 0,
            }}
          >
            <Icon size={19} />
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Auth ---------------- */

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !senha || (mode === "signup" && !nome)) {
      setError("Preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      const resposta = mode === "signup" ? await api.cadastrar(nome, email, senha) : await api.login(email, senha);
      onAuthenticated(resposta.usuario, resposta.token, mode);
    } catch (err) {
      setError(err.message || "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "Inter", gap: 56 }}>
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden", zIndex: 0,
        background: `radial-gradient(circle at 20% 20%, rgba(41,240,201,0.08), transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,182,39,0.06), transparent 40%)`,
      }} />

      <div className="auth-illustration" style={{ position: "relative", zIndex: 1, display: "none", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <StudentIllustration size={320} />
        <p style={{ color: COLORS.inkDim, fontFamily: "Sora", fontWeight: 700, fontSize: 15, textAlign: "center", maxWidth: 260, lineHeight: 1.4 }}>
          Cada página é um passo mais perto da aprovação.
        </p>
      </div>

      <div style={{
        width: "100%", maxWidth: 380, background: COLORS.surface, borderRadius: 20, padding: "36px 32px",
        border: "1px solid rgba(255,255,255,0.07)", position: "relative", zIndex: 1, boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={20} color={COLORS.bg} strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 22, color: COLORS.ink }}>
            impulse<span style={{ color: COLORS.accent }}>+</span>
          </span>
        </div>
        <p style={{ color: COLORS.inkDim, fontSize: 13.5, margin: "0 0 28px 0" }}>Seu ponto de partida para o PAS — de graça.</p>

        <div style={{ display: "flex", background: COLORS.bg, borderRadius: 10, padding: 4, marginBottom: 22 }}>
          {["login", "signup"].map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
              flex: 1, padding: "9px 0", borderRadius: 8, border: "none", cursor: "pointer",
              background: mode === m ? COLORS.surface2 : "transparent", color: mode === m ? COLORS.ink : COLORS.inkDim,
              fontFamily: "Inter", fontWeight: 600, fontSize: 13.5, transition: "all 0.15s",
            }}>
              {m === "login" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mode === "signup" && <Field icon={User} placeholder="Nome" value={nome} onChange={setNome} />}
          <Field icon={Mail} placeholder="E-mail" value={email} onChange={setEmail} type="email" />
          <Field icon={Lock} placeholder="Senha (mín. 6 caracteres)" value={senha} onChange={setSenha} type="password" />

          {error && <span style={{ color: COLORS.danger, fontSize: 12.5 }}>{error}</span>}

          <button type="submit" disabled={loading} style={{
            marginTop: 8, padding: "12px 0", borderRadius: 10, border: "none", background: COLORS.accent,
            color: COLORS.bg, fontFamily: "Sora", fontWeight: 700, fontSize: 14.5, cursor: loading ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: loading ? 0.7 : 1,
          }}>
            {loading ? <Loader2 size={16} className="spin" /> : (mode === "login" ? "Entrar" : "Começar a estudar")}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <p style={{ color: COLORS.inkDim, fontSize: 11, marginTop: 18, lineHeight: 1.5 }}>
          Conectado à API real — o cadastro fica salvo no banco de dados.
        </p>
        <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

function Field({ icon: Icon, value, onChange, ...rest }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: COLORS.bg, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "11px 13px" }}>
      <Icon size={16} color={COLORS.inkDim} />
      <input {...rest} value={value} onChange={(e) => onChange(e.target.value)} style={{
        background: "transparent", border: "none", outline: "none", color: COLORS.ink, fontFamily: "Inter", fontSize: 14, width: "100%",
      }} />
    </div>
  );
}

/* ---------------- Splash pós-cadastro ---------------- */

function SplashScreen({ name, onDone }) {
  const [frase] = useState(() => FRASES_MOTIVACIONAIS[Math.floor(Math.random() * FRASES_MOTIVACIONAIS.length)]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 60);
    const t2 = setTimeout(() => onDone(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Inter", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 45%, rgba(41,240,201,0.14), transparent 55%)` }} />
      <div style={{
        display: "flex", alignItems: "center", gap: 12, opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(14px) scale(0.96)",
        transition: "all 0.6s cubic-bezier(.2,.8,.2,1)", zIndex: 1,
      }}>
        <div style={{ width: 54, height: 54, borderRadius: 14, background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(41,240,201,0.4)" }}>
          <Zap size={30} color={COLORS.bg} strokeWidth={2.5} />
        </div>
        <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 40, color: COLORS.ink, letterSpacing: -1 }}>
          impulse<span style={{ color: COLORS.accent }}>+</span>
        </span>
      </div>
      <p style={{
        color: COLORS.inkDim, fontFamily: "Inter", fontSize: 15.5, marginTop: 22, maxWidth: 380, textAlign: "center",
        padding: "0 24px", lineHeight: 1.5, zIndex: 1, opacity: visible ? 1 : 0, transition: "opacity 0.7s ease 0.3s",
      }}>
        {name ? `Bem-vindo(a), ${name}. ` : ""}{frase}
      </p>
      <div style={{ marginTop: 26, zIndex: 1, opacity: visible ? 1 : 0, transition: "opacity 0.7s ease 0.5s" }}>
        <PulseBar value={0.35} />
      </div>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */

const LICOES = [
  {
    id: "pa",
    materia: "Matemática",
    titulo: "Progressão Aritmética",
    cor: "#8C7CFF",
    icon: Calculator,
    paragrafos: [
      "Uma Progressão Aritmética (PA) é uma sequência de números em que a diferença entre um termo e o anterior é sempre a mesma. Essa diferença constante é chamada de razão, normalmente representada pela letra r.",
      "Por exemplo, na sequência 2, 5, 8, 11, 14... cada termo é obtido somando 3 ao anterior. Então essa é uma PA de razão r = 3.",
      "Pra encontrar qualquer termo da sequência sem precisar somar um por um, usamos a fórmula do termo geral: aₙ = a₁ + (n − 1) · r, onde a₁ é o primeiro termo, n é a posição que você quer descobrir, e r é a razão.",
      "Também existe uma fórmula pra somar os termos de uma PA rapidinho, sem precisar somar todo mundo na mão: Sₙ = (a₁ + aₙ) · n / 2.",
    ],
    exemplo: {
      titulo: "Exemplo resolvido",
      texto: "Qual é o 10º termo da PA (2, 5, 8, 11, ...)? Usando aₙ = a₁ + (n−1)·r: a₁₀ = 2 + (10−1)·3 = 2 + 27 = 29. O décimo termo é 29.",
    },
  },
  {
    id: "pg",
    materia: "Matemática",
    titulo: "Progressão Geométrica",
    cor: "#8C7CFF",
    icon: Calculator,
    paragrafos: [
      "Uma Progressão Geométrica (PG) é parecida com a PA, mas em vez de somar sempre o mesmo valor, você multiplica. A razão (q) é o número pelo qual cada termo é multiplicado pra chegar no próximo.",
      "Por exemplo, na sequência 3, 6, 12, 24, 48... cada termo é o dobro do anterior. Essa é uma PG de razão q = 2.",
      "O termo geral de uma PG é dado por aₙ = a₁ · q^(n−1). Repara que aqui é multiplicação e potência, diferente da PA que usa soma.",
      "Pra somar os n primeiros termos de uma PG finita (com q ≠ 1), usa-se Sₙ = a₁ · (qⁿ − 1) / (q − 1). E quando a PG é infinita e |q| < 1 (a razão é uma fração entre -1 e 1), a soma de todos os infinitos termos converge pra um valor: S = a₁ / (1 − q).",
    ],
    exemplo: {
      titulo: "Exemplo resolvido",
      texto: "Qual o 6º termo da PG (2, 6, 18, 54, ...)? A razão é q = 3. Usando aₙ = a₁ · q^(n−1): a₆ = 2 · 3⁵ = 2 · 243 = 486.",
    },
  },
  {
    id: "funcoes-afim-quadratica",
    materia: "Matemática",
    titulo: "Funções Afim e Quadrática",
    cor: "#8C7CFF",
    icon: Calculator,
    paragrafos: [
      "Uma função afim tem a forma f(x) = ax + b, e seu gráfico é sempre uma reta. O número 'a' é o coeficiente angular (define a inclinação da reta: se é positivo, a reta sobe; se negativo, desce) e 'b' é onde a reta cruza o eixo y.",
      "Uma função quadrática tem a forma f(x) = ax² + bx + c, e seu gráfico é uma parábola. Se 'a' é positivo, a parábola tem concavidade pra cima (forma de U); se negativo, pra baixo.",
      "O vértice da parábola — o ponto mais baixo ou mais alto dela — é encontrado com xᵥ = −b/2a. Depois é só substituir esse valor de volta na função pra achar o yᵥ correspondente.",
      "Pra achar onde a parábola cruza o eixo x (as raízes da equação), usa-se a fórmula de Bhaskara: x = (−b ± √(b² − 4ac)) / 2a.",
    ],
    exemplo: {
      titulo: "Exemplo resolvido",
      texto: "Qual o vértice de f(x) = x² − 4x + 3? xᵥ = −(−4)/(2·1) = 2. Substituindo: f(2) = 4 − 8 + 3 = −1. O vértice é o ponto (2, −1), que nesse caso é o ponto mínimo da parábola.",
    },
  },
  {
    id: "exponencial-log",
    materia: "Matemática",
    titulo: "Funções Exponenciais e Logarítmicas",
    cor: "#8C7CFF",
    icon: Calculator,
    paragrafos: [
      "Uma função exponencial tem a forma f(x) = a · bˣ, onde a variável x aparece no expoente. Se a base b for maior que 1, a função cresce cada vez mais rápido (crescimento exponencial); se b estiver entre 0 e 1, a função decresce (decaimento exponencial).",
      "Esse tipo de função aparece em situações como juros compostos, crescimento populacional, e decaimento radioativo — sempre que a taxa de mudança depende do valor atual.",
      "A função logarítmica é a operação inversa da exponencial. Se bˣ = y, então logᵦ(y) = x. Ou seja, o logaritmo 'desfaz' a exponenciação e te diz a que expoente você precisa elevar a base pra chegar num certo valor.",
      "Logaritmos aparecem em escalas que crescem muito rápido, como a escala Richter (terremotos), o pH (acidez), e a intensidade sonora em decibéis — todas usam log porque comprimem números gigantes em escalas mais fáceis de comparar.",
    ],
    exemplo: {
      titulo: "Vale lembrar",
      texto: "Uma forma de reconhecer se um problema pede exponencial ou log: se a incógnita está no expoente e você quer saber 'quanto vai virar', é exponencial. Se você já sabe o resultado e quer descobrir 'que expoente gerou isso', é log.",
    },
  },
  {
    id: "geometria-plana",
    materia: "Matemática",
    titulo: "Geometria Plana",
    cor: "#8C7CFF",
    icon: Calculator,
    paragrafos: [
      "Geometria plana estuda figuras em duas dimensões — triângulos, quadrados, retângulos, círculos — e suas medidas de perímetro (contorno) e área (espaço interno).",
      "Um conceito importante é a semelhança de triângulos: dois triângulos são semelhantes quando têm os mesmos ângulos, mesmo que os tamanhos sejam diferentes — e nesse caso, os lados correspondentes são proporcionais entre si.",
      "O Teorema de Tales também trabalha com proporcionalidade: quando um feixe de retas paralelas é cortado por duas retas transversais, os segmentos formados numa reta são proporcionais aos segmentos formados na outra.",
      "Na trigonometria do triângulo retângulo, as razões seno, cosseno e tangente relacionam os ângulos aos lados do triângulo: seno é cateto oposto sobre hipotenusa, cosseno é cateto adjacente sobre hipotenusa, e tangente é cateto oposto sobre cateto adjacente.",
    ],
    exemplo: {
      titulo: "Exemplo resolvido",
      texto: "Num triângulo retângulo com hipotenusa 10 e um ângulo de 30°, o cateto oposto a esse ângulo é: sen(30°) = cateto oposto / 10. Como sen(30°) = 0,5, o cateto oposto = 0,5 × 10 = 5.",
    },
  },
  {
    id: "matematica-financeira",
    materia: "Matemática",
    titulo: "Matemática Financeira",
    cor: "#8C7CFF",
    icon: Calculator,
    paragrafos: [
      "Juros simples são calculados sempre sobre o valor inicial (capital), sem incorporar os juros já ganhos nos períodos anteriores. A fórmula é J = C · i · t, onde C é o capital, i é a taxa de juros e t é o tempo.",
      "Juros compostos, por outro lado, incorporam os juros de cada período ao capital, e o próximo período de juros é calculado sobre esse novo total — é o famoso 'juros sobre juros'. A fórmula é M = C · (1 + i)ᵗ, onde M é o montante final.",
      "Essa diferença faz com que, no longo prazo, os juros compostos cresçam muito mais rápido que os simples — é o mesmo princípio matemático por trás do crescimento exponencial.",
      "Isso é relevante tanto pra dívidas (cartão de crédito costuma usar juros compostos, por isso cresce tão rápido) quanto pra investimentos (quanto mais tempo o dinheiro fica rendendo, maior o efeito dos juros compostos).",
    ],
    exemplo: {
      titulo: "Exemplo resolvido",
      texto: "R$ 1.000 aplicados a 10% ao ano: em juros simples, depois de 3 anos você tem 1000 + (1000×0,10×3) = R$ 1.300. Em juros compostos: 1000×(1,10)³ = R$ 1.331 — a diferença cresce ainda mais com o tempo.",
    },
  },
  {
    id: "coesao",
    materia: "Português",
    titulo: "Coesão e Coerência",
    cor: "#29F0C9",
    icon: BookOpen,
    paragrafos: [
      "Coesão e coerência são dois conceitos que caminham juntos, mas significam coisas diferentes — e é bem comum confundir os dois.",
      "Coesão é a ligação gramatical entre as partes do texto. Ela é feita através de conectivos (mas, porque, portanto), pronomes que retomam algo já dito, repetição controlada de palavras, e sinônimos. É o que faz as frases 'grudarem' umas nas outras de forma organizada.",
      "Coerência é o sentido geral que o texto constrói. Um texto pode ter todas as palavras certas gramaticalmente e mesmo assim não fazer sentido nenhum — isso seria coeso, mas incoerente.",
      "Um jeito prático de lembrar: coesão cuida da 'costura' entre as frases; coerência cuida se a história toda faz sentido.",
    ],
    exemplo: {
      titulo: "Exemplo",
      texto: "\"João foi ao mercado. Ele comprou frutas.\" — o pronome 'Ele' retomando 'João' é um recurso de coesão. Se o texto continuasse dizendo algo que contradiz o que foi dito antes (tipo 'João nunca saiu de casa'), ele perderia a coerência.",
    },
  },
  {
    id: "variacao-linguistica",
    materia: "Português",
    titulo: "Variação Linguística",
    cor: "#29F0C9",
    icon: BookOpen,
    paragrafos: [
      "Toda língua viva varia — não existe um jeito 'único e correto' de falar português, existem vários jeitos adequados a diferentes situações. A variação linguística estuda exatamente essas diferenças.",
      "Variação regional (diatópica): é a diferença de sotaque, vocabulário e expressões entre regiões diferentes de um mesmo país — por exemplo, 'mandioca', 'aipim' e 'macaxeira' são a mesma coisa em regiões diferentes do Brasil.",
      "Variação social (diastrática): é a diferença ligada a grupos sociais, faixa etária, profissão — gírias de jovens, jargões técnicos de uma profissão, por exemplo.",
      "Variação situacional (diafásica): é a diferença de registro dependendo do contexto — você fala diferente numa entrevista de emprego e numa conversa com amigos, mesmo sendo a mesma pessoa. E variação histórica (diacrônica) é a mudança da língua ao longo do tempo.",
      "Importante: nenhuma variação é 'errada' do ponto de vista linguístico. O que existe é adequação — usar o registro certo pra cada situação. Preconceito linguístico é quando se trata uma variação (geralmente popular ou regional) como inferior, sem base científica.",
    ],
    exemplo: {
      titulo: "Vale lembrar",
      texto: "Em prova, cuidado com questões que tratam gírias ou regionalismos como 'erros' — o conceito correto é que são variações linguísticas legítimas, cada uma adequada ao seu contexto de uso.",
    },
  },
  {
    id: "morfossintaxe",
    materia: "Português",
    titulo: "Morfossintaxe do Período Simples",
    cor: "#29F0C9",
    icon: BookOpen,
    paragrafos: [
      "Concordância verbal é a regra que faz o verbo 'combinar' em número e pessoa com o sujeito da frase. Ex.: 'Os alunos estudam' (verbo no plural, porque o sujeito é plural), não 'Os alunos estuda'.",
      "Concordância nominal é parecida, mas entre substantivos e as palavras que os acompanham (artigos, adjetivos, numerais) — eles precisam combinar em gênero e número. Ex.: 'as provas difíceis', não 'as provas difícil'.",
      "Regência verbal e nominal trata de quais preposições certos verbos e nomes exigem. Por exemplo, o verbo 'assistir' (no sentido de ver) pede a preposição 'a': 'assistir ao filme', não 'assistir o filme'.",
      "Crase é a fusão da preposição 'a' com o artigo feminino 'a' (ou 'as'), representada pelo acento grave (à). Ela só ocorre quando há, ao mesmo tempo, uma palavra que exige a preposição 'a' e um substantivo feminino que aceitaria o artigo 'a' antes dele.",
    ],
    exemplo: {
      titulo: "Exemplo",
      texto: "'Vou à escola' tem crase porque 'vou' pede a preposição 'a', e 'escola' é um substantivo feminino que aceitaria o artigo 'a'. Já 'vou a pé' não tem crase, porque 'pé' não é palavra feminina.",
    },
  },
  {
    id: "estilos-de-epoca",
    materia: "Literatura",
    titulo: "Estilos de Época na Literatura",
    cor: "#29F0C9",
    icon: BookOpen,
    paragrafos: [
      "A literatura em língua portuguesa é organizada em 'estilos de época' — períodos com características estéticas e temáticas próprias, que ajudam a entender o contexto histórico de cada obra.",
      "O Barroco (século XVII) é marcado pelo conflito entre razão e fé, prazer e culpa — uma fusão de valores religiosos e mundanos. A linguagem é rebuscada, cheia de contrastes e jogos de palavras. Gregório de Matos é um dos nomes mais associados ao Barroco no Brasil, com poesia tanto religiosa quanto satírica.",
      "O Arcadismo (século XVIII) reage contra o exagero barroco, buscando simplicidade e equilíbrio. Os temas centrais são o carpe diem (aproveitar o presente, já que a vida é passageira) e o fugere urbem (fuga da cidade em busca da vida simples no campo, o chamado bucolismo). Tomás Antônio Gonzaga é um nome importante desse período.",
      "Vale lembrar também que antes desses dois períodos existiram o Trovadorismo, o Humanismo e o Classicismo, ligados à formação inicial da literatura em língua portuguesa em Portugal, com forte influência da tradição europeia.",
    ],
    exemplo: {
      titulo: "Vale lembrar",
      texto: "Associe rapidinho: Barroco = conflito razão x fé, contrastes. Arcadismo = carpe diem, vida simples no campo, equilíbrio. Essas duas palavras-chave (carpe diem e conflito razão/fé) são as mais cobradas em prova.",
    },
  },
  {
    id: "hidrografia",
    materia: "Geografia",
    titulo: "Hidrografia Amazônica",
    cor: "#FFB627",
    icon: Landmark,
    paragrafos: [
      "A bacia amazônica é a maior bacia hidrográfica do planeta em volume de água, cobrindo boa parte do território brasileiro e se estendendo por outros países da América do Sul.",
      "Os rios da região são classificados por cor, de acordo com a origem e composição da água: rios de água branca (barrenta, rica em sedimentos, como o Solimões), rios de água preta (escura, com bastante matéria orgânica dissolvida, como o Rio Negro), e rios de água clara (mais transparente, vindos de terrenos cristalinos).",
      "Um fenômeno bem conhecido da região é o 'encontro das águas', perto de Manaus, onde o Rio Negro (escuro) e o Solimões (barrento) correm lado a lado por quilômetros sem se misturar completamente, por causa da diferença de temperatura, velocidade e densidade entre eles.",
      "Essa hidrografia é essencial pro transporte na região (muitas cidades só são acessíveis por rio), pra agricultura, e pra manutenção da biodiversidade — a Amazônia abriga uma das maiores concentrações de espécies aquáticas do mundo.",
    ],
    exemplo: {
      titulo: "Vale lembrar",
      texto: "O 'encontro das águas' costuma cair em prova como exemplo de fenômeno geográfico visível e bem documentado — associe ele às palavras-chave: densidade, temperatura e velocidade das águas.",
    },
  },
  {
    id: "cartografia",
    materia: "Geografia",
    titulo: "Cartografia",
    cor: "#FFB627",
    icon: Landmark,
    paragrafos: [
      "Cartografia é a ciência de representar a superfície terrestre em mapas. Como a Terra é uma esfera e o mapa é plano, toda representação cartográfica envolve algum tipo de deformação — o que muda é qual tipo de deformação cada projeção prioriza.",
      "A escala de um mapa indica a relação entre a distância no papel e a distância real. Uma escala 1:100.000 significa que 1 cm no mapa equivale a 100.000 cm (ou seja, 1 km) na realidade. Escalas menores (tipo 1:1.000.000) mostram áreas grandes com menos detalhe; escalas maiores (tipo 1:10.000) mostram áreas pequenas com muito detalhe.",
      "As coordenadas geográficas — latitude (distância ao norte ou sul da Linha do Equador) e longitude (distância a leste ou oeste do Meridiano de Greenwich) — permitem localizar qualquer ponto da Terra com precisão.",
      "Legendas, símbolos e cores nos mapas seguem convenções (por exemplo, azul para água, verde para vegetação) que ajudam a interpretar rapidamente o que está sendo representado, sem precisar de texto.",
    ],
    exemplo: {
      titulo: "Vale lembrar",
      texto: "Georreferenciamento é o termo usado quando se associa uma informação a uma localização geográfica exata — é um conceito frequentemente cobrado junto com cartografia digital e imagens de satélite.",
    },
  },
  {
    id: "urbanizacao",
    materia: "Geografia",
    titulo: "Urbanização e Impactos Socioambientais",
    cor: "#FFB627",
    icon: Landmark,
    paragrafos: [
      "Urbanização é o processo de crescimento das cidades em relação à população rural — no Brasil, esse processo foi rápido e intenso principalmente a partir da segunda metade do século XX, associado à industrialização e ao êxodo rural (saída do campo para a cidade em busca de trabalho).",
      "Esse crescimento acelerado e muitas vezes desorganizado gerou problemas como a favelização (ocupação irregular de terrenos, geralmente sem infraestrutura básica), a especulação imobiliária, e a sobrecarga de serviços públicos como transporte, saúde e saneamento.",
      "Entre os principais impactos socioambientais da urbanização estão: impermeabilização do solo (que aumenta o risco de enchentes), poluição do ar e da água, ilhas de calor urbano, e ocupação de áreas de risco (encostas, margens de rio).",
      "Planejamento urbano é o conjunto de políticas públicas que tenta organizar o crescimento das cidades de forma mais sustentável, envolvendo zoneamento, mobilidade urbana, e políticas de habitação.",
    ],
    exemplo: {
      titulo: "Vale lembrar",
      texto: "Migração pendular (quem mora numa cidade e trabalha em outra, voltando pra casa todo dia) é um dos temas mais cobrados junto com urbanização — associe ao conceito de conurbação (quando cidades vizinhas crescem até se conectar fisicamente).",
    },
  },
  {
    id: "guerrafria",
    materia: "História",
    titulo: "Guerra Fria e Cortina de Ferro",
    cor: "#FF5C7A",
    icon: Landmark,
    paragrafos: [
      "Depois da Segunda Guerra Mundial, o mundo ficou dividido em dois grandes blocos ideológicos: de um lado, os Estados Unidos e seus aliados capitalistas; do outro, a União Soviética e os países comunistas do Leste Europeu.",
      "Esse período de tensão, que durou da segunda metade dos anos 1940 até o início dos anos 1990, ficou conhecido como Guerra Fria — 'fria' porque as duas potências nunca entraram em confronto militar direto entre si, mas disputaram influência política, econômica e tecnológica no mundo todo.",
      "'Cortina de Ferro' é o termo usado pra descrever a fronteira ideológica (e, em boa parte, física) que separava a Europa capitalista da Europa comunista. O símbolo mais famoso dessa divisão foi o Muro de Berlim, construído em 1961 e derrubado em 1989.",
      "A Guerra Fria também gerou uma corrida armamentista e espacial entre as duas potências, e influenciou conflitos em outras partes do mundo, como a Guerra da Coreia e a Guerra do Vietnã.",
    ],
    exemplo: {
      titulo: "Vale lembrar",
      texto: "A Cortina de Ferro é sempre associada à divisão da Europa; o Muro de Berlim é o símbolo mais citado em provas quando o assunto é essa fronteira ideológica.",
    },
  },
  {
    id: "brasil-republica",
    materia: "História",
    titulo: "Brasil República: Planos Econômicos e Redemocratização",
    cor: "#FF5C7A",
    icon: Landmark,
    paragrafos: [
      "Depois de mais de 20 anos de regime militar, o Brasil passou por um processo de redemocratização ao longo dos anos 1980, com o retorno de eleições diretas, a Constituição de 1988, e a retomada de liberdades políticas.",
      "Esse período também foi marcado por uma grave crise econômica, com inflação altíssima. O governo José Sarney lançou o Plano Cruzado (1986), que criou uma nova moeda (o cruzado) e congelou preços numa tentativa de conter a inflação — o plano teve efeito de curto prazo, mas a inflação voltou a subir depois.",
      "Em 1989, o Brasil teve sua primeira eleição direta para presidente desde a ditadura, vencida por Fernando Collor de Mello, cuja campanha focou na modernização do país e no combate à corrupção no serviço público (a chamada 'caça aos marajás').",
      "A inflação só foi efetivamente controlada anos depois, com o Plano Real (1994), que criou uma nova moeda (o real) com uma estratégia diferente das tentativas anteriores, baseada numa transição gradual e na criação de uma unidade de referência de valor antes da moeda em si.",
    ],
    exemplo: {
      titulo: "Vale lembrar",
      texto: "Não confunda os planos: Plano Cruzado (1986, governo Sarney, congelamento de preços) e Plano Real (1994, controle efetivo da inflação) são frequentemente comparados em questões de prova.",
    },
  },
  {
    id: "colonizacao-africana",
    materia: "História",
    titulo: "Reinos do Sudão Ocidental e Comércio Transaariano",
    cor: "#FF5C7A",
    icon: Landmark,
    paragrafos: [
      "Antes da chegada dos europeus, a África subsaariana já tinha sociedades complexas e organizadas, com destaque para os grandes impérios do chamado Sudão Ocidental (região ao sul do deserto do Saara).",
      "O Império do Mali foi um dos mais importantes, com cidades como Tombuctu, Jené e Gâo se destacando como centros comerciais e culturais — Tombuctu, inclusive, era conhecida por suas bibliotecas e centros de estudo islâmicos.",
      "Esses impérios prosperaram principalmente através do comércio transaariano: rotas comerciais que atravessavam o deserto do Saara conectando a África subsaariana ao norte da África e, por extensão, ao mundo mediterrâneo — trocando ouro, sal, e outros produtos.",
      "Esse contexto é importante pra entender que a história da África não começa com a colonização europeia — havia sociedades organizadas, com comércio, cultura e política próprios, muito antes disso.",
    ],
    exemplo: {
      titulo: "Vale lembrar",
      texto: "O comércio transaariano (através do deserto do Saara) é diferente do comércio transatlântico (que veio depois, ligado à colonização e ao tráfico de pessoas escravizadas) — não confunda os dois em prova.",
    },
  },
  {
    id: "origemdavida",
    materia: "Biologia",
    titulo: "Origem da Vida: Oparin e Haldane",
    cor: "#3DDC84",
    icon: FlaskConical,
    paragrafos: [
      "Alexander Oparin (bioquímico russo) e John Haldane (cientista britânico) propuseram, de forma independente e quase na mesma época (década de 1920), hipóteses parecidas sobre como a vida teria surgido na Terra primitiva.",
      "A ideia central dos dois é a chamada evolução química: moléculas orgânicas simples teriam se formado a partir de gases da atmosfera primitiva (como metano, amônia, hidrogênio e vapor d'água), usando energia de descargas elétricas, radiação ultravioleta e calor vulcânico.",
      "Essas moléculas se acumulariam nos oceanos primitivos, formando o que ficou conhecido como 'caldo primordial' ou 'sopa pré-biótica'. Com o tempo, moléculas mais complexas teriam se formado, incluindo estruturas chamadas coacervados — agregados capazes de crescer e se dividir, considerados um possível passo em direção às primeiras células.",
      "A principal diferença entre os dois cientistas está na fonte de carbono que cada um propôs para essas reações químicas iniciais — um detalhe que costuma aparecer em provas como forma de comparar as duas teorias.",
      "Décadas depois, o experimento de Stanley Miller e Harold Urey (1953) testou essa hipótese em laboratório, recriando as condições da atmosfera primitiva e obtendo aminoácidos — um resultado que reforçou a plausibilidade da ideia de Oparin e Haldane.",
    ],
    exemplo: {
      titulo: "Vale lembrar",
      texto: "Associe: Oparin e Haldane = hipótese da evolução química / 'caldo primordial'. Miller e Urey = o experimento que testou essa hipótese em laboratório.",
    },
  },
  {
    id: "citologia",
    materia: "Biologia",
    titulo: "Citologia: A Célula",
    cor: "#3DDC84",
    icon: FlaskConical,
    paragrafos: [
      "A Teoria Celular estabelece que todos os seres vivos são formados por células, que a célula é a unidade básica da vida, e que toda célula vem de outra célula preexistente (por divisão celular).",
      "A membrana plasmática controla o que entra e sai da célula, mantendo o equilíbrio interno (homeostase). Dentro da célula, diferentes organelas exercem funções específicas: as mitocôndrias produzem energia (ATP) através da respiração celular, o núcleo guarda o material genético (DNA) e controla as atividades celulares, e o retículo endoplasmático participa da produção e do transporte de substâncias.",
      "Existem dois tipos principais de divisão celular: mitose, que gera duas células-filhas geneticamente idênticas à célula-mãe (usada em crescimento e reparo de tecidos), e meiose, que gera quatro células com metade do material genético (usada na formação de gametas — óvulos e espermatozoides).",
      "A teoria endossimbiótica explica a origem de organelas como mitocôndrias e cloroplastos: elas teriam sido, originalmente, organismos independentes que passaram a viver dentro de outras células numa relação de benefício mútuo, até se tornarem parte permanente delas.",
    ],
    exemplo: {
      titulo: "Vale lembrar",
      texto: "Não confunda: mitose gera células idênticas (2 células, mesmo número de cromossomos) e é usada pra crescimento; meiose gera células diferentes entre si (4 células, metade dos cromossomos) e é usada na reprodução.",
    },
  },
  {
    id: "ecologia",
    materia: "Biologia",
    titulo: "Ecologia: Relações e Ciclos",
    cor: "#3DDC84",
    icon: FlaskConical,
    paragrafos: [
      "Ecologia estuda as relações entre os seres vivos e o ambiente em que vivem. Essas relações podem acontecer entre indivíduos da mesma espécie (intraespecíficas) ou de espécies diferentes (interespecíficas), e podem ser harmônicas (sem prejuízo pra nenhum dos dois lados, como o mutualismo) ou desarmônicas (com prejuízo pra pelo menos um dos lados, como o parasitismo e a predação).",
      "Cadeias alimentares mostram o fluxo de energia entre organismos, começando pelos produtores (geralmente plantas, que fazem fotossíntese), passando pelos consumidores (herbívoros, carnívoros) até os decompositores (fungos e bactérias, que reciclam a matéria orgânica). Quando várias cadeias se interligam, formam uma teia alimentar.",
      "Os ciclos biogeoquímicos (como o ciclo da água, do carbono e do nitrogênio) descrevem como elementos essenciais à vida circulam entre os seres vivos e o ambiente físico, sendo constantemente reciclados na natureza.",
      "Impactos ambientais como desmatamento, poluição e mudanças climáticas afetam diretamente essas relações ecológicas, podendo levar a desequilíbrios como a extinção de espécies e alterações em cadeias alimentares inteiras.",
    ],
    exemplo: {
      titulo: "Vale lembrar",
      texto: "Um ecótono é a zona de transição entre dois ecossistemas diferentes — como o encontro das águas do Rio Negro com o Solimões, que também é um exemplo clássico de conceito ecológico ligado à geografia amazônica.",
    },
  },
  {
    id: "estequiometria",
    materia: "Química",
    titulo: "Estequiometria",
    cor: "#29F0C9",
    icon: Atom,
    paragrafos: [
      "Estequiometria é a parte da Química que estuda as relações de quantidade entre reagentes e produtos numa reação química — basicamente, 'quanto de cada coisa entra e quanto sai'.",
      "Tudo começa com a equação química balanceada: o número de átomos de cada elemento tem que ser igual dos dois lados da equação, porque a matéria não se cria nem se destrói numa reação (Lei de Lavoisier).",
      "A partir da equação balanceada, os coeficientes (os números na frente de cada substância) mostram a proporção em mols entre os participantes da reação. É essa proporção que permite calcular quanto de um produto será formado a partir de uma certa quantidade de reagente.",
      "Um conceito importante é o de reagente limitante: numa reação com mais de um reagente, geralmente um deles acaba primeiro e limita quanto de produto pode ser formado, mesmo que ainda sobre uma quantidade do outro reagente.",
    ],
    exemplo: {
      titulo: "Exemplo resolvido",
      texto: "Na reação 2H₂ + O₂ → 2H₂O, a proporção é de 2 mols de gás hidrogênio para 1 mol de gás oxigênio, formando 2 mols de água. Se eu tenho 4 mols de H₂ reagindo com O₂ suficiente, vou formar 4 mols de H₂O (mantendo a mesma proporção 2:2).",
    },
  },
  {
    id: "modelos-atomicos",
    materia: "Química",
    titulo: "Modelos Atômicos e Ligações Químicas",
    cor: "#29F0C9",
    icon: Atom,
    paragrafos: [
      "Ao longo da história, o modelo do átomo foi evoluindo: Dalton propôs o átomo como uma esfera maciça e indivisível; Thomson descobriu o elétron e propôs um modelo com cargas negativas espalhadas numa esfera positiva ('pudim de passas'); Rutherford descobriu o núcleo atômico através de um experimento com folha de ouro, propondo um modelo com núcleo pequeno e denso cercado por elétrons; e Bohr refinou esse modelo, propondo que os elétrons ocupam órbitas (níveis de energia) bem definidas ao redor do núcleo.",
      "Átomos se ligam entre si de diferentes formas pra formar substâncias mais estáveis. Na ligação iônica, um átomo perde elétrons e outro ganha, formando íons com cargas opostas que se atraem (como no sal de cozinha, NaCl).",
      "Na ligação covalente, os átomos compartilham pares de elétrons — é o tipo de ligação mais comum entre não-metais, formando moléculas como a água (H₂O) e o gás carbônico (CO₂).",
      "Na ligação metálica, os elétrons de valência ficam livres, formando um 'mar de elétrons' compartilhado entre vários átomos de metal — isso explica propriedades características dos metais, como condutividade elétrica e maleabilidade.",
    ],
    exemplo: {
      titulo: "Vale lembrar",
      texto: "Ordem histórica dos modelos atômicos: Dalton → Thomson → Rutherford → Bohr. Cada um resolveu uma limitação do anterior, então prestar atenção na ordem cronológica ajuda a não confundir as características de cada modelo.",
    },
  },
  {
    id: "leis-newton",
    materia: "Física",
    titulo: "As Três Leis de Newton",
    cor: "#FF5C7A",
    icon: FlaskConical,
    paragrafos: [
      "A Primeira Lei de Newton (lei da inércia) diz que um corpo tende a manter seu estado de repouso ou de movimento retilíneo uniforme, a menos que uma força resultante diferente de zero atue sobre ele. É por isso que você é jogado pra frente quando um ônibus freia bruscamente — seu corpo 'tende' a continuar se movendo.",
      "A Segunda Lei de Newton relaciona força, massa e aceleração através da fórmula F = m · a. Quanto maior a força aplicada, maior a aceleração; quanto maior a massa do objeto, mais força é necessária pra gerar a mesma aceleração.",
      "A Terceira Lei de Newton (ação e reação) diz que toda força aplicada por um corpo sobre outro gera uma força de mesma intensidade e direção, mas sentido oposto, aplicada de volta no primeiro corpo. Por isso, ao empurrar uma parede, você sente a parede 'empurrando' você de volta.",
      "Essas três leis formam a base da mecânica clássica e explicam desde o movimento de objetos do dia a dia até o funcionamento de foguetes (que usam a terceira lei pra se impulsionar, expelindo gases pra trás e sendo empurrados pra frente).",
    ],
    exemplo: {
      titulo: "Exemplo resolvido",
      texto: "Um carrinho de 5 kg recebe uma força de 20 N. Pela segunda lei, F = m·a, então a = F/m = 20/5 = 4 m/s². O carrinho acelera a 4 metros por segundo, a cada segundo.",
    },
  },
  {
    id: "termodinamica",
    materia: "Física",
    titulo: "Termodinâmica: Calor e Temperatura",
    cor: "#FF5C7A",
    icon: FlaskConical,
    paragrafos: [
      "Temperatura mede o grau de agitação das partículas de um corpo — quanto mais agitadas as partículas, maior a temperatura. Calor, por sua vez, é a energia térmica que se transfere de um corpo mais quente para um mais frio, até que os dois atinjam a mesma temperatura (equilíbrio térmico).",
      "A Lei Zero da Termodinâmica formaliza essa ideia de equilíbrio: se dois corpos estão em equilíbrio térmico com um terceiro, eles também estão em equilíbrio térmico entre si.",
      "A Primeira Lei da Termodinâmica é a lei da conservação de energia aplicada a sistemas térmicos: a energia não pode ser criada nem destruída, só transformada — por exemplo, de energia térmica em trabalho mecânico, como acontece numa máquina térmica.",
      "A Segunda Lei da Termodinâmica estabelece que, em processos naturais, o calor tende a fluir espontaneamente do corpo mais quente para o mais frio, nunca o contrário sem intervenção externa — e que a entropia (grau de desordem) de um sistema isolado tende a aumentar com o tempo.",
    ],
    exemplo: {
      titulo: "Vale lembrar",
      texto: "Não confunda calor com temperatura: temperatura é uma medida do estado de um corpo (agitação das partículas); calor é a energia em trânsito entre corpos com temperaturas diferentes.",
    },
  },
];

function Licao({ licao, onVoltar }) {
  if (!licao) return null;
  const Icon = licao.icon;
  return (
    <div style={{ padding: "32px 24px", maxWidth: 760, margin: "0 auto" }}>
      <button onClick={onVoltar} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: COLORS.inkDim, cursor: "pointer", fontSize: 13, marginBottom: 20, padding: 0 }}>
        <ArrowLeft size={16} /> Voltar
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${licao.cor}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={20} color={licao.cor} />
        </div>
        <div>
          <div style={{ color: licao.cor, fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{licao.materia}</div>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 22, color: COLORS.ink, margin: 0 }}>{licao.titulo}</h1>
        </div>
      </div>
      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 14 }}>
        {licao.paragrafos.map((p, i) => (<p key={i} style={{ color: COLORS.inkDim, fontSize: 14.5, lineHeight: 1.7, margin: 0 }}>{p}</p>))}
      </div>
      {licao.exemplo && (
        <div style={{ marginTop: 24, background: `linear-gradient(135deg, ${licao.cor}18, ${COLORS.surface})`, border: `1px solid ${licao.cor}44`, borderRadius: 14, padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Lightbulb size={16} color={licao.cor} />
            <span style={{ color: COLORS.ink, fontFamily: "Sora", fontWeight: 700, fontSize: 13.5 }}>{licao.exemplo.titulo}</span>
          </div>
          <p style={{ color: COLORS.inkDim, fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>{licao.exemplo.texto}</p>
        </div>
      )}
      <button onClick={onVoltar} style={{ ...primaryBtn, marginTop: 28 }}>
        <ArrowLeft size={16} /> Voltar ao início
      </button>
    </div>
  );
}

function Dashboard({ user, setView, onAbrirLicao }) {
  const hoje = [
    { materia: "Matemática", topico: "Progressão Aritmética", tempo: "20 min", licaoId: "pa" },
    { materia: "Português", topico: "Coesão e coerência", tempo: "15 min", licaoId: "coesao" },
    { materia: "Geografia", topico: "Hidrografia amazônica", tempo: "10 min", licaoId: "hidrografia" },
    { materia: "História", topico: "Guerra Fria e Cortina de Ferro", tempo: "15 min", licaoId: "guerrafria" },
    { materia: "Biologia", topico: "Origem da vida: Oparin e Haldane", tempo: "12 min", licaoId: "origemdavida" },
    { materia: "Química", topico: "Estequiometria", tempo: "18 min", licaoId: "estequiometria" },
  ];
  return (
    <div style={{ padding: "32px 24px", maxWidth: 980, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 28, color: COLORS.ink, margin: 0 }}>
        Bom te ver, {user.nome} <span style={{ color: COLORS.accent }}>⚡</span>
      </h1>
      <p style={{ color: COLORS.inkDim, marginTop: 6, fontSize: 14.5 }}>Seu momentum dos últimos dias:</p>
      <div style={{ marginTop: 10, marginBottom: 30 }}><PulseBar value={0.6} /></div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 30 }}>
        <StatCard icon={Flame} color={COLORS.amber} label="Sequência" value={`${user.streak} dias`} />
        <StatCard icon={Star} color={COLORS.accent} label="Nível atual" value={`Nível ${user.level}`} progress={user.xp / (user.level * 100)} />
        <StatCard icon={Sparkles} color="#8C7CFF" label="XP total" value={`${user.xp} XP`} />
      </div>

      <h2 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 17, color: COLORS.ink, marginBottom: 14 }}>O que estudar hoje</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 30 }}>
        {hoje.map((h, i) => (
          <button key={i} onClick={() => onAbrirLicao(h.licaoId)} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", background: COLORS.surface,
            padding: "16px 18px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)",
            width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit",
          }}>
            <div>
              <div style={{ color: COLORS.accent, fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{h.materia}</div>
              <div style={{ color: COLORS.ink, fontFamily: "Inter", fontWeight: 600, fontSize: 15, marginTop: 2 }}>{h.topico}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ color: COLORS.inkDim, fontSize: 12.5, display: "flex", alignItems: "center", gap: 4 }}><Clock size={13} /> {h.tempo}</span>
              <ChevronRight size={18} color={COLORS.inkDim} />
            </div>
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <ActionCard icon={Layers} title="Revisar flashcards" desc="baralhos disponíveis" onClick={() => setView("flashcards")} />
        <ActionCard icon={Zap} title="Fazer um quiz rápido" desc="poucos minutos" onClick={() => setView("quiz")} />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, color, label, value, progress }) {
  return (
    <div style={{ background: COLORS.surface, borderRadius: 14, padding: "16px 18px", border: "1px solid rgba(255,255,255,0.06)" }}>
      <Icon size={18} color={color} />
      <div style={{ color: COLORS.inkDim, fontSize: 12, marginTop: 10 }}>{label}</div>
      <div style={{ color: COLORS.ink, fontFamily: "Sora", fontWeight: 700, fontSize: 19, marginTop: 2 }}>{value}</div>
      {progress !== undefined && (
        <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 3, marginTop: 10, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(progress, 1) * 100}%`, background: color, borderRadius: 3, transition: "width 0.5s ease" }} />
        </div>
      )}
    </div>
  );
}

function ActionCard({ icon: Icon, title, desc, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 14, background: COLORS.surface2, border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14, padding: "18px 20px", cursor: "pointer", textAlign: "left",
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(41,240,201,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={19} color={COLORS.accent} />
      </div>
      <div>
        <div style={{ color: COLORS.ink, fontFamily: "Inter", fontWeight: 600, fontSize: 14.5 }}>{title}</div>
        <div style={{ color: COLORS.inkDim, fontSize: 12.5, marginTop: 2 }}>{desc}</div>
      </div>
    </button>
  );
}

/* ---------------- Flashcards (dados vêm da API) ---------------- */

function Flashcards({ decks }) {
  const materias = Object.keys(decks);
  const [materia, setMateria] = useState(materias[0]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (materias.length === 0) return <ErrorBox message="Nenhum baralho cadastrado ainda." />;

  const cards = decks[materia];
  const card = cards[idx];

  const go = (dir) => { setFlipped(false); setIdx((p) => (p + dir + cards.length) % cards.length); };

  return (
    <div style={{ padding: "32px 24px", maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 24, color: COLORS.ink, marginBottom: 18 }}>Flashcards</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {materias.map((m) => (
          <button key={m} onClick={() => { setMateria(m); setIdx(0); setFlipped(false); }} style={{
            padding: "7px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)",
            background: m === materia ? COLORS.accent : "transparent", color: m === materia ? COLORS.bg : COLORS.inkDim,
            fontFamily: "Inter", fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>{m}</button>
        ))}
      </div>

      <div onClick={() => setFlipped((f) => !f)} style={{
        minHeight: 260, borderRadius: 20, cursor: "pointer",
        background: flipped ? `linear-gradient(135deg, ${COLORS.surface2}, ${COLORS.surface})` : `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDim})`,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 36, textAlign: "center", position: "relative",
        border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <span style={{ position: "absolute", top: 16, right: 18, color: flipped ? COLORS.inkDim : "rgba(15,14,46,0.55)", display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 600 }}>
          <RotateCw size={13} /> {flipped ? "resposta" : "pergunta"}
        </span>
        <p style={{ fontFamily: flipped ? "Inter" : "Sora", fontWeight: flipped ? 500 : 700, fontSize: flipped ? 16 : 20, color: flipped ? COLORS.ink : COLORS.bg, lineHeight: 1.5, margin: 0 }}>
          {flipped ? card.resposta : card.pergunta}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18 }}>
        <button onClick={() => go(-1)} style={navBtn}><ChevronLeft size={20} color={COLORS.ink} /></button>
        <span style={{ color: COLORS.inkDim, fontFamily: "JetBrains Mono", fontSize: 13 }}>{idx + 1} / {cards.length}</span>
        <button onClick={() => go(1)} style={navBtn}><ChevronRight size={20} color={COLORS.ink} /></button>
      </div>
    </div>
  );
}

const navBtn = { width: 44, height: 44, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: COLORS.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };

/* ---------------- Resumos (dados vêm da API) ---------------- */

function Resumos({ resumos }) {
  const [open, setOpen] = useState(0);
  if (resumos.length === 0) return <ErrorBox message="Nenhum resumo cadastrado ainda." />;
  return (
    <div style={{ padding: "32px 24px", maxWidth: 760, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 24, color: COLORS.ink, marginBottom: 22 }}>Resumos e pontos principais</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {resumos.map((r, i) => {
          const isOpen = open === i;
          return (
            <div key={r.id} style={{ background: COLORS.surface, borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <button onClick={() => setOpen(isOpen ? -1 : i)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                <div>
                  <div style={{ color: COLORS.accent, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{r.materia}</div>
                  <div style={{ color: COLORS.ink, fontFamily: "Inter", fontWeight: 600, fontSize: 15, marginTop: 3 }}>{r.titulo}</div>
                </div>
                <ChevronRight size={18} color={COLORS.inkDim} style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {isOpen && (
                <div style={{ padding: "0 18px 18px 18px" }}>
                  {r.pontos.map((p, j) => (
                    <div key={j} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                      <div style={{ width: 5, height: 5, borderRadius: 3, background: COLORS.accent, marginTop: 7, flexShrink: 0 }} />
                      <span style={{ color: COLORS.inkDim, fontSize: 13.5, lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const MATRIZ_PAS1 = [
  {
    id: "humanidades", nome: "Humanidades", sub: "Filosofia, Geografia, História e Sociologia", icon: Landmark, cor: "#FFB627",
    topicos: [
      "Origem dos mitos e primeiras formas de explicar o mundo",
      "A existência humana como questão filosófica; lógica e argumentação",
      "Perspectiva decolonial: releitura crítica da história a partir dos povos colonizados",
      "Protagonismo indígena e negro na formação da sociedade brasileira",
      "Diáspora Atlântica e o processo de colonização da América",
      "Formação das cidades-estado até as monarquias nacionais",
      "Conceitos de lugar, região, paisagem, território e espaço geográfico",
      "Linguagem cartográfica: como ler e interpretar mapas",
      "Urbanização e seus impactos socioambientais",
      "Desigualdades sociais de classe, raça e gênero",
      "Método científico x senso comum: como se produz conhecimento",
    ],
  },
  {
    id: "linguagens", nome: "Linguagens", sub: "Língua Portuguesa, Línguas Estrangeiras e Artes", icon: BookOpen, cor: "#29F0C9",
    topicos: [
      "Elementos de composição em artes visuais, música e teatro",
      "Leitura crítica: separar fatos de opiniões em diferentes gêneros textuais",
      "Variação linguística e adequação da língua a cada contexto",
      "Coesão, coerência e morfossintaxe do período simples",
      "Acentuação gráfica, uso da crase e pontuação",
      "Estilos de época: Trovadorismo, Humanismo, Classicismo, Barroco, Arcadismo",
      "Gêneros literários: lírico, épico, drama e prosa moderna",
      "Identidades na literatura (afro-brasileira, indígena, LGBTQIA+, entre outras)",
      "Leitura e interpretação de textos em língua estrangeira (inglês, espanhol ou francês)",
    ],
  },
  {
    id: "matematica", nome: "Matemática", sub: "Números, Funções, Geometria e Progressões", icon: Calculator, cor: "#8C7CFF",
    topicos: [
      "Conjuntos e o conceito de função",
      "Geometria plana: perímetro, área, semelhança e trigonometria",
      "Plano cartesiano e representação gráfica",
      "Funções afins e quadráticas (gráfico, domínio, imagem)",
      "Funções exponenciais e logarítmicas",
      "Progressões aritméticas (PA) e geométricas (PG)",
      "Matemática financeira: juros simples e compostos",
    ],
  },
  {
    id: "ciencias", nome: "Ciências da Natureza", sub: "Física, Química e Biologia", icon: FlaskConical, cor: "#FF5C7A",
    topicos: [
      "Leis de Newton, trabalho, energia mecânica e impulso",
      "Gravitação universal e noções de astronomia",
      "Modelos atômicos e ligações químicas",
      "Balanceamento de equações e estequiometria",
      "Teoria celular, organelas e divisão celular",
      "Relações ecológicas, cadeias alimentares e ciclos biogeoquímicos",
      "Questões sociocientíficas: energia, saúde pública, sustentabilidade e desmatamento",
    ],
  },
];

/* ---------------- Estudos (baseado na Matriz de Referência oficial do PAS 1) ---------------- */

function Estudos({ setView }) {
  const [feitos, setFeitos] = useState({});
  const toggle = (key) => setFeitos((f) => ({ ...f, [key]: !f[key] }));
  const totalTopicos = MATRIZ_PAS1.reduce((acc, a) => acc + a.topicos.length, 0);
  const totalFeitos = Object.values(feitos).filter(Boolean).length;

  return (
    <div style={{ padding: "32px 24px", maxWidth: 820, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 6 }}>
        <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 24, color: COLORS.ink, margin: 0 }}>Estudos</h1>
        <button onClick={() => setView("aulas")} style={{
          display: "flex", alignItems: "center", gap: 6, background: "rgba(41,240,201,0.1)",
          border: "1px solid rgba(41,240,201,0.3)", color: COLORS.accent, borderRadius: 10,
          padding: "8px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
        }}>
          <GraduationCap size={15} /> Ver aulas escritas
        </button>
      </div>
      <p style={{ color: COLORS.inkDim, fontSize: 14, marginBottom: 6 }}>
        Temas organizados a partir da Matriz de Referência oficial do PAS 1 — o documento que baseia a elaboração da prova.
      </p>
      <p style={{ color: COLORS.accent, fontSize: 12.5, marginBottom: 22, fontFamily: "JetBrains Mono" }}>
        {totalFeitos} / {totalTopicos} tópicos marcados
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {MATRIZ_PAS1.map((area) => {
          const Icon = area.icon;
          const feitosArea = area.topicos.filter((_, i) => feitos[`${area.id}-${i}`]).length;
          return (
            <div key={area.id} style={{ background: COLORS.surface, borderRadius: 16, padding: "20px 20px 8px", border: `1px solid ${area.cor}33` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${area.cor}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} color={area.cor} />
                </div>
                <div>
                  <div style={{ color: COLORS.ink, fontFamily: "Sora", fontWeight: 700, fontSize: 15 }}>{area.nome}</div>
                  <div style={{ color: COLORS.inkDim, fontSize: 11.5 }}>{area.sub}</div>
                </div>
                <span style={{ marginLeft: "auto", color: area.cor, fontFamily: "JetBrains Mono", fontSize: 12 }}>{feitosArea}/{area.topicos.length}</span>
              </div>
              <div style={{ marginTop: 12 }}>
                {area.topicos.map((t, i) => {
                  const key = `${area.id}-${i}`;
                  const done = !!feitos[key];
                  return (
                    <button key={key} onClick={() => toggle(key)} style={{
                      display: "flex", alignItems: "flex-start", gap: 10, width: "100%", background: "none", border: "none",
                      cursor: "pointer", textAlign: "left", padding: "9px 0", borderTop: "1px solid rgba(255,255,255,0.05)",
                    }}>
                      {done ? <CheckCircle2 size={17} color={area.cor} style={{ marginTop: 1, flexShrink: 0 }} /> : <Circle size={17} color={COLORS.inkDim} style={{ marginTop: 1, flexShrink: 0 }} />}
                      <span style={{ color: done ? COLORS.inkDim : COLORS.ink, fontSize: 13.5, lineHeight: 1.4, textDecoration: done ? "line-through" : "none" }}>{t}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <p style={{ color: COLORS.inkDim, fontSize: 11.5, marginTop: 22, textAlign: "center", lineHeight: 1.5 }}>
        Baseado na Matriz de Referência oficial do PAS 1 (Cebraspe/UnB). O documento completo, com todos os detalhes, está na Biblioteca.
      </p>
    </div>
  );
}

/* ---------------- Como Começar: primeiros passos e como não zerar ---------------- */

const ZERA_REDACAO = [
  {
    titulo: "Fugir do tema",
    texto: "Escrever sobre um assunto diferente do que foi pedido — mesmo que relacionado — zera a redação inteira. É o motivo mais comum de nota zero.",
  },
  {
    titulo: "Não entregar um texto",
    texto: "Folha em branco, poucas linhas ou um texto incompleto contam como 'inexistência de texto' e também zeram a prova.",
  },
  {
    titulo: "Se identificar dentro do texto",
    texto: "Escrever seu nome, assinar, ou deixar qualquer marca que te identifique dentro da redação anula a prova, mesmo que o conteúdo esteja ótimo.",
  },
];

const ANTES_DE_ESCREVER = [
  "Leia o comando da prova pelo menos duas vezes antes de começar",
  "Identifique com clareza o tema E o tipo/gênero de texto pedido (dissertativo, narrativo, carta, resumo, etc.)",
  "Rabisque num canto da folha 2 ou 3 ideias centrais que você vai usar — isso evita fugir do tema no meio do texto",
  "Reserve um tempo curto pra planejar antes de escrever a versão final; não pule direto pra escrita",
];

const COMO_ABRIR = [
  { tipo: "Dissertativo-argumentativo", dica: "Contextualize o tema em 1 ou 2 frases e já apresente sua tese. Evite abrir com clichês genéricos do tipo 'desde os primórdios da humanidade...'" },
  { tipo: "Narrativo", dica: "Situe o leitor: quem são os personagens, onde e quando a história acontece. As primeiras linhas devem já criar uma cena." },
  { tipo: "Descritivo", dica: "Escolha um ponto de vista (do geral pro específico, ou o contrário) e diga logo o que vai ser descrito." },
  { tipo: "Carta ou gênero epistolar", dica: "Siga a estrutura própria do gênero (local, data, saudação) antes de entrar no conteúdo principal." },
];

const CHECKLIST_FINAL = [
  "Reli o comando e confirmo que atendi ao tema e ao tipo de texto pedido",
  "Meu texto tem uma extensão adequada (nem curto demais, nem passando de 30 linhas)",
  "Não usei nenhuma palavra, nome ou marca que possa me identificar",
  "Revisei ortografia, acentuação e concordância",
  "Minha letra está legível e respeitei as margens da folha",
];

function ComoComecar() {
  const [feitos, setFeitos] = useState({});
  const toggle = (k) => setFeitos((f) => ({ ...f, [k]: !f[k] }));

  return (
    <div style={{ padding: "32px 24px", maxWidth: 820, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 24, color: COLORS.ink, marginBottom: 6 }}>Como Começar</h1>
      <p style={{ color: COLORS.inkDim, fontSize: 14, marginBottom: 26 }}>
        Um guia direto pra você não travar na hora de começar a escrever — e, principalmente, não zerar a redação.
      </p>

      <div style={{ background: `linear-gradient(135deg, ${COLORS.danger}18, ${COLORS.surface})`, border: `1px solid ${COLORS.danger}44`, borderRadius: 16, padding: 20, marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <XCircle size={19} color={COLORS.danger} />
          <span style={{ color: COLORS.ink, fontFamily: "Sora", fontWeight: 700, fontSize: 15.5 }}>O que zera a redação (nota igual a zero)</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ZERA_REDACAO.map((z, i) => (
            <div key={i} style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${COLORS.danger}22`, color: COLORS.danger, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora", fontWeight: 700, fontSize: 12, flexShrink: 0, marginTop: 1 }}>
                {i + 1}
              </div>
              <div>
                <div style={{ color: COLORS.ink, fontFamily: "Inter", fontWeight: 600, fontSize: 13.5 }}>{z.titulo}</div>
                <div style={{ color: COLORS.inkDim, fontSize: 12.5, marginTop: 3, lineHeight: 1.5 }}>{z.texto}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 16, color: COLORS.ink, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <Flag size={16} color={COLORS.accent} /> Antes de escrever a primeira linha
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
        {ANTES_DE_ESCREVER.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: COLORS.surface, borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ width: 5, height: 5, borderRadius: 3, background: COLORS.accent, marginTop: 7, flexShrink: 0 }} />
            <span style={{ color: COLORS.ink, fontSize: 13, lineHeight: 1.5 }}>{p}</span>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 16, color: COLORS.ink, marginBottom: 12 }}>Como abrir o texto (depende do que a prova pedir)</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {COMO_ABRIR.map((c, i) => (
          <div key={i} style={{ background: COLORS.surface, borderRadius: 14, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ color: COLORS.accent, fontFamily: "Sora", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{c.tipo}</div>
            <div style={{ color: COLORS.inkDim, fontSize: 12.5, lineHeight: 1.5 }}>{c.dica}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 16, color: COLORS.ink, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <ListChecks size={16} color={COLORS.accent} /> Checklist antes de entregar
      </h2>
      <div style={{ background: COLORS.surface, borderRadius: 14, padding: "8px 18px", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 24 }}>
        {CHECKLIST_FINAL.map((item, i) => {
          const key = `check-${i}`;
          const done = !!feitos[key];
          return (
            <button key={key} onClick={() => toggle(key)} style={{
              display: "flex", alignItems: "flex-start", gap: 10, width: "100%", background: "none", border: "none",
              cursor: "pointer", textAlign: "left", padding: "10px 0", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}>
              {done ? <CheckCircle2 size={16} color={COLORS.accent} style={{ marginTop: 1, flexShrink: 0 }} /> : <Circle size={16} color={COLORS.inkDim} style={{ marginTop: 1, flexShrink: 0 }} />}
              <span style={{ color: done ? COLORS.inkDim : COLORS.ink, fontSize: 13, lineHeight: 1.4, textDecoration: done ? "line-through" : "none" }}>{item}</span>
            </button>
          );
        })}
      </div>

      <p style={{ color: COLORS.inkDim, fontSize: 11.5, textAlign: "center", lineHeight: 1.5 }}>
        As regras de nota zero são as oficiais do PAS (Cebraspe/UnB). Pra critérios detalhados de pontuação e estrutura, veja a aba Redação.
      </p>
    </div>
  );
}

/* ---------------- Redação: como escrever bem para o PAS ---------------- */

const ESTRUTURA_DISSERTATIVA = [
  { titulo: "Introdução", texto: "Apresente o tema e já deixe clara a sua tese (o ponto de vista que você vai defender no texto)." },
  { titulo: "Desenvolvimento", texto: "Traga 2 argumentos consistentes, cada um em um parágrafo, com exemplos ou dados que sustentem sua tese." },
  { titulo: "Conclusão", texto: "Retome a ideia central e feche o texto — em textos argumentativos, é comum propor uma solução ou encaminhamento para o problema discutido." },
];

const MACRO_MICRO = [
  {
    titulo: "Macroestrutura", cor: "#29F0C9", icon: AlignLeft,
    itens: [
      "Apresentação: respeite as margens, escreva com letra legível e marque bem os parágrafos.",
      "Estrutura textual: organize o texto com começo, meio e fim, coerentes entre si.",
      "Desenvolvimento do tema: não fuja do assunto pedido — é o erro que mais derruba a nota.",
    ],
  },
  {
    titulo: "Microestrutura", cor: "#FFB627", icon: PenTool,
    itens: [
      "Grafia e acentuação corretas — releia procurando erros de ortografia.",
      "Morfossintaxe: concordância verbal e nominal, regência, pontuação.",
      "Propriedade vocabular: use as palavras no sentido certo, evite repetições.",
    ],
  },
];

const ERROS_COMUNS = [
  "Fugir do tema proposto no comando da prova",
  "Não respeitar o tipo ou gênero textual solicitado (dissertativo, narrativo, carta, resumo, etc.)",
  "Ultrapassar as 30 linhas ou deixar o texto curto demais",
  "Letra ilegível ou desrespeito às margens",
  "Erros de concordância e crase",
  "Textos genéricos, sem argumentos ou exemplos concretos",
];

function Redacao() {
  const [feitos, setFeitos] = useState({});
  const toggle = (k) => setFeitos((f) => ({ ...f, [k]: !f[k] }));

  return (
    <div style={{ padding: "32px 24px", maxWidth: 820, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 24, color: COLORS.ink, marginBottom: 6 }}>Redação</h1>
      <p style={{ color: COLORS.inkDim, fontSize: 14, marginBottom: 22 }}>
        Guia prático baseado nos critérios oficiais de avaliação da redação do PAS.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 26 }}>
        <StatCard icon={FileText} color={COLORS.accent} label="Vale" value="10 pontos" />
        <StatCard icon={AlignLeft} color={COLORS.amber} label="Extensão máxima" value="30 linhas" />
        <StatCard icon={PenTool} color="#8C7CFF" label="Tipo textual" value="Varia a cada prova" />
      </div>

      <p style={{ color: COLORS.inkDim, fontSize: 13, marginBottom: 26, lineHeight: 1.5 }}>
        Diferente do ENEM, o PAS não pede sempre um texto dissertativo-argumentativo — o comando pode pedir
        narração, descrição, carta, resumo, texto instrucional, entre outros. <strong style={{ color: COLORS.ink }}>Leia o comando com atenção
        antes de escrever</strong> para saber exatamente o que é pedido.
      </p>

      <h2 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 16, color: COLORS.ink, marginBottom: 12 }}>Como a redação é avaliada</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
        {MACRO_MICRO.map((bloco) => {
          const Icon = bloco.icon;
          return (
            <div key={bloco.titulo} style={{ background: COLORS.surface, borderRadius: 14, padding: 18, border: `1px solid ${bloco.cor}33` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Icon size={17} color={bloco.cor} />
                <span style={{ color: COLORS.ink, fontFamily: "Sora", fontWeight: 700, fontSize: 14 }}>{bloco.titulo}</span>
              </div>
              {bloco.itens.map((it, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ width: 4, height: 4, borderRadius: 2, background: bloco.cor, marginTop: 6, flexShrink: 0 }} />
                  <span style={{ color: COLORS.inkDim, fontSize: 12.5, lineHeight: 1.5 }}>{it}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <h2 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 16, color: COLORS.ink, marginBottom: 12 }}>Estrutura de um texto dissertativo-argumentativo</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {ESTRUTURA_DISSERTATIVA.map((e, i) => (
          <div key={i} style={{ display: "flex", gap: 14, background: COLORS.surface, borderRadius: 14, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${COLORS.accent}22`, color: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora", fontWeight: 700, fontSize: 12.5, flexShrink: 0 }}>
              {i + 1}
            </div>
            <div>
              <div style={{ color: COLORS.ink, fontFamily: "Inter", fontWeight: 600, fontSize: 13.5 }}>{e.titulo}</div>
              <div style={{ color: COLORS.inkDim, fontSize: 12.5, marginTop: 3, lineHeight: 1.5 }}>{e.texto}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 16, color: COLORS.ink, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <AlertTriangle size={16} color={COLORS.danger} /> Erros que mais derrubam a nota
      </h2>
      <div style={{ background: COLORS.surface, borderRadius: 14, padding: "8px 18px", border: `1px solid ${COLORS.danger}33`, marginBottom: 28 }}>
        {ERROS_COMUNS.map((erro, i) => {
          const key = `erro-${i}`;
          const done = !!feitos[key];
          return (
            <button key={key} onClick={() => toggle(key)} style={{
              display: "flex", alignItems: "flex-start", gap: 10, width: "100%", background: "none", border: "none",
              cursor: "pointer", textAlign: "left", padding: "10px 0", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}>
              {done ? <CheckCircle2 size={16} color={COLORS.accent} style={{ marginTop: 1, flexShrink: 0 }} /> : <Circle size={16} color={COLORS.inkDim} style={{ marginTop: 1, flexShrink: 0 }} />}
              <span style={{ color: done ? COLORS.inkDim : COLORS.ink, fontSize: 13, lineHeight: 1.4, textDecoration: done ? "line-through" : "none" }}>{erro}</span>
            </button>
          );
        })}
      </div>

      <p style={{ color: COLORS.inkDim, fontSize: 11.5, textAlign: "center", lineHeight: 1.5 }}>
        Baseado nos critérios oficiais de avaliação da redação do PAS (Cebraspe/UnB). Pratique escrevendo sobre os
        temas da aba Estudos e peça pra alguém revisar seu texto antes da prova.
      </p>
    </div>
  );
}

/* ---------------- Biblioteca (provas anteriores e materiais, dados da API) ---------------- */

const CORES_TIPO = { "Site Oficial": "#29F0C9", Provas: "#FFB627", Material: "#8C7CFF" };

function Aulas({ onAbrirLicao }) {
  const porMateria = {};
  LICOES.forEach((l) => {
    if (!porMateria[l.materia]) porMateria[l.materia] = [];
    porMateria[l.materia].push(l);
  });

  return (
    <div style={{ padding: "32px 24px", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 24, color: COLORS.ink, marginBottom: 6 }}>Aulas</h1>
      <p style={{ color: COLORS.inkDim, fontSize: 14, marginBottom: 26 }}>
        {LICOES.length} aulas escritas cobrindo os principais temas do PAS — estude no seu ritmo, sem sair da plataforma.
      </p>
      {Object.entries(porMateria).map(([materia, aulas]) => (
        <div key={materia} style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 15, color: aulas[0].cor, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>{materia}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {aulas.map((aula) => {
              const Icon = aula.icon;
              return (
                <button key={aula.id} onClick={() => onAbrirLicao(aula.id)} style={{
                  display: "flex", alignItems: "center", gap: 12, background: COLORS.surface,
                  border: `1px solid ${aula.cor}33`, borderRadius: 14, padding: "14px 16px", cursor: "pointer", textAlign: "left",
                }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: `${aula.cor}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={16} color={aula.cor} />
                  </div>
                  <span style={{ color: COLORS.ink, fontFamily: "Inter", fontWeight: 600, fontSize: 13.5, lineHeight: 1.3 }}>{aula.titulo}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function Biblioteca({ materiais }) {
  const [filtro, setFiltro] = useState("Todos");
  const [aberto, setAberto] = useState(null);
  const tipos = ["Todos", "Provas", "Material", "Site Oficial"];
  const itens = filtro === "Todos" ? materiais : materiais.filter((m) => m.tipo === filtro);

  if (materiais.length === 0) return <ErrorBox message="Nenhum material cadastrado ainda." />;

  return (
    <div style={{ padding: "32px 24px", maxWidth: 980, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <Library size={22} color={COLORS.accent} />
        <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 24, color: COLORS.ink, margin: 0 }}>Biblioteca</h1>
      </div>
      <p style={{ color: COLORS.inkDim, fontSize: 14, marginBottom: 22 }}>
        Provas anteriores, gabaritos e materiais de apoio — abre direto aqui dentro, sem sair da plataforma.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {tipos.map((t) => (
          <button key={t} onClick={() => setFiltro(t)} style={{
            padding: "7px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)",
            background: t === filtro ? COLORS.accent : "transparent", color: t === filtro ? COLORS.bg : COLORS.inkDim,
            fontFamily: "Inter", fontWeight: 600, fontSize: 13, cursor: "pointer",
          }}>{t}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
        {itens.map((item) => {
          const cor = CORES_TIPO[item.tipo] || COLORS.accent;
          return (
            <button key={item.id} onClick={() => item.url && setAberto(item)} style={{
              background: `linear-gradient(160deg, ${cor}22, ${COLORS.surface})`, border: `1px solid ${cor}44`,
              borderRadius: 14, padding: "18px 16px", display: "flex", flexDirection: "column",
              justifyContent: "space-between", minHeight: 170, position: "relative", overflow: "hidden",
              textAlign: "left", cursor: item.url ? "pointer" : "default",
            }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: cor }} />
              <div>
                <BookMarked size={20} color={cor} />
                <div style={{ color: COLORS.ink, fontFamily: "Sora", fontWeight: 700, fontSize: 14, marginTop: 10, lineHeight: 1.3 }}>{item.titulo}</div>
                <div style={{ color: COLORS.inkDim, fontSize: 11.5, marginTop: 6 }}>{item.materia} · {item.ano}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: cor, textTransform: "uppercase", letterSpacing: 0.4, background: `${cor}18`, padding: "3px 8px", borderRadius: 6 }}>
                  {item.tipo}
                </span>
                <span style={{ color: item.url ? COLORS.inkDim : "rgba(156,154,214,0.4)", display: "flex", padding: 4 }} title={item.url ? "Abrir aqui dentro" : "Link ainda não cadastrado"}>
                  <Download size={16} />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {aberto && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", flexDirection: "column", padding: "24px" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", background: COLORS.surface,
            padding: "12px 18px", borderRadius: "12px 12px 0 0", border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none",
          }}>
            <div>
              <div style={{ color: CORES_TIPO[aberto.tipo] || COLORS.accent, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{aberto.materia} · {aberto.ano}</div>
              <div style={{ color: COLORS.ink, fontFamily: "Sora", fontWeight: 700, fontSize: 15 }}>{aberto.titulo}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <a href={aberto.url} target="_blank" rel="noreferrer" style={{ color: COLORS.inkDim, fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                Abrir em nova guia <ArrowRight size={13} />
              </a>
              <button onClick={() => setAberto(null)} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: COLORS.ink, width: 30, height: 30, borderRadius: 8, cursor: "pointer", fontSize: 16 }}>×</button>
            </div>
          </div>
          <iframe src={aberto.url} title={aberto.titulo} style={{ flex: 1, width: "100%", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0 0 12px 12px", background: "#fff" }} />
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 6, textAlign: "center" }}>
            Se o conteúdo não aparecer aqui (alguns sites bloqueiam essa visualização), use "Abrir em nova guia" acima.
          </p>
        </div>
      )}
    </div>
  );
}

/* ---------------- Quiz individual (valida cada resposta na API) ---------------- */

const quizWrap = { minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px 24px" };
const primaryBtn = { padding: "12px 24px", borderRadius: 10, border: "none", background: COLORS.accent, color: COLORS.bg, fontFamily: "Sora", fontWeight: 700, fontSize: 14.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 };

function Quiz({ perguntas, onFinish }) {
  const [stage, setStage] = useState("intro");
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [correta, setCorreta] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef(null);

  const q = perguntas[qIdx];

  useEffect(() => {
    if (stage !== "question") return;
    setTimeLeft(10);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); setStage("reveal"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [stage, qIdx]);

  const choose = async (i) => {
    if (selected !== null) return;
    clearInterval(timerRef.current);
    setSelected(i);
    try {
      const resultado = await api.responderQuiz(q.id, i);
      setCorreta(resultado.correta);
      if (resultado.acertou) setScore((s) => s + 1);
    } catch {
      setCorreta(null);
    }
    setTimeout(() => setStage("reveal"), 500);
  };

  const next = () => {
    if (qIdx + 1 < perguntas.length) { setQIdx((i) => i + 1); setSelected(null); setCorreta(null); setStage("question"); }
    else setStage("end");
  };

  if (perguntas.length === 0) return <ErrorBox message="Nenhuma pergunta cadastrada ainda." />;

  if (stage === "intro") {
    return (
      <div style={quizWrap}>
        <Zap size={40} color={COLORS.accent} />
        <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 26, color: COLORS.ink, margin: "16px 0 6px" }}>Quiz relâmpago</h1>
        <p style={{ color: COLORS.inkDim, fontSize: 14.5, marginBottom: 26 }}>{perguntas.length} perguntas · 10 segundos cada</p>
        <button onClick={() => setStage("question")} style={primaryBtn}>Começar <ArrowRight size={16} /></button>
      </div>
    );
  }

  if (stage === "end") {
    return (
      <div style={quizWrap}>
        <Trophy size={40} color={COLORS.amber} />
        <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 26, color: COLORS.ink, margin: "16px 0 6px" }}>{score} de {perguntas.length} corretas</h1>
        <p style={{ color: COLORS.inkDim, fontSize: 14.5, marginBottom: 26 }}>Você ganhou {score * 15} XP nessa rodada.</p>
        <button onClick={() => { const xp = score * 15; setQIdx(0); setScore(0); setSelected(null); setCorreta(null); setStage("intro"); onFinish(xp); }} style={primaryBtn}>Jogar de novo</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "28px 20px", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ color: COLORS.inkDim, fontFamily: "JetBrains Mono", fontSize: 12.5 }}>Pergunta {qIdx + 1} / {perguntas.length}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "JetBrains Mono", fontSize: 13, color: timeLeft <= 3 ? COLORS.danger : COLORS.ink }}>
          <Clock size={14} /> {timeLeft}s
        </div>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, marginBottom: 26, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(timeLeft / 10) * 100}%`, background: timeLeft <= 3 ? COLORS.danger : COLORS.accent, transition: "width 1s linear" }} />
      </div>
      <h2 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 20, color: COLORS.ink, marginBottom: 24, lineHeight: 1.4 }}>{q.pergunta}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {q.opcoes.map((op, i) => {
          const isCorrect = correta !== null && i === correta;
          const isSelected = i === selected;
          let bg = OPTION_COLORS[i]; let opacity = 1;
          if (stage === "reveal") {
            if (isCorrect) bg = "#3DDC84";
            else if (isSelected) bg = COLORS.danger;
            else opacity = 0.35;
          }
          return (
            <button key={i} onClick={() => choose(i)} disabled={stage === "reveal"} style={{
              padding: "18px 16px", borderRadius: 14, border: "none", cursor: stage === "reveal" ? "default" : "pointer",
              background: bg, opacity, color: "#0F0E2E", fontFamily: "Inter", fontWeight: 700, fontSize: 14.5,
              display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.25s ease", textAlign: "left",
            }}>
              {op}
              {stage === "reveal" && isCorrect && <Check size={18} />}
              {stage === "reveal" && isSelected && !isCorrect && <X size={18} />}
            </button>
          );
        })}
      </div>
      {stage === "reveal" && (
        <button onClick={next} style={{ ...primaryBtn, marginTop: 26 }}>
          {qIdx + 1 < perguntas.length ? "Próxima pergunta" : "Ver resultado"} <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}

/* ---------------- Desafio em grupo (Socket.IO real) ---------------- */

function ChallengeQuiz({ userName, onFinish }) {
  const socketRef = useRef(null);
  const [stage, setStage] = useState("menu"); // menu | criar | lobby | question | reveal | podium
  const [codigo, setCodigo] = useState("");
  const [codigoInput, setCodigoInput] = useState("");
  const [jogadores, setJogadores] = useState([]);
  const [souAnfitriao, setSouAnfitriao] = useState(false);
  const [pergunta, setPergunta] = useState(null);
  const [opcaoEscolhida, setOpcaoEscolhida] = useState(null);
  const [correta, setCorreta] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [erro, setErro] = useState("");
  const timerRef = useRef(null);

  // criação de perguntas personalizadas
  const [formPergunta, setFormPergunta] = useState("");
  const [formOpcoes, setFormOpcoes] = useState(["", "", "", ""]);
  const [formCorreta, setFormCorreta] = useState(0);
  const [minhasPerguntas, setMinhasPerguntas] = useState([]);

  const adicionarPergunta = () => {
    if (!formPergunta.trim() || formOpcoes.some((o) => !o.trim())) return;
    setMinhasPerguntas((p) => [...p, { pergunta: formPergunta.trim(), opcoes: formOpcoes.map((o) => o.trim()), correta: formCorreta }]);
    setFormPergunta(""); setFormOpcoes(["", "", "", ""]); setFormCorreta(0);
  };
  const removerPergunta = (i) => setMinhasPerguntas((p) => p.filter((_, idx) => idx !== i));

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    socket.on("sala-atualizada", (estado) => setJogadores(estado.jogadores));
    socket.on("pergunta", (p) => {
      setPergunta(p); setOpcaoEscolhida(null); setCorreta(null); setStage("question"); setTimeLeft(10);
    });
    socket.on("resultado-resposta", ({ correta }) => setCorreta(correta));
    socket.on("rodada-revelada", ({ correta, ranking }) => { setCorreta(correta); setRanking(ranking); setStage("reveal"); });
    socket.on("desafio-finalizado", ({ ranking }) => { setRanking(ranking); setStage("podium"); });

    return () => {
      socket.off("sala-atualizada"); socket.off("pergunta"); socket.off("resultado-resposta");
      socket.off("rodada-revelada"); socket.off("desafio-finalizado");
    };
  }, []);

  useEffect(() => {
    if (stage !== "question") return;
    timerRef.current = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(timerRef.current);
  }, [stage, pergunta]);

  const criarSala = (perguntasPersonalizadas) => {
    socketRef.current.emit("criar-sala", { nome: userName, perguntasPersonalizadas }, (res) => {
      if (!res.ok) return setErro(res.erro);
      setCodigo(res.codigo); setJogadores(res.jogadores); setSouAnfitriao(true); setStage("lobby");
    });
  };

  const entrarSala = () => {
    if (!codigoInput) return;
    socketRef.current.emit("entrar-sala", { codigo: codigoInput, nome: userName }, (res) => {
      if (!res.ok) return setErro(res.erro);
      setCodigo(res.codigo); setJogadores(res.jogadores); setSouAnfitriao(false); setStage("lobby");
    });
  };

  const iniciar = () => socketRef.current.emit("iniciar-desafio", { codigo });
  const responder = (i) => {
    if (opcaoEscolhida !== null) return;
    setOpcaoEscolhida(i);
    socketRef.current.emit("responder", { codigo, opcao: i, tempoRestante: timeLeft });
  };
  const proxima = () => socketRef.current.emit("proxima-pergunta", { codigo });

  if (stage === "menu") {
    return (
      <div style={quizWrap}>
        <Trophy size={36} color={COLORS.amber} />
        <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 22, color: COLORS.ink, margin: "14px 0 20px" }}>Desafio em grupo</h1>
        {erro && <span style={{ color: COLORS.danger, fontSize: 13, marginBottom: 12 }}>{erro}</span>}
        <button onClick={() => criarSala(null)} style={{ ...primaryBtn, marginBottom: 10 }}>Criar sala (perguntas prontas)</button>
        <button onClick={() => setStage("criar")} style={{ ...primaryBtn, marginBottom: 14, background: COLORS.surface2, color: COLORS.ink }}>
          <PenTool size={16} /> Criar minhas perguntas
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={codigoInput} onChange={(e) => setCodigoInput(e.target.value)} placeholder="Código da sala"
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: COLORS.surface, color: COLORS.ink, fontFamily: "JetBrains Mono", width: 160 }} />
          <button onClick={entrarSala} style={{ ...primaryBtn, background: COLORS.surface2, color: COLORS.ink }}>Entrar</button>
        </div>
      </div>
    );
  }

  if (stage === "criar") {
    const podeAdicionar = formPergunta.trim() && formOpcoes.every((o) => o.trim());
    return (
      <div style={{ padding: "28px 20px", maxWidth: 640, margin: "0 auto" }}>
        <button onClick={() => setStage("menu")} style={{
          display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
          color: COLORS.inkDim, cursor: "pointer", fontSize: 13, marginBottom: 16, padding: 0,
        }}>
          <ArrowLeft size={16} /> Voltar
        </button>
        <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 20, color: COLORS.ink, marginBottom: 18 }}>Criar minhas perguntas</h1>

        <div style={{ background: COLORS.surface, borderRadius: 14, padding: 18, border: "1px solid rgba(255,255,255,0.07)", marginBottom: 18 }}>
          <input
            value={formPergunta}
            onChange={(e) => setFormPergunta(e.target.value)}
            placeholder="Digite a pergunta"
            style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: COLORS.bg, color: COLORS.ink, fontFamily: "Inter", fontSize: 14, marginBottom: 10 }}
          />
          {formOpcoes.map((op, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <button onClick={() => setFormCorreta(i)} title="Marcar como correta" style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0, cursor: "pointer",
                border: `2px solid ${formCorreta === i ? "#3DDC84" : "rgba(255,255,255,0.25)"}`,
                background: formCorreta === i ? "#3DDC84" : "transparent",
              }} />
              <input
                value={op}
                onChange={(e) => setFormOpcoes((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))}
                placeholder={`Opção ${i + 1}${formCorreta === i ? " (correta)" : ""}`}
                style={{ flex: 1, padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: COLORS.bg, color: COLORS.ink, fontFamily: "Inter", fontSize: 13.5 }}
              />
            </div>
          ))}
          <button onClick={adicionarPergunta} disabled={!podeAdicionar} style={{ ...primaryBtn, marginTop: 8, opacity: podeAdicionar ? 1 : 0.5, cursor: podeAdicionar ? "pointer" : "default" }}>
            Adicionar pergunta
          </button>
        </div>

        {minhasPerguntas.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ color: COLORS.inkDim, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
              Perguntas adicionadas ({minhasPerguntas.length})
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {minhasPerguntas.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: COLORS.surface, borderRadius: 10, padding: "10px 14px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ color: COLORS.ink, fontSize: 13 }}>{p.pergunta}</span>
                  <button onClick={() => removerPergunta(i)} style={{ background: "none", border: "none", color: COLORS.danger, cursor: "pointer", display: "flex" }}>
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => criarSala(minhasPerguntas)}
          disabled={minhasPerguntas.length === 0}
          style={{ ...primaryBtn, opacity: minhasPerguntas.length === 0 ? 0.5 : 1, cursor: minhasPerguntas.length === 0 ? "default" : "pointer" }}
        >
          Criar sala com {minhasPerguntas.length} pergunta{minhasPerguntas.length !== 1 ? "s" : ""} <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  if (stage === "lobby") {
    return (
      <div style={quizWrap}>
        <span style={{ fontFamily: "JetBrains Mono", fontSize: 13, color: COLORS.inkDim, textTransform: "uppercase", letterSpacing: 1 }}>Código da sala</span>
        <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 42, color: COLORS.accent, letterSpacing: 6, margin: "6px 0 24px" }}>{codigo}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 320, marginBottom: 26 }}>
          {jogadores.map((j) => (
            <div key={j.id} style={{ display: "flex", alignItems: "center", gap: 10, background: COLORS.surface, padding: "9px 14px", borderRadius: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: COLORS.accent }} />
              <span style={{ color: COLORS.ink, fontSize: 13.5, fontWeight: 600 }}>{j.nome}</span>
            </div>
          ))}
        </div>
        {souAnfitriao ? (
          <button onClick={iniciar} style={primaryBtn}>Iniciar desafio <ArrowRight size={16} /></button>
        ) : (
          <span style={{ color: COLORS.inkDim, fontSize: 13 }}>Aguardando o anfitrião iniciar...</span>
        )}
      </div>
    );
  }

  if (stage === "podium") {
    const medals = ["🥇", "🥈", "🥉"];
    const meuXp = ranking.find((r) => r.nome === userName)?.pontos || 0;
    return (
      <div style={quizWrap}>
        <Trophy size={40} color={COLORS.amber} />
        <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 24, color: COLORS.ink, margin: "16px 0 22px" }}>Resultado do desafio</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 340 }}>
          {ranking.map(([nomeOuObj], i) => null)}
          {ranking.map((r, i) => (
            <div key={r.nome} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 12, background: r.nome === userName ? "rgba(41,240,201,0.12)" : COLORS.surface }}>
              <span style={{ color: COLORS.ink, fontFamily: "Inter", fontWeight: 600, fontSize: 14 }}>{medals[i] || `${i + 1}º`} {r.nome}</span>
              <span style={{ color: COLORS.amber, fontFamily: "JetBrains Mono", fontSize: 13 }}>{r.pontos} pts</span>
            </div>
          ))}
        </div>
        <button onClick={() => { onFinish(Math.round(meuXp / 20)); setStage("menu"); }} style={{ ...primaryBtn, marginTop: 26 }}>Voltar</button>
      </div>
    );
  }

  // question / reveal
  return (
    <div style={{ padding: "28px 20px", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <span style={{ color: COLORS.inkDim, fontFamily: "JetBrains Mono", fontSize: 12.5 }}>Sala {codigo} · Pergunta {(pergunta?.indice ?? 0) + 1}/{pergunta?.total}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "JetBrains Mono", fontSize: 13, color: timeLeft <= 3 ? COLORS.danger : COLORS.ink }}>
          <Clock size={14} /> {timeLeft}s
        </div>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, marginBottom: 26, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(timeLeft / 10) * 100}%`, background: timeLeft <= 3 ? COLORS.danger : COLORS.accent, transition: "width 1s linear" }} />
      </div>
      <h2 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 20, color: COLORS.ink, marginBottom: 24, lineHeight: 1.4 }}>{pergunta?.pergunta}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
        {pergunta?.opcoes.map((op, i) => {
          const isCorrect = stage === "reveal" && correta === i;
          const isSelected = i === opcaoEscolhida;
          let bg = OPTION_COLORS[i]; let opacity = 1;
          if (stage === "reveal") {
            if (isCorrect) bg = "#3DDC84";
            else if (isSelected) bg = COLORS.danger;
            else opacity = 0.35;
          }
          return (
            <button key={i} onClick={() => responder(i)} disabled={stage === "reveal" || opcaoEscolhida !== null} style={{
              padding: "18px 16px", borderRadius: 14, border: "none", cursor: "pointer", background: bg, opacity,
              color: "#0F0E2E", fontFamily: "Inter", fontWeight: 700, fontSize: 14.5,
              display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.25s ease", textAlign: "left",
            }}>
              {op}
              {isCorrect && <Check size={18} />}
              {stage === "reveal" && isSelected && !isCorrect && <X size={18} />}
            </button>
          );
        })}
      </div>
      {stage === "reveal" && (
        <>
          <h3 style={{ color: COLORS.inkDim, fontSize: 12.5, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Ranking parcial</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 22 }}>
            {ranking.map((r, i) => (
              <div key={r.nome} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", borderRadius: 10, background: r.nome === userName ? "rgba(41,240,201,0.1)" : COLORS.surface }}>
                <span style={{ color: COLORS.ink, fontSize: 13, fontWeight: 600 }}>{i + 1}º {r.nome}</span>
                <span style={{ color: COLORS.inkDim, fontSize: 12, fontFamily: "JetBrains Mono" }}>{r.pontos} pts</span>
              </div>
            ))}
          </div>
          {souAnfitriao && (
            <button onClick={proxima} style={primaryBtn}>
              {(pergunta?.indice ?? 0) + 1 < (pergunta?.total ?? 0) ? "Próxima pergunta" : "Ver pódio"} <ArrowRight size={16} />
            </button>
          )}
          {!souAnfitriao && <span style={{ color: COLORS.inkDim, fontSize: 13 }}>Aguardando o anfitrião avançar...</span>}
        </>
      )}
    </div>
  );
}

function QuizHub({ perguntas, userName, onFinish }) {
  const [mode, setMode] = useState("solo");
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, paddingTop: 26 }}>
        <button onClick={() => setMode("solo")} style={{
          padding: "8px 16px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)",
          background: mode === "solo" ? COLORS.accent : "transparent", color: mode === "solo" ? COLORS.bg : COLORS.inkDim,
          fontFamily: "Inter", fontWeight: 600, fontSize: 13, cursor: "pointer",
        }}>Quiz individual</button>
        <button onClick={() => setMode("desafio")} style={{
          padding: "8px 16px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.1)",
          background: mode === "desafio" ? COLORS.accent : "transparent", color: mode === "desafio" ? COLORS.bg : COLORS.inkDim,
          fontFamily: "Inter", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
        }}><Trophy size={13} /> Desafio em grupo</button>
      </div>
      {mode === "solo" ? <Quiz perguntas={perguntas} onFinish={onFinish} /> : <ChallengeQuiz userName={userName} onFinish={onFinish} />}
    </div>
  );
}

/* ---------------- Perfil ---------------- */

function Perfil({ user }) {
  const xpForNext = user.level * 100;
  const progress = Math.min(user.xp / xpForNext, 1);
  const levels = [
    { n: 1, nome: "Ponto de partida" }, { n: 2, nome: "Ganhando ritmo" }, { n: 3, nome: "Em aceleração" },
    { n: 4, nome: "Velocidade de cruzeiro" }, { n: 5, nome: "Pronto pro PAS" },
  ];
  return (
    <div style={{ padding: "32px 24px", maxWidth: 700, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 24, color: COLORS.ink, marginBottom: 22 }}>Seu progresso</h1>
      <div style={{ background: `linear-gradient(135deg, ${COLORS.surface2}, ${COLORS.surface})`, borderRadius: 18, padding: 24, border: "1px solid rgba(255,255,255,0.07)", marginBottom: 26 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ color: COLORS.ink, fontFamily: "Sora", fontWeight: 700, fontSize: 16 }}>Nível {user.level} — {levels[user.level - 1]?.nome || "Rumo ao topo"}</span>
          <span style={{ color: COLORS.inkDim, fontFamily: "JetBrains Mono", fontSize: 12.5 }}>{user.xp} / {xpForNext} XP</span>
        </div>
        <div style={{ height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 6, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress * 100}%`, background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.amber})`, transition: "width 0.6s ease" }} />
        </div>
      </div>
      <h2 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 16, color: COLORS.ink, marginBottom: 14 }}>Trilha de níveis</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {levels.map((l) => {
          const reached = l.n <= user.level;
          return (
            <div key={l.n} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", borderRadius: 12, background: reached ? "rgba(41,240,201,0.08)" : COLORS.surface, border: `1px solid ${reached ? "rgba(41,240,201,0.25)" : "rgba(255,255,255,0.05)"}` }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, background: reached ? COLORS.accent : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: reached ? COLORS.bg : COLORS.inkDim, fontFamily: "Sora", fontWeight: 700, fontSize: 13 }}>{l.n}</div>
              <span style={{ color: reached ? COLORS.ink : COLORS.inkDim, fontFamily: "Inter", fontWeight: 600, fontSize: 14 }}>{l.nome}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- App raiz ---------------- */

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("impulse_token"));
  const [user, setUser] = useState(null);
  const [showSplash, setShowSplash] = useState(false);
  const [view, setView] = useState("dashboard");
  const [licaoAtual, setLicaoAtual] = useState(null);
  const abrirLicao = (id) => { setLicaoAtual(id); setView("licao"); };
  const [conteudo, setConteudo] = useState(null); // { flashcards, resumos, quiz }
  const [carregando, setCarregando] = useState(true);
  const [erroCarregar, setErroCarregar] = useState("");

  // restaura sessão salva
  useEffect(() => {
    if (!token) { setCarregando(false); return; }
    api.buscarMe(token)
      .then((u) => setUser(u))
      .catch(() => { localStorage.removeItem("impulse_token"); setToken(null); })
      .finally(() => setCarregando(false));
  }, []);

  // carrega conteúdo público (flashcards, resumos, quiz)
  useEffect(() => {
    carregarConteudo();
  }, []);

  const carregarConteudo = () => {
    setErroCarregar("");
    Promise.all([api.buscarFlashcards(), api.buscarResumos(), api.buscarQuiz(), api.buscarMateriais()])
      .then(([flashcards, resumos, quiz, materiais]) => setConteudo({ flashcards, resumos, quiz, materiais }))
      .catch((e) => setErroCarregar(e.message || "Não foi possível conectar ao backend. Ele está rodando (npm start)?"));
  };

  const handleAuthenticated = (usuario, tok, mode) => {
    localStorage.setItem("impulse_token", tok);
    setToken(tok);
    setUser(usuario);
    if (mode === "signup") setShowSplash(true);
  };

  const handleQuizFinish = async (xpGanho) => {
    try {
      const atualizado = await api.registrarXP(token, xpGanho);
      setUser((prev) => ({ ...prev, ...atualizado }));
    } catch { /* silencioso: XP fica só local se a chamada falhar */ }
  };

  const logout = () => { localStorage.removeItem("impulse_token"); setToken(null); setUser(null); };

  if (carregando) return <Loading label="Carregando..." />;

  if (showSplash) {
    return (
      <div style={{ position: "relative" }}>
        <AppBackground />
        <div style={{ position: "relative", zIndex: 1 }}>
          <SplashScreen name={user?.nome} onDone={() => { setShowSplash(false); }} />
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return (
      <div style={{ position: "relative" }}>
        <AppBackground />
        <div style={{ position: "relative", zIndex: 1 }}>
          <AuthScreen onAuthenticated={handleAuthenticated} />
        </div>
      </div>
    );
  }

  if (erroCarregar) {
    return <ErrorBox message={erroCarregar} onRetry={carregarConteudo} />;
  }

  if (!conteudo) return <Loading label="Buscando flashcards, resumos e quiz..." />;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "Inter", position: "relative" }}>
      <AppBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Header onLogout={logout} user={user} />
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <Sidebar view={view} setView={setView} />
          <div style={{ flex: 1, minWidth: 0 }}>
            {view === "dashboard" && <Dashboard user={user} setView={setView} onAbrirLicao={abrirLicao} />}
            {view === "aulas" && <Aulas onAbrirLicao={abrirLicao} />}
            {view === "licao" && <Licao licao={LICOES.find((l) => l.id === licaoAtual)} onVoltar={() => setView("dashboard")} />}
            {view === "estudos" && <Estudos setView={setView} />}
            {view === "flashcards" && <Flashcards decks={conteudo.flashcards} />}
            {view === "resumos" && <Resumos resumos={conteudo.resumos} />}
            {view === "comocomecar" && <ComoComecar />}
            {view === "redacao" && <Redacao />}
            {view === "biblioteca" && <Biblioteca materiais={conteudo.materiais} />}
            {view === "quiz" && <QuizHub perguntas={conteudo.quiz} userName={user.nome} onFinish={handleQuizFinish} />}
            {view === "perfil" && <Perfil user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
}
