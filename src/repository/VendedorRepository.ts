import { pool } from "../database/mysql";
import { Vendedor } from "../model/Vendedor";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function listarTodos(): Promise<Vendedor[]> {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM vendedores");
  return rows as Vendedor[];
}

export async function buscarPorId(id: number): Promise<Vendedor | undefined> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM vendedores WHERE id_vendedor = ?",
    [id],
  );
  return rows[0] as Vendedor | undefined;
}

export async function buscarPorMatricula(matricula: string): Promise<Vendedor | undefined> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM vendedores WHERE matricula = ?",
    [matricula],
  );
  return rows[0] as Vendedor | undefined;
}

export async function criar(dados: Omit<Vendedor, "id_vendedor">): Promise<Vendedor> {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO vendedores (nome, matricula, comissao_percentual) VALUES (?, ?, ?)",
    [dados.nome, dados.matricula, dados.comissao_percentual],
  );
  return { id_vendedor: result.insertId, ...dados };
}

export async function atualizar(
  id: number,
  dados: Partial<Omit<Vendedor, "id_vendedor">>,
): Promise<Vendedor | undefined> {
  const atual = await buscarPorId(id);
  if (!atual) return undefined;

  const atualizado = { ...atual, ...dados };
  await pool.query(
    "UPDATE vendedores SET nome = ?, matricula = ?, comissao_percentual = ? WHERE id_vendedor = ?",
    [atualizado.nome, atualizado.matricula, atualizado.comissao_percentual, id],
  );
  return atualizado;
}

export async function remover(id: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM vendedores WHERE id_vendedor = ?",
    [id],
  );
  return result.affectedRows > 0;
}
