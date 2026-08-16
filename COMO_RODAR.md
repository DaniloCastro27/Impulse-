# Impulse+ — como rodar a plataforma completa

Este pacote tem duas pastas:

- `backend/`  → API + banco de dados (Node.js + SQLite + Socket.IO)
- `frontend/` → interface (React + Vite), já conectada na API real

## Passo a passo

**1. Backend (terminal 1)**
```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm start
```
Confirme que apareceu: `Impulse+ backend rodando em http://localhost:4000`

**2. Frontend (terminal 2, deixe o backend rodando)**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Abra o link que aparecer (normalmente `http://localhost:5173`).

Pronto — cadastro, login, flashcards, resumos, quiz e desafio em grupo funcionando com banco de dados real.

## Publicar de graça (deixar no ar para os alunos usarem)

1. Suba as duas pastas para um repositório no GitHub.
2. Backend → crie um "Web Service" grátis no Render.com apontando pra pasta `backend`. Configure as variáveis `JWT_SECRET` e `CORS_ORIGIN` (essa última com a URL do frontend, depois do passo 3).
3. Frontend → crie um "Static Site" grátis no Render.com (ou Vercel/Netlify) apontando pra pasta `frontend`, comando de build `npm run build`, pasta de saída `dist`. Configure `VITE_API_URL` e `VITE_SOCKET_URL` com a URL pública do backend do passo 2.

Detalhes completos de configuração estão nos `README.md` de cada pasta.
