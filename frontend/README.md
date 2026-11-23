# Front-end

HTML, CSS e TypeScript, ligado ao Strapi (`../backend`).

## Como rodar

1. Subir o Strapi: `cd ../backend && npm run develop` (http://localhost:1337)
2. Neste diretório: `npm install`
3. Compilar o TypeScript: `npx tsc --watch` (deixe aberto; gera a pasta `dist`)
4. Servir a pasta (outro terminal): `python3 -m http.server 8000`
5. Abrir http://localhost:8000

## Estrutura

- `src/api.ts`: função `chamarAPi`, compartilhada. Todo `fetch` passa por ela.
- `src/auth.ts`, `login.ts`, `coletor.ts`: Pessoa 1
- `src/cronograma.ts`, `localizacao.ts`, `index.html`, `style.css`: Pessoa 2
- `src/avisos.ts`, `admin.ts`, `avisos.html`, `admin.html`: Pessoa 3

## Regras

- Nos imports, use `.js` no fim: `import { chamarAPi } from "./api.js"`
- Nos HTML, use `<script type="module" src="dist/arquivo.js">`
- Só o `catch` das telas mostra erro ao usuário; o `api.ts` lança o erro
- Não comitar `node_modules`, `dist` nem `.env`
