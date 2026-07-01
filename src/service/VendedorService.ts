import * as vendedorRepo from "../repository/VendedorRepository";
import * as notaRepo from "../repository/NotaFiscalRepository";
import { Vendedor } from "../model/Vendedor";

export async function listarVendedores(): Promise<Vendedor[]> {
  return vendedorRepo.listarTodos();
}

export async function buscarVendedorPorId(id: number): Promise<Vendedor> {
  const vendedor = await vendedorRepo.buscarPorId(id);
  if (!vendedor) throw { status: 404, mensagem: "Vendedor não encontrado" };
  return vendedor;
}

export async function criarVendedor(dados: Omit<Vendedor, "id_vendedor">): Promise<Vendedor> {
  if (!dados.nome || !dados.matricula || dados.comissao_percentual === undefined) {
    throw {
      status: 400,
      mensagem: "Campos obrigatórios: nome, matricula, comissao_percentual",
    };
  }
  if (dados.comissao_percentual < 0 || dados.comissao_percentual > 30) {
    throw { status: 400, mensagem: "comissao_percentual deve ser entre 0 e 30" };
  }
  if (await vendedorRepo.buscarPorMatricula(dados.matricula)) {
    throw { status: 409, mensagem: "Matrícula já cadastrada no sistema" };
  }
  return vendedorRepo.criar(dados);
}

export async function atualizarVendedor(
  id: number,
  dados: Partial<Omit<Vendedor, "id_vendedor">>,
): Promise<Vendedor> {
  const existente = await vendedorRepo.buscarPorId(id);
  if (!existente) throw { status: 404, mensagem: "Vendedor não encontrado" };
  if (dados.comissao_percentual !== undefined) {
    if (dados.comissao_percentual < 0 || dados.comissao_percentual > 30) {
      throw { status: 400, mensagem: "comissao_percentual deve ser entre 0 e 30" };
    }
  }
  if (dados.matricula && dados.matricula !== existente.matricula) {
    if (await vendedorRepo.buscarPorMatricula(dados.matricula)) {
      throw { status: 409, mensagem: "Matrícula já cadastrada no sistema" };
    }
  }
  return (await vendedorRepo.atualizar(id, dados)) as Vendedor;
}

export async function removerVendedor(id: number): Promise<void> {
  if (!(await vendedorRepo.buscarPorId(id))) {
    throw { status: 404, mensagem: "Vendedor não encontrado" };
  }
  const notas = await notaRepo.buscarPorVendedor(id);
  if (notas.length > 0) {
    throw {
      status: 422,
      mensagem: "Não é possível remover vendedor com notas fiscais vinculadas",
    };
  }
  await vendedorRepo.remover(id);
}

export async function listarNotasDoVendedor(id: number) {
  if (!(await vendedorRepo.buscarPorId(id))) {
    throw { status: 404, mensagem: "Vendedor não encontrado" };
  }
  return notaRepo.buscarPorVendedor(id);
}
