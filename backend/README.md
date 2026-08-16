# Impulse+ — Backend

API real com banco de dados (SQLite) para autenticação, flashcards, resumos, quiz e desafio em grupo em tempo real.

## Rodando localmente

Pré-requisito: [Node.js](https://nodejs.org) instalado (versão 18+).

```bash
cd impulse-backend
npm install
cp .env.example .env      # depois edite o JWT_SECRET
npm run seed               # popula o banco com flashcards, resumos e quiz
npm start                  # sobe o servidor em http://localhost:4000
```

Teste rápido:

```bash
curl http://localhost:4000/api/health
# {"ok":true,"servico":"impulse-plus-backend"}

curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Maria","email":"maria@teste.com","senha":"123456"}'
```

## Rotas disponíveis

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/api/auth/register` | não | Cadastra aluno (nome, email, senha) |
| POST | `/api/auth/login` | não | Login (email, senha) |
| GET | `/api/auth/me` | sim | Dados do usuário logado |
| GET | `/api/flashcards` | não | Baralhos de flashcards por matéria |
| GET | `/api/resumos` | não | Resumos com pontos principais |
| GET | `/api/quiz` | não | Perguntas do quiz (sem a resposta certa) |
| POST | `/api/quiz/:id/responder` | não | Envia resposta, retorna se acertou |
| POST | `/api/progress/xp` | sim | Registra XP ganho, recalcula nível e sequência de dias |

Rotas com "Auth: sim" exigem o cabeçalho `Authorization: Bearer <token>` retornado no login/cadastro.

## Desafio em grupo (tempo real via Socket.IO)

Eventos do socket (veja `server.js`):

- `criar-sala` `{ nome }` → cria uma sala e retorna o código de 6 dígitos
- `entrar-sala` `{ codigo, nome }` → entra em uma sala existente
- `iniciar-desafio` `{ codigo }` → só o anfitrião pode chamar
- `responder` `{ codigo, opcao, tempoRestante }` → envia a resposta do jogador
- `proxima-pergunta` `{ codigo }` → avança a sala (anfitrião)

Eventos recebidos do servidor: `sala-atualizada`, `pergunta`, `resultado-resposta`, `rodada-revelada`, `desafio-finalizado`.

## Conectando o frontend (`ImpulsePlus.jsx`)

1. Crie um arquivo `api.js` no projeto React:

```javascript
const API_URL = "http://localhost:4000/api"; // troque pela URL do deploy quando publicar

export async function cadastrar(nome, email, senha) {
  const r = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });
  if (!r.ok) throw new Error((await r.json()).erro);
  return r.json(); // { token, usuario }
}

export async function login(email, senha) {
  const r = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  if (!r.ok) throw new Error((await r.json()).erro);
  return r.json();
}

export async function buscarFlashcards() {
  return fetch(`${API_URL}/flashcards`).then((r) => r.json());
}

export async function registrarXP(token, xpGanho) {
  const r = await fetch(`${API_URL}/progress/xp`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ xpGanho }),
  });
  return r.json();
}
```

2. No `AuthScreen.submit`, troque o `onLogin({...})` mockado por uma chamada a `cadastrar(...)` ou `login(...)`, guarde o `token` retornado (em uma variável de estado do React — sem `localStorage` se for rodar como artifact do Claude) e use-o nas próximas chamadas.

3. Para o **Desafio em grupo**, troque o array `BOT_POOL` por `socket.io-client`:

```bash
npm install socket.io-client
```

```javascript
import { io } from "socket.io-client";
const socket = io("http://localhost:4000");
```

E use os eventos listados acima no lugar da simulação local em `ChallengeQuiz`.

## Publicando de graça (deploy)

Opções com plano gratuito que funcionam bem para esse projeto:

- **Render.com** → "New Web Service", conecte o repositório, comando de build `npm install`, comando de start `npm start`. Defina as variáveis `JWT_SECRET` e `CORS_ORIGIN` (URL do seu frontend) no painel.
- **Railway.app** → fluxo parecido, também com plano gratuito para projetos pequenos.

⚠️ O SQLite grava em um arquivo (`impulse.db`). Em alguns provedores gratuitos o disco é temporário e reseta a cada deploy — para persistência garantida em produção, ative um "volume/disk persistente" (Render oferece isso no plano free com limitação de tamanho) ou migre para um Postgres gerenciado (Render e Railway também oferecem Postgres grátis) quando o projeto crescer.

## Segurança básica já incluída

- Senhas nunca são salvas em texto puro — usa `bcryptjs` para hash.
- Login gera um token JWT válido por 30 dias.
- As rotas de progresso exigem token válido.
- O endpoint `/api/quiz` não envia a resposta correta para o navegador — só o backend sabe e confirma em `/api/quiz/:id/responder`.
