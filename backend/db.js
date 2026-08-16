const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "impulse.db"));
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  streak INTEGER NOT NULL DEFAULT 0,
  ultimo_estudo TEXT,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS decks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  materia TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS flashcards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  deck_id INTEGER NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  pergunta TEXT NOT NULL,
  resposta TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS resumos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  materia TEXT NOT NULL,
  titulo TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS resumo_pontos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  resumo_id INTEGER NOT NULL REFERENCES resumos(id) ON DELETE CASCADE,
  ponto TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pergunta TEXT NOT NULL,
  opcoes TEXT NOT NULL,     -- JSON: ["op1","op2","op3","op4"]
  correta INTEGER NOT NULL  -- índice da opção correta
);

CREATE TABLE IF NOT EXISTS materiais (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  materia TEXT NOT NULL,
  ano INTEGER NOT NULL,
  tipo TEXT NOT NULL,   -- 'Prova' | 'Gabarito' | 'Material'
  url TEXT              -- link do PDF real (opcional)
);
`);

module.exports = db;
