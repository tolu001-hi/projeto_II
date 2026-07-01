import { Request, Response } from "express";
import * as carroService from "../service/CarroService";

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
    res.status(200).json(await carroService.listarCarros());
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function listarDisponiveis(req: Request, res: Response): Promise<void> {
  try {
    res.status(200).json(await carroService.listarCarrosDisponiveis());
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function buscarPorId(req: Request, res: Response): Promise<void> {
  try {
    res.status(200).json(await carroService.buscarCarroPorId(Number(req.params.id)));
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function criar(req: Request, res: Response): Promise<void> {
  try {
    res.status(201).json(await carroService.criarCarro(req.body));
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function atualizar(req: Request, res: Response): Promise<void> {
  try {
    res.status(200).json(await carroService.atualizarCarro(Number(req.params.id), req.body));
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function remover(req: Request, res: Response): Promise<void> {
  try {
    await carroService.removerCarro(Number(req.params.id));
    res.status(200).json({ mensagem: "Carro removido com sucesso" });
  } catch (erro) {
    handleErro(res, erro);
  }
}
