import { pool } from "../database/mysql";
import { Carro } from "../model/Carro";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function listarTodos(): Promise<Carro[]> {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM carros");
  return rows as Carro[];
}

// Carros com estoque > 0 (RN06 / GET /carros/disponiveis)
export async function listarDisponiveis(): Promise<Carro[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT c.* FROM carros c
     INNER JOIN estoque e ON e.id_carro = c.id_carro
     WHERE e.quantidade > 0`,
  );
  return rows as Carro[];
}

export async function buscarPorId(id: number): Promise<Carro | undefined> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM carros WHERE id_carro = ?",
    [id],
  );
  return rows[0] as Carro | undefined;
}

export async function buscarPorPlaca(placa: string): Promise<Carro | undefined> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM carros WHERE placa = ?",
    [placa],
  );
  return rows[0] as Carro | undefined;
}

export async function criar(dados: Omit<Carro, "id_carro">): Promise<Carro> {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO carros (marca, modelo, ano, placa, preco, cor) VALUES (?, ?, ?, ?, ?, ?)",
    [dados.marca, dados.modelo, dados.ano, dados.placa, dados.preco, dados.cor],
  );
  return { id_carro: result.insertId, ...dados };
}

export async function atualizar(
  id: number,
  dados: Partial<Omit<Carro, "id_carro">>,
): Promise<Carro | undefined> {
  const atual = await buscarPorId(id);
  if (!atual) return undefined;

  const atualizado = { ...atual, ...dados };
  await pool.query(
    "UPDATE carros SET marca = ?, modelo = ?, ano = ?, placa = ?, preco = ?, cor = ? WHERE id_carro = ?",
    [
      atualizado.marca,
      atualizado.modelo,
      atualizado.ano,
      atualizado.placa,
      atualizado.preco,
      atualizado.cor,
      id,
    ],
  );
  return atualizado;
}

export async function remover(id: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM carros WHERE id_carro = ?",
    [id],
  );
  return result.affectedRows > 0;
}
