export interface NotaFiscal {
  id_nota: number;
  numero_nota: string;
  data_emissao: string; // formato YYYY-MM-DD
  valor_total: number;
  id_cliente: number;
  id_vendedor: number;
  id_carro: number;
}
