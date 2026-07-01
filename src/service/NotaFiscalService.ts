import * as notaRepo from "../repository/NotaFiscalRepository";
import * as clienteRepo from "../repository/ClienteRepository";
import * as vendedorRepo from "../repository/VendedorRepository";
import * as carroRepo from "../repository/CarroRepository";
import * as estoqueRepo from "../repository/EstoqueRepository";
import { NotaFiscal } from "../model/NotaFiscal";

export async function listarNotas(): Promise<NotaFiscal[]> {
  return notaRepo.listarTodas();
}

export async function buscarNotaPorId(id: number): Promise<NotaFiscal> {
  const nota = await notaRepo.buscarPorId(id);
  if (!nota) throw { status: 404, mensagem: "Nota fiscal não encontrada" };
  return nota;
}

export async function emitirNota(dados: Omit<NotaFiscal, "id_nota">): Promise<NotaFiscal> {
  if (
    !dados.numero_nota ||
    !dados.data_emissao ||
    !dados.valor_total ||
    !dados.id_cliente ||
    !dados.id_vendedor ||
    !dados.id_carro
  ) {
    throw {
      status: 400,
      mensagem:
        "Campos obrigatórios: numero_nota, data_emissao, valor_total, id_cliente, id_vendedor, id_carro",
    };
  }
  if (dados.valor_total <= 0) {
    throw { status: 400, mensagem: "valor_total deve ser maior que zero" };
  }
  const hoje = new Date().toISOString().split("T")[0] as string;
  if (dados.data_emissao > hoje) {
    throw { status: 400, mensagem: "data_emissao não pode ser uma data futura" };
  }
  if (await notaRepo.buscarPorNumero(dados.numero_nota)) {
    throw { status: 409, mensagem: "Número de nota já cadastrado no sistema" };
  }
  if (!(await clienteRepo.buscarPorId(dados.id_cliente))) {
    throw { status: 404, mensagem: "Cliente não encontrado" };
  }
  if (!(await vendedorRepo.buscarPorId(dados.id_vendedor))) {
    throw { status: 404, mensagem: "Vendedor não encontrado" };
  }
  if (!(await carroRepo.buscarPorId(dados.id_carro))) {
    throw { status: 404, mensagem: "Carro não encontrado" };
  }
  const estoque = await estoqueRepo.buscarPorIdCarro(dados.id_carro);
  if (!estoque || estoque.quantidade <= 0) {
    throw { status: 422, mensagem: "Carro sem estoque disponível para venda" };
  }

  // Emissão + baixa de estoque em uma única transação (RN05)
  return notaRepo.criarComBaixaEstoque(dados);
}
