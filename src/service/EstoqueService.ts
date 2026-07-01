import * as estoqueRepo from "../repository/EstoqueRepository";
import * as carroRepo from "../repository/CarroRepository";
import { Estoque } from "../model/Estoque";

export async function listarEstoques(): Promise<Estoque[]> {
  return estoqueRepo.listarTodos();
}

export async function buscarEstoquePorId(id: number): Promise<Estoque> {
  const estoque = await estoqueRepo.buscarPorId(id);
  if (!estoque) throw { status: 404, mensagem: "Registro de estoque não encontrado" };
  return estoque;
}

export async function buscarEstoquePorCarro(id_carro: number): Promise<Estoque> {
  const estoque = await estoqueRepo.buscarPorIdCarro(id_carro);
  if (!estoque) throw { status: 404, mensagem: "Estoque não encontrado para este carro" };
  return estoque;
}

export async function criarEstoque(dados: Omit<Estoque, "id_estoque">): Promise<Estoque> {
  if (
    dados.id_carro === undefined ||
    dados.quantidade === undefined ||
    !dados.localizacao_patio ||
    !dados.data_entrada
  ) {
    throw {
      status: 400,
      mensagem: "Campos obrigatórios: id_carro, quantidade, localizacao_patio, data_entrada",
    };
  }
  if (!(await carroRepo.buscarPorId(dados.id_carro))) {
    throw { status: 404, mensagem: "Carro não encontrado" };
  }
  if (!Number.isInteger(dados.quantidade) || dados.quantidade < 0) {
    throw { status: 400, mensagem: "Quantidade deve ser um inteiro maior ou igual a zero" };
  }
  const hoje = new Date().toISOString().split("T")[0] as string;
  if (dados.data_entrada > hoje) {
    throw { status: 400, mensagem: "data_entrada não pode ser uma data futura" };
  }
  if (await estoqueRepo.buscarPorIdCarro(dados.id_carro)) {
    throw {
      status: 409,
      mensagem: "Já existe estoque para este carro. Use PUT para atualizar.",
    };
  }
  return estoqueRepo.criar(dados);
}

export async function atualizarEstoque(
  id: number,
  dados: Partial<Omit<Estoque, "id_estoque">>,
): Promise<Estoque> {
  if (!(await estoqueRepo.buscarPorId(id))) {
    throw { status: 404, mensagem: "Registro de estoque não encontrado" };
  }
  if (dados.quantidade !== undefined) {
    if (!Number.isInteger(dados.quantidade) || dados.quantidade < 0) {
      throw { status: 400, mensagem: "Quantidade deve ser um inteiro maior ou igual a zero" };
    }
  }
  if (dados.data_entrada) {
    const hoje = new Date().toISOString().split("T")[0] as string;
    if (dados.data_entrada > hoje) {
      throw { status: 400, mensagem: "data_entrada não pode ser uma data futura" };
    }
  }
  return (await estoqueRepo.atualizar(id, dados)) as Estoque;
}

export async function removerEstoque(id: number): Promise<void> {
  if (!(await estoqueRepo.buscarPorId(id))) {
    throw { status: 404, mensagem: "Registro de estoque não encontrado" };
  }
  await estoqueRepo.remover(id);
}
