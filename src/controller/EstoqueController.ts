import { Request, Response } from "express";
import * as estoqueService from "../service/EstoqueService";

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
    res.status(200).json(await estoqueService.listarEstoques());
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function buscarPorId(req: Request, res: Response): Promise<void> {
  try {
    res.status(200).json(await estoqueService.buscarEstoquePorId(Number(req.params.id)));
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function buscarPorCarro(req: Request, res: Response): Promise<void> {
  try {
    res
      .status(200)
      .json(await estoqueService.buscarEstoquePorCarro(Number(req.params.id_carro)));
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function criar(req: Request, res: Response): Promise<void> {
  try {
    res.status(201).json(await estoqueService.criarEstoque(req.body));
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function atualizar(req: Request, res: Response): Promise<void> {
  try {
    res
      .status(200)
      .json(await estoqueService.atualizarEstoque(Number(req.params.id), req.body));
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function remover(req: Request, res: Response): Promise<void> {
  try {
    await estoqueService.removerEstoque(Number(req.params.id));
    res.status(200).json({ mensagem: "Registro removido com sucesso" });
  } catch (erro) {
    handleErro(res, erro);
  }
}
