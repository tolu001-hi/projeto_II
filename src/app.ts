import express from "express";
import router from "./routes/router";
import { pool } from "./database/mysql";

const app = express();
app.use(express.json());

app.use(router);

const PORT = Number(process.env.PORT) || 3000;

async function iniciar() {
  try {
    // Testa a conexão com o banco antes de subir o servidor
    await pool.query("SELECT 1");
    console.log("Conexão com o MySQL estabelecida com sucesso.");

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (erro) {
    console.error("Não foi possível conectar ao banco de dados:", erro);
    process.exit(1);
  }
}

iniciar();

export default app;
