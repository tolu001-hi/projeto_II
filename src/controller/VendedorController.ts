import { Request, Response } from "express";
import * as vendedorService from "../service/VendedorService";

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
    res.status(200).json(await vendedorService.listarVendedores());
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function buscarPorId(req: Request, res: Response): Promise<void> {
  try {
    res.status(200).json(await vendedorService.buscarVendedorPorId(Number(req.params.id)));
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function criar(req: Request, res: Response): Promise<void> {
  try {
    res.status(201).json(await vendedorService.criarVendedor(req.body));
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function atualizar(req: Request, res: Response): Promise<void> {
  try {
    res
      .status(200)
      .json(await vendedorService.atualizarVendedor(Number(req.params.id), req.body));
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function remover(req: Request, res: Response): Promise<void> {
  try {
    await vendedorService.removerVendedor(Number(req.params.id));
    res.status(200).json({ mensagem: "Vendedor removido com sucesso" });
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function listarNotas(req: Request, res: Response): Promise<void> {
  try {
    res.status(200).json(await vendedorService.listarNotasDoVendedor(Number(req.params.id)));
  } catch (erro) {
    handleErro(res, erro);
  }
}
