# 📉 Steam Price Watcher

Uma API robusta em Node.js para monitoramento de preços de jogos, utilizando estratégia de cache e workers em background.

## 🚀 Tecnologias
- **Node.js (v22) & TypeScript**
- **Koa** (Web Framework leve)
- **MongoDB & Mongoose** (Persistência)
- **Redis** (Caching Strategy: Cache-Aside)
- **Docker & Docker Compose** (Infraestrutura)
- **Cron Jobs** (Automação de tarefas)
- **Zod** (Validação de Dados)

## 🏛️ Arquitetura
O projeto segue o padrão **MSC (Model-Service-Controller)** com **Repository Pattern**.
Destaque para a **Integração Híbrida**:
1. Busca jogos na API da **CheapShark** (Catálogo global).
2. Cruza dados com a **Steam Store API** para obter preços localizados em **Reais (BRL)**.
3. Utiliza **Redis** para cachear buscas (TTL: 1h), reduzindo latência de 900ms para ~2ms.

## 🤖 Automations
O sistema possui um **Worker** (`src/jobs`) que roda via Cron:
- Varre o banco de dados periodicamente.
- Verifica atualizações de preço na Steam.
- Atualiza o registro e gera logs de histórico.

## 🛠️ Como Rodar

### Pré-requisitos
- Docker e Docker Compose instalados.

### Passo a Passo
1. Clone o repositório:
\`\`\`bash
git clone https://github.com/SEU-USUARIO/steam-price-watcher.git
\`\`\`

2. Configure as variáveis de ambiente:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Suba a infraestrutura:
\`\`\`bash
docker-compose up -d
\`\`\`

4. Instale dependências e rode:
\`\`\`bash
npm install
npm run dev
\`\`\`

A API estará disponível em: `http://localhost:3001`

## 📡 Endpoints Principais

### `GET /api/v1/games/search`
Busca jogos por nome (com Cache Redis).
- **Query:** `?title=Elden Ring`

### `POST /api/v1/games/monitor`
Adiciona um jogo para ser monitorado pelo Worker.
- **Body:**
\`\`\`json
{
  "title": "Elden Ring",
  "externalID": "236717",
  "steamAppID": "1245620",
  "thumb": "...",
  "cheapestPrice": 229.90
}
\`\`\`

---
Desenvolvido por **Gabriel Genaro**.
