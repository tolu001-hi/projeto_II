import { pool } from "../database/mysql";
import { NotaFiscal } from "../model/NotaFiscal";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function listarTodas(): Promise<NotaFiscal[]> {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM notas_fiscais");
  return rows as NotaFiscal[];
}

export async function buscarPorId(id: number): Promise<NotaFiscal | undefined> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM notas_fiscais WHERE id_nota = ?",
    [id],
  );
  return rows[0] as NotaFiscal | undefined;
}

export async function buscarPorNumero(numero_nota: string): Promise<NotaFiscal | undefined> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM notas_fiscais WHERE numero_nota = ?",
    [numero_nota],
  );
  return rows[0] as NotaFiscal | undefined;
}

export async function buscarPorCliente(id_cliente: number): Promise<NotaFiscal[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM notas_fiscais WHERE id_cliente = ?",
    [id_cliente],
  );
  return rows as NotaFiscal[];
}

export async function buscarPorVendedor(id_vendedor: number): Promise<NotaFiscal[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM notas_fiscais WHERE id_vendedor = ?",
    [id_vendedor],
  );
  return rows as NotaFiscal[];
}

export async function buscarPorCarro(id_carro: number): Promise<NotaFiscal[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM notas_fiscais WHERE id_carro = ?",
    [id_carro],
  );
  return rows as NotaFiscal[];
}

export async function criar(dados: Omit<NotaFiscal, "id_nota">): Promise<NotaFiscal> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO notas_fiscais
      (numero_nota, data_emissao, valor_total, id_cliente, id_vendedor, id_carro)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      dados.numero_nota,
      dados.data_emissao,
      dados.valor_total,
      dados.id_cliente,
      dados.id_vendedor,
      dados.id_carro,
    ],
  );
  return { id_nota: result.insertId, ...dados };
}

// Emite a nota e decrementa o estoque em uma única transação (RN05),
// evitando condição de corrida entre a checagem e a baixa de estoque.
export async function criarComBaixaEstoque(
  dados: Omit<NotaFiscal, "id_nota">,
): Promise<NotaFiscal> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [estoqueRows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM estoque WHERE id_carro = ? FOR UPDATE",
      [dados.id_carro],
    );
    const estoque = estoqueRows[0];
    if (!estoque || estoque.quantidade <= 0) {
      throw { status: 422, mensagem: "Carro sem estoque disponível para venda" };
    }

    await connection.query(
      "UPDATE estoque SET quantidade = quantidade - 1 WHERE id_carro = ?",
      [dados.id_carro],
    );

    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO notas_fiscais
        (numero_nota, data_emissao, valor_total, id_cliente, id_vendedor, id_carro)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        dados.numero_nota,
        dados.data_emissao,
        dados.valor_total,
        dados.id_cliente,
        dados.id_vendedor,
        dados.id_carro,
      ],
    );

    await connection.commit();
    return { id_nota: result.insertId, ...dados };
  } catch (erro) {
    await connection.rollback();
    throw erro;
  } finally {
    connection.release();
  }
}
