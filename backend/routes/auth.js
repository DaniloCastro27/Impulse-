const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { exigirLogin } = require("../middleware/auth");

const router = express.Router();

function gerarToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

function usuarioPublico(row) {
  const { senha_hash, ...resto } = row;
  return resto;
}

router.post("/register", (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Preencha nome, e-mail e senha." });
  }
  if (senha.length < 6) {
    return res.status(400).json({ erro: "A senha precisa ter pelo menos 6 caracteres." });
  }

  const existente = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase());
  if (existente) {
    return res.status(409).json({ erro: "Já existe uma conta com esse e-mail." });
  }

  const senha_hash = bcrypt.hashSync(senha, 10);
  const { lastInsertRowid } = db
    .prepare("INSERT INTO users (nome, email, senha_hash) VALUES (?, ?, ?)")
    .run(nome, email.toLowerCase(), senha_hash);

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(lastInsertRowid);
  res.status(201).json({ token: gerarToken(user.id), usuario: usuarioPublico(user) });
});

router.post("/login", (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ erro: "Informe e-mail e senha." });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());
  if (!user || !bcrypt.compareSync(senha, user.senha_hash)) {
    return res.status(401).json({ erro: "E-mail ou senha incorretos." });
  }

  res.json({ token: gerarToken(user.id), usuario: usuarioPublico(user) });
});

router.get("/me", exigirLogin, (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.userId);
  if (!user) return res.status(404).json({ erro: "Usuário não encontrado." });
  res.json(usuarioPublico(user));
});

module.exports = router;
