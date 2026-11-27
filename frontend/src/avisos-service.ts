// funções de acesso a Região e Aviso, usadas por avisos.ts e admin.ts.
// Todo fetch passa por chamarAPI (api.ts).
import { chamarAPI } from "./api.js";

export interface Regiao {
  id: number;
  documentId: string;
  nome: string;
}

export interface Aviso {
  id: number;
  documentId: string;
  titulo: string;
  mensagem: string;
  geral: boolean;
  regiao: Regiao | null;
  createdAt: string;
  publishedAt: string | null;
}

export interface NovoAviso {
  titulo: string;
  mensagem: string;
  geral: boolean;
  regiaoDocumentId: string | null;
}

export async function listarRegioes(): Promise<Regiao[]> {
  const r = await chamarAPI("/regioes?sort=nome:asc&pagination[pageSize]=100");
  return r.data as Regiao[];
}

export async function listarAvisos(): Promise<Aviso[]> {
  const r = await chamarAPI("/avisos?populate=regiao&sort=createdAt:desc&pagination[pageSize]=100");
  return r.data as Aviso[];
}

export async function criarAviso(novo: NovoAviso): Promise<void> {
  const data = {
    titulo: novo.titulo,
    mensagem: novo.mensagem,
    geral: novo.geral,
    regiao: novo.geral ? null : novo.regiaoDocumentId,
  };
  // status=published: Aviso tem rascunho/publicação; sem isso ele não apareceria na lista.
  await chamarAPI("/avisos?status=published", "POST", { data });
}

export async function apagarAviso(documentId: string): Promise<void> {
  // Strapi 5 usa o documentId (texto) na URL, não o id numérico.
  await chamarAPI(`/avisos/${encodeURIComponent(documentId)}`, "DELETE");
}

// Mensagem para mostrar ao usuário (só os catch das telas chamam isto).
export function mensagemDeErro(e: unknown): string {
  if (e instanceof TypeError) {
    return "Falha de conexão: não foi possível falar com o servidor. Verifique sua internet e tente de novo.";
  }
  if (e instanceof Error) return e.message;
  return "Ocorreu um erro inesperado.";
}
