import { pool } from "../database/mysql";
import { Cliente } from "../model/Cliente";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function listarTodos(): Promise<Cliente[]> {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM clientes");
  return rows as Cliente[];
}

export async function buscarPorId(id: number): Promise<Cliente | undefined> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM clientes WHERE id_cliente = ?",
    [id],
  );
  return rows[0] as Cliente | undefined;
}

export async function buscarPorCpf(cpf: string): Promise<Cliente | undefined> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM clientes WHERE cpf = ?",
    [cpf],
  );
  return rows[0] as Cliente | undefined;
}

export async function criar(dados: Omit<Cliente, "id_cliente">): Promise<Cliente> {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO clientes (nome, cpf, telefone, email, cidade) VALUES (?, ?, ?, ?, ?)",
    [dados.nome, dados.cpf, dados.telefone, dados.email ?? null, dados.cidade ?? null],
  );
  return { id_cliente: result.insertId, ...dados };
}

export async function atualizar(
  id: number,
  dados: Partial<Omit<Cliente, "id_cliente">>,
): Promise<Cliente | undefined> {
  const atual = await buscarPorId(id);
  if (!atual) return undefined;

  const atualizado = { ...atual, ...dados };
  await pool.query(
    "UPDATE clientes SET nome = ?, cpf = ?, telefone = ?, email = ?, cidade = ? WHERE id_cliente = ?",
    [
      atualizado.nome,
      atualizado.cpf,
      atualizado.telefone,
      atualizado.email ?? null,
      atualizado.cidade ?? null,
      id,
    ],
  );
  return atualizado;
}

export async function remover(id: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM clientes WHERE id_cliente = ?",
    [id],
  );
  return result.affectedRows > 0;
}
