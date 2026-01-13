# 📉 Steam Price Watcher

Uma aplicação **Fullstack** para monitoramento de preços de jogos, combinando uma API de alta performance com uma interface moderna e responsiva.

## 🚀 Tecnologias

### Backend (API)
- **Node.js (v22) & TypeScript**
- **Koa** (Web Framework leve e performático)
- **MongoDB & Mongoose** (Banco de dados NoSQL)
- **Redis** (Cache-Aside Strategy - TTL 1h)
- **JWT (JSON Web Tokens)** (Autenticação Segura)
- **Zod** (Validação de Schemas)
- **Cron Jobs** (Workers em background para atualização de preços)

### Frontend (Interface)
- **React 19 & Vite**
- **TypeScript**
- **TailwindCSS** (Estilização utilitária)
- **shadcn/ui** (Componentes de interface reutilizáveis)
- **Axios** (Integração com API)

### Infraestrutura
- **Docker & Docker Compose** (MongoDB e Redis containerizados)

---

## 🏛️ Arquitetura & Funcionalidades

O projeto segue o padrão **MSC (Model-Service-Controller)** com **Repository Pattern** no backend, garantindo código limpo e desacoplado.

### Principais Destaques:
1.  **Integração Híbrida de APIs:**
    * Busca catálogo global via **CheapShark API**.
    * Valida e atualiza preços regionais (BRL) via **Steam Store API**.
2.  **Performance com Caching:**
    * Utiliza Redis para cachear buscas externas, reduzindo latência média de **900ms para ~2ms**.
3.  **Segurança:**
    * Sistema de Login e Registro com senhas hashadas.
    * Rotas protegidas via **Middleware de Autenticação (JWT)**.
4.  **Automação:**
    * Worker rodando via Cron verifica periodicamente oscilações de preço na Steam e atualiza o histórico no banco.

---

## 🛠️ Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado.
- Docker e Docker Compose rodando.

### 1. Backend (API)
Acesse a pasta raiz e suba os serviços:

```bash
# Clone o repositório
git clone [https://github.com/SEU-USUARIO/steam-price-watcher.git](https://github.com/SEU-USUARIO/steam-price-watcher.git)

# Configure as variáveis de ambiente
cp .env.example .env

# Suba o banco de dados e cache (Mongo + Redis)
docker-compose up -d

# Instale as dependências e rode
npm install
npm run dev

A API rodará em: http://localhost:3001
```

### 2. Frontend (Interface)

Em um novo terminal, acesse a pasta do frontend:

```bash
cd frontend

# Instale as dependências
npm install

# Rode o servidor de desenvolvimento
npm run dev

A Interface rodará em: http://localhost:3002
```

## 📡 Documentação da API

Autenticação 🔐
| Método | Rota | Descrição
| :--- | :--- |  :--- |
| POST | `/api/v1/auth/signup` | Cria uma nova conta de usuário
| POST | `/api/v1/auth/signin` | Realiza login e retorna o Token JWT

### Jogos 🎮
Requer Header `Authorization: Bearer <TOKEN>`
| Método | Rota | Descrição
| :--- | :--- |  :--- |
| GET | `/api/v1/games` | Lista todos os jogos monitorados do banco
| GET | `/api/v1/games/search?title=...` | Busca jogos externos (com Cache Redis)
| POST | `/api/v1/games/monitor` | Adiciona um novo jogo para monitoramento


##📸 Screenshots
Em breve

--------------------------
### Desenvolvido com 💙 por Gabriel Genaro.

