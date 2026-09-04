# Variáveis de ambiente

O frontend atual não consulta `process.env` nem outra variável em runtime. A URL do Web App está hardcoded em `index.html`, na chamada `fetch`. Para trocar o backend, altere essa URL e publique uma nova revisão.

| Variável | Serviço | Finalidade | Ambiente | Sensível? |
| --- | --- | --- | --- | --- |
| `VERCEL_OIDC_TOKEN` | Vercel CLI | Token efêmero criado no estado local da ferramenta; não é dependência do site | Desenvolvimento local | Sim |

O arquivo `.env.example` contém apenas o nome comentado. `.env.local`, `.env*` (exceto o exemplo), `.vercel/` e `.clasp.json` real são ignorados.

## Melhoria futura recomendada

Se o frontend deixar de ser HTML estático puro, introduzir `APPS_SCRIPT_WEB_APP_URL` no processo de build. Enquanto não houver build, uma variável Vercel não substitui automaticamente texto dentro de `index.html`; documentar uma variável inexistente como se fosse funcional criaria falsa segurança.
