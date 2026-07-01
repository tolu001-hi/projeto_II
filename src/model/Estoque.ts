export interface Estoque {
  id_estoque: number;
  id_carro: number;
  quantidade: number;
  localizacao_patio: string;
  data_entrada: string; // formato YYYY-MM-DD
}
