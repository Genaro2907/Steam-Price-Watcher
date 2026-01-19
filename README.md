# 📉 Steam Price Watcher

Uma aplicação **Fullstack** para monitoramento de preços de jogos, combinando uma API de alta performance com uma interface moderna e responsiva.

## 🛠️ Stack Tecnológica

### **Backend**
![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Koa](https://img.shields.io/badge/Koa-2.15-333333?logo=koajs)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb)
![Redis](https://img.shields.io/badge/Redis-7.0-DC382D?logo=redis)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens)

### **Frontend**
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)

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

#### Registrar Usuário
```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senhaSegura123"
}
```
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

