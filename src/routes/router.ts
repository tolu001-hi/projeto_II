import { Router } from "express";

import * as clienteController from "../controller/ClienteController";
import * as vendedorController from "../controller/VendedorController";
import * as carroController from "../controller/CarroController";
import * as estoqueController from "../controller/EstoqueController";
import * as notaFiscalController from "../controller/NotaFiscalController";

const router = Router();

// ---------- Clientes ----------
router.get("/clientes", clienteController.listar);
router.get("/clientes/notas/:id", clienteController.listarNotas);
router.get("/clientes/:id", clienteController.buscarPorId);
router.post("/clientes", clienteController.criar);
router.put("/clientes/:id", clienteController.atualizar);
router.delete("/clientes/:id", clienteController.remover);

// ---------- Vendedores ----------
router.get("/vendedores", vendedorController.listar);
router.get("/vendedores/notas/:id", vendedorController.listarNotas);
router.get("/vendedores/:id", vendedorController.buscarPorId);
router.post("/vendedores", vendedorController.criar);
router.put("/vendedores/:id", vendedorController.atualizar);
router.delete("/vendedores/:id", vendedorController.remover);

// ---------- Carros ----------
// /carros/disponiveis precisa vir ANTES de /carros/:id
router.get("/carros/disponiveis", carroController.listarDisponiveis);
router.get("/carros", carroController.listar);
router.get("/carros/:id", carroController.buscarPorId);
router.post("/carros", carroController.criar);
router.put("/carros/:id", carroController.atualizar);
router.delete("/carros/:id", carroController.remover);

// ---------- Estoque ----------
router.get("/estoque", estoqueController.listar);
router.get("/estoque/carro/:id_carro", estoqueController.buscarPorCarro);
router.get("/estoque/:id", estoqueController.buscarPorId);
router.post("/estoque", estoqueController.criar);
router.put("/estoque/:id", estoqueController.atualizar);
router.delete("/estoque/:id", estoqueController.remover);

// ---------- Notas Fiscais ----------
router.get("/notas", notaFiscalController.listar);
router.get("/notas/:id", notaFiscalController.buscarPorId);
router.post("/notas", notaFiscalController.emitir);

export default router;
