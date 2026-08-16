const express = require("express");
const db = require("../db");

const router = express.Router();

// GET /api/flashcards -> { "Português": [{id, pergunta, resposta}], "Matemática": [...] }
router.get("/flashcards", (req, res) => {
  const decks = db.prepare("SELECT * FROM decks").all();
  const cardsStmt = db.prepare("SELECT id, pergunta, resposta FROM flashcards WHERE deck_id = ?");

  const resultado = {};
  for (const deck of decks) {
    resultado[deck.materia] = cardsStmt.all(deck.id);
  }
  res.json(resultado);
});

// GET /api/resumos -> [{ id, materia, titulo, pontos: [string] }]
router.get("/resumos", (req, res) => {
  const resumos = db.prepare("SELECT * FROM resumos").all();
  const pontosStmt = db.prepare("SELECT ponto FROM resumo_pontos WHERE resumo_id = ? ORDER BY ordem");

  const resultado = resumos.map((r) => ({
    id: r.id,
    materia: r.materia,
    titulo: r.titulo,
    pontos: pontosStmt.all(r.id).map((p) => p.ponto),
  }));
  res.json(resultado);
});

// GET /api/quiz -> perguntas SEM a resposta correta (evita trapaça no front)
router.get("/quiz", (req, res) => {
  const perguntas = db.prepare("SELECT id, pergunta, opcoes FROM quiz_questions").all();
  res.json(perguntas.map((p) => ({ ...p, opcoes: JSON.parse(p.opcoes) })));
});

// POST /api/quiz/:id/responder  { opcao: number }
router.post("/quiz/:id/responder", (req, res) => {
  const { opcao } = req.body;
  const pergunta = db.prepare("SELECT * FROM quiz_questions WHERE id = ?").get(req.params.id);

  if (!pergunta) return res.status(404).json({ erro: "Pergunta não encontrada." });

  const acertou = Number(opcao) === pergunta.correta;
  res.json({ acertou, correta: pergunta.correta });
});

// GET /api/materiais -> provas anteriores, gabaritos e materiais de apoio
router.get("/materiais", (req, res) => {
  const materiais = db.prepare("SELECT * FROM materiais ORDER BY ano DESC, id").all();
  res.json(materiais);
});

module.exports = router;
