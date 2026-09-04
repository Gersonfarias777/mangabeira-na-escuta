# Ativos externos e configurações institucionais

Este arquivo contém identificadores e contatos necessários à manutenção. Não contém senhas, tokens, cookies, PINs ou dados de manifestações.

| Ativo | Valor/evidência pública | Administração futura |
| --- | --- | --- |
| Repositório | `Gersonfarias777/mangabeira-na-escuta` | Transferir/espelhar para organização institucional |
| Branch de publicação atual | `gh-pages` | Proteger após transferência e exigir revisão |
| GitHub Pages | `https://gersonfarias777.github.io/mangabeira-na-escuta/` | Manter até domínio/Vercel serem validados |
| Projeto Vercel local | `mangabeira-na-escuta` | Recriar vínculo com `vercel link`; IDs ficam em `.vercel/` |
| Web App Apps Script | URL referenciada em `index.html` | Deployment ID está no URL público; comparar com o painel institucional |
| Planilha | Container-bound, nome definido pelo código: `MANGABEIRA NA ESCUTA` | Acessar pelo projeto Apps Script/Drive; registrar URL e ACL no inventário interno |
| Pasta de anexos | `Canal de Escuta - Anexos (Formulario)` | O código busca por nome; migrar para ID em Script Properties após teste |
| E-mail do canal | `canaldeescuta@mangabeirashopping.com.br` | Destinatário em `CANAL_CONFIG.DEST_EMAIL`; TI tem acesso confirmado |
| WhatsApp público | `+55 83 99306-9348` | Número visível na arte; TI tem acesso confirmado |
| Dashboard Apps Script | Rota padrão de `doGet`; formulário em `?view=form` | Restrito no código ao e-mail do canal ou domínio institucional |

## Onde alterar

- E-mail: `CANAL_CONFIG.DEST_EMAIL` em `apps-script/Code.gs` e texto rasterizado na arte do formulário.
- WhatsApp: hoje aparece somente dentro da arte JPEG Base64. Os arquivos gráficos recuperados estão em `assets/`; confirme a matriz correta e substitua a imagem nas duas versões (`index.html` e `apps-script/Index.html`).
- Endpoint Apps Script: chamada `fetch` em `index.html`.
- Nomes de planilha, abas e pasta: `CANAL_CONFIG` em `apps-script/Code.gs`.
- Domínio: configurar na Vercel e no DNS somente com os registros fornecidos pelo painel.

Os valores administrativos não públicos — `scriptId`, IDs internos de Vercel, URL da planilha, ID da pasta, PIN do WhatsApp, sessões e tokens — devem ser entregues no cofre. O Git contém instruções para recriá-los/localizá-los sem depender deste computador.
