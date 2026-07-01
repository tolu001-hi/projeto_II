export interface Cliente {
  id_cliente: number;
  nome: string;
  cpf: string;
  telefone: string;
  email?: string | null;
  cidade?: string | null;
}
