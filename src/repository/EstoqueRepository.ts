import { pool } from "../database/mysql";
import { Estoque } from "../model/Estoque";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function listarTodos(): Promise<Estoque[]> {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM estoque");
  return rows as Estoque[];
}

export async function buscarPorId(id: number): Promise<Estoque | undefined> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM estoque WHERE id_estoque = ?",
    [id],
  );
  return rows[0] as Estoque | undefined;
}

export async function buscarPorIdCarro(id_carro: number): Promise<Estoque | undefined> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM estoque WHERE id_carro = ?",
    [id_carro],
  );
  return rows[0] as Estoque | undefined;
}

export async function criar(dados: Omit<Estoque, "id_estoque">): Promise<Estoque> {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO estoque (id_carro, quantidade, localizacao_patio, data_entrada) VALUES (?, ?, ?, ?)",
    [dados.id_carro, dados.quantidade, dados.localizacao_patio, dados.data_entrada],
  );
  return { id_estoque: result.insertId, ...dados };
}

export async function atualizar(
  id: number,
  dados: Partial<Omit<Estoque, "id_estoque">>,
): Promise<Estoque | undefined> {
  const atual = await buscarPorId(id);
  if (!atual) return undefined;

  const atualizado = { ...atual, ...dados };
  await pool.query(
    "UPDATE estoque SET id_carro = ?, quantidade = ?, localizacao_patio = ?, data_entrada = ? WHERE id_estoque = ?",
    [
      atualizado.id_carro,
      atualizado.quantidade,
      atualizado.localizacao_patio,
      atualizado.data_entrada,
      id,
    ],
  );
  return atualizado;
}

export async function remover(id: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM estoque WHERE id_estoque = ?",
    [id],
  );
  return result.affectedRows > 0;
}

export async function decrementarQuantidade(id_carro: number): Promise<void> {
  await pool.query(
    "UPDATE estoque SET quantidade = quantidade - 1 WHERE id_carro = ? AND quantidade > 0",
    [id_carro],
  );
}
