// lista de avisos (usuário logado)
import { exigirLogin, logado, sair } from "./auth.js";
import { listarAvisos, listarRegioes, mensagemDeErro, Aviso, Regiao } from "./avisos-service.js";

const REGIAO_KEY = "regiaoSelecionada";

const statusEl = document.getElementById("status") as HTMLParagraphElement;
const listaEl = document.getElementById("lista-avisos") as HTMLUListElement;
const selectRegiao = document.getElementById("regiao") as HTMLSelectElement;
const btnSair = document.getElementById("btn-sair") as HTMLButtonElement;

let avisos: Aviso[] = [];

function mostrarStatus(msg: string, tipo: "erro" | "info"): void {
  statusEl.textContent = msg; // textContent: nunca innerHTML
  statusEl.className = `status ${tipo}`;
  statusEl.hidden = msg === "";
}

function criar(tag: string, classe: string, texto: string): HTMLElement {
  const e = document.createElement(tag);
  e.className = classe;
  e.textContent = texto;
  return e;
}

function renderizar(): void {
  listaEl.replaceChildren();
  const regiaoId = selectRegiao.value;

  // Avisos gerais + os da região escolhida
  const visiveis = avisos.filter(
    (a) => a.geral || (regiaoId !== "" && a.regiao?.documentId === regiaoId)
  );

  if (visiveis.length === 0) {
    mostrarStatus(
      regiaoId === ""
        ? "Nenhum aviso geral no momento. Escolha sua região para ver os avisos dela."
        : "Nenhum aviso para exibir no momento.",
      "info"
    );
    return;
  }
  mostrarStatus("", "info");

  for (const a of visiveis) {
    const li = document.createElement("li");
    li.className = "card";
    li.appendChild(criar("h3", "card-titulo", a.titulo));
    li.appendChild(criar("p", "card-texto", a.mensagem));

    const rodape = document.createElement("div");
    rodape.className = "card-rodape";
    rodape.appendChild(
      criar("span", a.geral ? "tag tag-geral" : "tag", a.geral ? "Geral" : a.regiao?.nome ?? "Região")
    );
    const data = new Date(a.publishedAt ?? a.createdAt).toLocaleDateString("pt-BR");
    rodape.appendChild(criar("span", "data", data));
    li.appendChild(rodape);

    listaEl.appendChild(li);
  }
}

function preencherRegioes(regioes: Regiao[]): void {
  selectRegiao.replaceChildren();
  const vazio = document.createElement("option");
  vazio.value = "";
  vazio.textContent = "Selecione sua região";
  selectRegiao.appendChild(vazio);
  for (const r of regioes) {
    const o = document.createElement("option");
    o.value = r.documentId;
    o.textContent = r.nome;
    selectRegiao.appendChild(o);
  }
  const salva = localStorage.getItem(REGIAO_KEY);
  if (salva && regioes.some((r) => r.documentId === salva)) selectRegiao.value = salva;
}

async function carregar(): Promise<void> {
  mostrarStatus("Carregando avisos...", "info");
  try {
    const [regioes, lista] = await Promise.all([listarRegioes(), listarAvisos()]);
    avisos = lista;
    preencherRegioes(regioes);
    renderizar();
  } catch (e) {
    // api.ts apaga o jwt quando a API responde 401 (token expirado): pedir login de novo
    if (!logado()) {
      window.location.href = "login.html";
      return;
    }
    mostrarStatus(mensagemDeErro(e), "erro");
  }
}

selectRegiao.addEventListener("change", () => {
  localStorage.setItem(REGIAO_KEY, selectRegiao.value);
  renderizar();
});

btnSair.addEventListener("click", () => {
  sair();
  window.location.href = "login.html";
});

// tela restrita; sem login, exigirLogin() manda para login.html
if (exigirLogin()) {
  void carregar();
}
