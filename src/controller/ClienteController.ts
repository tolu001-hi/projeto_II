import { Request, Response } from "express";
import * as clienteService from "../service/ClienteService";

function handleErro(res: Response, erro: any): void {
  if (erro.status && erro.mensagem) {
    res.status(erro.status).json({ erro: erro.mensagem });
  } else {
    console.error(erro);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
}

export async function listar(req: Request, res: Response): Promise<void> {
  try {
    res.status(200).json(await clienteService.listarClientes());
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function buscarPorId(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    res.status(200).json(await clienteService.buscarClientePorId(id));
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function criar(req: Request, res: Response): Promise<void> {
  try {
    res.status(201).json(await clienteService.criarCliente(req.body));
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function atualizar(req: Request, res: Response): Promise<void> {
  try {
    const id = Number(req.params.id);
    res.status(200).json(await clienteService.atualizarCliente(id, req.body));
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function remover(req: Request, res: Response): Promise<void> {
  try {
    await clienteService.removerCliente(Number(req.params.id));
    res.status(200).json({ mensagem: "Cliente removido com sucesso" });
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function listarNotas(req: Request, res: Response): Promise<void> {
  try {
    res.status(200).json(await clienteService.listarNotasDoCliente(Number(req.params.id)));
  } catch (erro) {
    handleErro(res, erro);
  }
}
