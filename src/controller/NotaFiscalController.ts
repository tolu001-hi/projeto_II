import { Request, Response } from "express";
import * as notaService from "../service/NotaFiscalService";

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
    res.status(200).json(await notaService.listarNotas());
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function buscarPorId(req: Request, res: Response): Promise<void> {
  try {
    res.status(200).json(await notaService.buscarNotaPorId(Number(req.params.id)));
  } catch (erro) {
    handleErro(res, erro);
  }
}

export async function emitir(req: Request, res: Response): Promise<void> {
  try {
    res.status(201).json(await notaService.emitirNota(req.body));
  } catch (erro) {
    handleErro(res, erro);
  }
}
