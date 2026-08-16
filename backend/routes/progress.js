const express = require("express");
const db = require("../db");
const { exigirLogin } = require("../middleware/auth");

const router = express.Router();

function calcularNivel(xpTotal) {
  let xp = xpTotal;
  let level = 1;
  while (xp >= level * 100) {
    xp -= level * 100;
    level += 1;
  }
  return { xp, level };
}

function diasEntre(dataIso1, dataIso2) {
  const d1 = new Date(dataIso1);
  const d2 = new Date(dataIso2);
  return Math.round((d2 - d1) / 86400000);
}

// POST /api/progress/xp  { xpGanho: number }
router.post("/xp", exigirLogin, (req, res) => {
  const { xpGanho } = req.body;
  if (typeof xpGanho !== "number" || xpGanho < 0) {
    return res.status(400).json({ erro: "xpGanho inválido." });
  }

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.userId);
  const xpAcumuladoBruto = xpTotalBruto(user) + xpGanho;
  const { xp, level } = calcularNivel(xpAcumuladoBruto);

  const hoje = new Date().toISOString().slice(0, 10);
  let streak = user.streak;
  if (!user.ultimo_estudo) {
    streak = 1;
  } else {
    const diff = diasEntre(user.ultimo_estudo, hoje);
    if (diff === 1) streak += 1;
    else if (diff > 1) streak = 1;
    // diff === 0 (mesmo dia) mantém streak
  }

  db.prepare("UPDATE users SET xp = ?, level = ?, streak = ?, ultimo_estudo = ? WHERE id = ?")
    .run(xp, level, streak, hoje, user.id);

  const atualizado = db.prepare("SELECT id, nome, email, xp, level, streak FROM users WHERE id = ?").get(user.id);
  res.json(atualizado);
});

// reconstrói o total bruto de XP já acumulado (para poder recalcular nível de forma consistente)
function xpTotalBruto(user) {
  let total = 0;
  for (let l = 1; l < user.level; l++) total += l * 100;
  return total + user.xp;
}

module.exports = router;
