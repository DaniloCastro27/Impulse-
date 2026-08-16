const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function tratar(resposta) {
  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.erro || "Erro na requisição.");
  return dados;
}

export function cadastrar(nome, email, senha) {
  return fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  }).then(tratar);
}

export function login(email, senha) {
  return fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  }).then(tratar);
}

export function buscarMe(token) {
  return fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(tratar);
}

export function buscarFlashcards() {
  return fetch(`${API_URL}/flashcards`).then(tratar);
}

export function buscarResumos() {
  return fetch(`${API_URL}/resumos`).then(tratar);
}

export function buscarQuiz() {
  return fetch(`${API_URL}/quiz`).then(tratar);
}

export function buscarMateriais() {
  return fetch(`${API_URL}/materiais`).then(tratar);
}

export function responderQuiz(perguntaId, opcao) {
  return fetch(`${API_URL}/quiz/${perguntaId}/responder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ opcao }),
  }).then(tratar);
}

export function registrarXP(token, xpGanho) {
  return fetch(`${API_URL}/progress/xp`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ xpGanho }),
  }).then(tratar);
}
