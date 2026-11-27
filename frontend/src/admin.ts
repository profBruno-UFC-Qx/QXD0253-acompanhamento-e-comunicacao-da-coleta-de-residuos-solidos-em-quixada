// tela do administrador (criar e apagar avisos)
import { exigirPapel, logado, Tempapel, sair } from "./auth.js";
import {
  listarAvisos, listarRegioes, criarAviso, apagarAviso, mensagemDeErro, Aviso,
} from "./avisos-service.js";

const PAPEL_ADMIN = "Administrador";

const statusEl = document.getElementById("status") as HTMLParagraphElement;
const form = document.getElementById("form-aviso") as HTMLFormElement;
const titulo = document.getElementById("titulo") as HTMLInputElement;
const mensagem = document.getElementById("mensagem") as HTMLTextAreaElement;
const geral = document.getElementById("geral") as HTMLInputElement;
const regiao = document.getElementById("regiao") as HTMLSelectElement;
const btnSalvar = document.getElementById("btn-salvar") as HTMLButtonElement;
const listaEl = document.getElementById("lista-avisos") as HTMLUListElement;
const btnSair = document.getElementById("btn-sair") as HTMLButtonElement;
const conteudo = document.getElementById("conteudo") as HTMLElement;

function mostrarStatus(msg: string, tipo: "erro" | "info" | "ok"): void {
  statusEl.textContent = msg; // textContent: nunca innerHTML
  statusEl.className = `status ${tipo}`;
  statusEl.hidden = msg === "";
}

function tratarErro(e: unknown): void {
  // api.ts apaga o jwt quando a API responde 401 (token expirado): pedir login de novo
  if (!logado()) {
    window.location.href = "login.html";
    return;
  }
  mostrarStatus(mensagemDeErro(e), "erro");
}

function criar(tag: string, classe: string, texto: string): HTMLElement {
  const e = document.createElement(tag);
  e.className = classe;
  e.textContent = texto;
  return e;
}

function renderizar(avisos: Aviso[]): void {
  listaEl.replaceChildren();
  if (avisos.length === 0) {
    listaEl.appendChild(criar("li", "vazio", "Nenhum aviso cadastrado."));
    return;
  }
  for (const a of avisos) {
    const li = document.createElement("li");
    li.className = "card";
    li.appendChild(criar("h3", "card-titulo", a.titulo));
    li.appendChild(criar("p", "card-texto", a.mensagem));

    const rodape = document.createElement("div");
    rodape.className = "card-rodape";
    rodape.appendChild(
      criar("span", a.geral ? "tag tag-geral" : "tag", a.geral ? "Geral" : a.regiao?.nome ?? "Região")
    );

    const btn = criar("button", "btn btn-perigo", "Apagar") as HTMLButtonElement;
    btn.type = "button";
    btn.addEventListener("click", async () => {
      if (!window.confirm(`Apagar o aviso "${a.titulo}"?`)) return;
      btn.disabled = true;
      try {
        await apagarAviso(a.documentId);
        mostrarStatus("Aviso apagado.", "ok");
        await recarregarLista();
      } catch (e) {
        btn.disabled = false;
        tratarErro(e);
      }
    });
    rodape.appendChild(btn);
    li.appendChild(rodape);
    listaEl.appendChild(li);
  }
}

async function recarregarLista(): Promise<void> {
  renderizar(await listarAvisos());
}

geral.addEventListener("change", () => {
  regiao.disabled = geral.checked;
  if (geral.checked) regiao.value = "";
});

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const t = titulo.value.trim();
  const m = mensagem.value.trim();
  if (!t || !m) {
    mostrarStatus("Preencha o título e a mensagem.", "erro");
    return;
  }
  if (!geral.checked && regiao.value === "") {
    mostrarStatus("Escolha uma região ou marque o aviso como geral.", "erro");
    return;
  }
  btnSalvar.disabled = true;
  try {
    await criarAviso({
      titulo: t,
      mensagem: m,
      geral: geral.checked,
      regiaoDocumentId: geral.checked ? null : regiao.value,
    });
    form.reset();
    regiao.disabled = false;
    mostrarStatus("Aviso criado com sucesso.", "ok");
    await recarregarLista();
  } catch (e) {
    tratarErro(e);
  } finally {
    btnSalvar.disabled = false;
  }
});

btnSair.addEventListener("click", () => {
  sair();
  window.location.href = "login.html";
});

async function iniciar(): Promise<void> {
  // só Administrador entra; senão exigirPapel() manda para login.html
  exigirPapel(PAPEL_ADMIN);
  if (!logado() || !Tempapel(PAPEL_ADMIN)) return;

  conteudo.hidden = false;
  try {
    const [regioes, avisos] = await Promise.all([listarRegioes(), listarAvisos()]);
    for (const r of regioes) {
      const o = document.createElement("option");
      o.value = r.documentId;
      o.textContent = r.nome;
      regiao.appendChild(o);
    }
    renderizar(avisos);
  } catch (e) {
    tratarErro(e);
  }
}

void iniciar();
