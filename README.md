# Projeto II — API REST Concessionária (MySQL)

API REST para gestão de uma concessionária de veículos, evoluída do Projeto I
para usar persistência em banco de dados relacional **MySQL**, com arquitetura
MVC (model / repository / service / controller) e rotas centralizadas em
`src/routes/router.ts`.

## Pré-requisitos

- Node.js 18+
- MySQL Server 8+

## Configuração

1. Instale as dependências:
   ```
   npm install
   ```

2. Crie o banco de dados executando o script SQL:
   ```
   mysql -u root -p < sql/schema.sql
   ```

3. Copie o arquivo de variáveis de ambiente e ajuste as credenciais:
   ```
   cp .env.example .env
   ```

4. Suba a aplicação em modo desenvolvimento:
   ```
   npm run dev
   ```

A API sobe em `http://localhost:3000`.

## Scripts

| Comando         | Descrição                                    |
|-----------------|-----------------------------------------------|
| `npm run dev`   | Sobe o servidor com reload automático (nodemon)|
| `npm run build` | Compila o TypeScript para `dist/`              |
| `npm start`     | Roda a versão compilada (`dist/app.js`)        |

## Estrutura

```
src/
  app.ts              -> bootstrap do Express + conexão com o banco
  database/mysql.ts    -> pool de conexão (mysql2/promise)
  routes/router.ts      -> todas as rotas centralizadas
  model/                -> interfaces TypeScript das entidades
  repository/           -> instruções SQL (sem regra de negócio)
  service/               -> regras de negócio (RN01–RN06)
  controller/             -> tratamento de Request/Response
sql/schema.sql           -> script de criação do banco/tabelas
```
