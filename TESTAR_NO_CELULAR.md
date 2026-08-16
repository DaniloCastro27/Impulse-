# Testando o Impulse+ no celular (mesma rede Wi-Fi)

## 0. Pré-requisito
Instale o [Node.js](https://nodejs.org) no computador (versão 18 ou mais nova) — é só baixar o instalador e clicar em "Next" até terminar.

## 1. Descubra o IP local do seu computador

**Windows:** abra o Prompt de Comando e digite:
```
ipconfig
```
Procure por "Endereço IPv4" (algo como `192.168.0.x` ou `192.168.1.x`).

**Mac:** Preferências do Sistema → Wi-Fi → Detalhes → veja o endereço IP. Ou no Terminal:
```
ipconfig getifaddr en0
```

**Linux:** no Terminal:
```
hostname -I
```

Anote esse número. Vou chamar ele de `SEU_IP` daqui pra frente (exemplo: `192.168.0.15`).

⚠️ O celular precisa estar conectado **no mesmo Wi-Fi** que o computador.

## 2. Configure o backend

```bash
cd backend
npm install
cp .env.example .env
```

Abra o arquivo `.env` que acabou de ser criado e ajuste a linha `CORS_ORIGIN` trocando pelo seu IP:
```
CORS_ORIGIN=http://SEU_IP:5173
```
(exemplo: `CORS_ORIGIN=http://192.168.0.15:5173`)

Depois:
```bash
npm run seed
npm start
```
Deixe esse terminal aberto — ele precisa continuar rodando.

## 3. Configure o frontend

Em **outro terminal** (sem fechar o do backend):

```bash
cd frontend
npm install
cp .env.example .env
```

Abra o `.env` do frontend e troque `localhost` pelo seu IP nas duas linhas:
```
VITE_API_URL=http://SEU_IP:4000/api
VITE_SOCKET_URL=http://SEU_IP:4000
```

Depois:
```bash
npm run dev
```

O terminal vai mostrar algo como:
```
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.0.15:5173/
```

## 4. Abra no celular

No navegador do celular (Chrome, Safari), digite o endereço da linha **Network** — no exemplo: `http://192.168.0.15:5173`

Pronto — a plataforma abre no celular, com cadastro/login gravando de verdade no backend do computador.

## Dicas se algo não funcionar

- **Não abre / "não é possível acessar o site":** confirme que o celular está no mesmo Wi-Fi (não em 4G/5G) e que o IP está certo — ele pode mudar se o computador reconectar no Wi-Fi.
- **Firewall do Windows:** na primeira vez que rodar `npm start`/`npm run dev`, pode aparecer um aviso do Firewall perguntando se permite a conexão — clique em "Permitir".
- **Erro de CORS no console:** confira se o `CORS_ORIGIN` do backend está com o IP e porta exatos do frontend (`http://SEU_IP:5173`, sem barra no final).
