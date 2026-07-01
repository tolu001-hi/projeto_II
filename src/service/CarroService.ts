import * as carroRepo from "../repository/CarroRepository";
import * as estoqueRepo from "../repository/EstoqueRepository";
import * as notaRepo from "../repository/NotaFiscalRepository";
import { Carro } from "../model/Carro";

export async function listarCarros(): Promise<Carro[]> {
  return carroRepo.listarTodos();
}

export async function listarCarrosDisponiveis(): Promise<Carro[]> {
  return carroRepo.listarDisponiveis();
}

export async function buscarCarroPorId(id: number): Promise<Carro> {
  const carro = await carroRepo.buscarPorId(id);
  if (!carro) throw { status: 404, mensagem: "Carro não encontrado" };
  return carro;
}

export async function criarCarro(dados: Omit<Carro, "id_carro">): Promise<Carro> {
  if (!dados.marca || !dados.modelo || !dados.ano || !dados.placa || !dados.preco || !dados.cor) {
    throw {
      status: 400,
      mensagem: "Campos obrigatórios: marca, modelo, ano, placa, preco, cor",
    };
  }
  const anoAtual = new Date().getFullYear();
  if (!Number.isInteger(dados.ano) || dados.ano < 1950 || dados.ano > anoAtual + 1) {
    throw { status: 400, mensagem: `Ano deve ser inteiro entre 1950 e ${anoAtual + 1}` };
  }
  if (dados.preco <= 0) {
    throw { status: 400, mensagem: "Preço deve ser maior que zero" };
  }
  if (await carroRepo.buscarPorPlaca(dados.placa)) {
    throw { status: 409, mensagem: "Placa já cadastrada no sistema" };
  }
  return carroRepo.criar(dados);
}

export async function atualizarCarro(
  id: number,
  dados: Partial<Omit<Carro, "id_carro">>,
): Promise<Carro> {
  const existente = await carroRepo.buscarPorId(id);
  if (!existente) throw { status: 404, mensagem: "Carro não encontrado" };
  if (dados.ano !== undefined) {
    const anoAtual = new Date().getFullYear();
    if (!Number.isInteger(dados.ano) || dados.ano < 1950 || dados.ano > anoAtual + 1) {
      throw { status: 400, mensagem: `Ano deve ser inteiro entre 1950 e ${anoAtual + 1}` };
    }
  }
  if (dados.preco !== undefined && dados.preco <= 0) {
    throw { status: 400, mensagem: "Preço deve ser maior que zero" };
  }
  if (dados.placa && dados.placa !== existente.placa) {
    if (await carroRepo.buscarPorPlaca(dados.placa)) {
      throw { status: 409, mensagem: "Placa já cadastrada no sistema" };
    }
  }
  return (await carroRepo.atualizar(id, dados)) as Carro;
}

export async function removerCarro(id: number): Promise<void> {
  if (!(await carroRepo.buscarPorId(id))) {
    throw { status: 404, mensagem: "Carro não encontrado" };
  }
  if (await estoqueRepo.buscarPorIdCarro(id)) {
    throw {
      status: 422,
      mensagem: "Não é possível remover carro com registro de estoque",
    };
  }
  const notas = await notaRepo.buscarPorCarro(id);
  if (notas.length > 0) {
    throw {
      status: 422,
      mensagem: "Não é possível remover carro com notas fiscais vinculadas",
    };
  }
  await carroRepo.remover(id);
}
