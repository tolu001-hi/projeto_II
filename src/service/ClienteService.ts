import * as clienteRepo from "../repository/ClienteRepository";
import * as notaRepo from "../repository/NotaFiscalRepository";
import { Cliente } from "../model/Cliente";

export async function listarClientes(): Promise<Cliente[]> {
  return clienteRepo.listarTodos();
}

export async function buscarClientePorId(id: number): Promise<Cliente> {
  const cliente = await clienteRepo.buscarPorId(id);
  if (!cliente) throw { status: 404, mensagem: "Cliente não encontrado" };
  return cliente;
}

export async function criarCliente(dados: Omit<Cliente, "id_cliente">): Promise<Cliente> {
  if (!dados.nome || !dados.cpf || !dados.telefone) {
    throw { status: 400, mensagem: "Campos obrigatórios: nome, cpf, telefone" };
  }
  if (await clienteRepo.buscarPorCpf(dados.cpf)) {
    throw { status: 409, mensagem: "CPF já cadastrado no sistema" };
  }
  return clienteRepo.criar(dados);
}

export async function atualizarCliente(
  id: number,
  dados: Partial<Omit<Cliente, "id_cliente">>,
): Promise<Cliente> {
  const existente = await clienteRepo.buscarPorId(id);
  if (!existente) throw { status: 404, mensagem: "Cliente não encontrado" };
  if (dados.cpf && dados.cpf !== existente.cpf) {
    if (await clienteRepo.buscarPorCpf(dados.cpf)) {
      throw { status: 409, mensagem: "CPF já cadastrado no sistema" };
    }
  }
  return (await clienteRepo.atualizar(id, dados)) as Cliente;
}

export async function removerCliente(id: number): Promise<void> {
  if (!(await clienteRepo.buscarPorId(id))) {
    throw { status: 404, mensagem: "Cliente não encontrado" };
  }
  const notas = await notaRepo.buscarPorCliente(id);
  if (notas.length > 0) {
    throw {
      status: 422,
      mensagem: "Não é possível remover cliente com notas fiscais vinculadas",
    };
  }
  await clienteRepo.remover(id);
}

export async function listarNotasDoCliente(id: number) {
  if (!(await clienteRepo.buscarPorId(id))) {
    throw { status: 404, mensagem: "Cliente não encontrado" };
  }
  return notaRepo.buscarPorCliente(id);
}
