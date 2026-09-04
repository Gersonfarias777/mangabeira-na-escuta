# Conteúdo do repositório

## Árvore funcional

| Caminho | Finalidade | Situação |
| --- | --- | --- |
| `index.html` | Aplicação completa: UI, estilos, validações, payload, envio e comprovante | Versionado |
| `.nojekyll` | Publicação estática no GitHub Pages sem Jekyll | Versionado |
| `.gitignore` | Exclusão de credenciais e estado local | Versionado nesta entrega |
| `.env.example` | Modelo sem valores reais | Versionado nesta entrega |
| `apps-script/Code.gs` | Backend completo recuperado: API, planilha, Drive, e-mail e dashboard | Versionado; paridade remota a validar |
| `apps-script/Index.html` | Formulário executável dentro do Apps Script | Versionado; variante do frontend público |
| `apps-script/Dashboard.html` | Painel administrativo institucional | Versionado |
| `apps-script/legacy/` | Cópia anterior preservada para histórico, não implantar | Versionado |
| `apps-script/appsscript.json` | Manifesto mínimo V8 reproduzível | Versionado nesta entrega |
| `apps-script/.clasp.json.example` | Modelo de vínculo ao projeto institucional | Versionado nesta entrega |
| `docs/canal-de-escuta-validacao-juridica.{md,html,pdf}` | Levantamento jurídico preexistente em três formatos | Não rastreado no início; incluído na entrega |
| `Arquitetura-Mangabeira-na-Escuta.pdf` | Documento arquitetural preexistente | Não rastreado no início; incluído na entrega |
| `docs/transferencia/` | Pacote operacional para a TI | Criado nesta entrega |
| `.claude/settings.json` | Permissão local de ferramenta; não é necessária em produção | Versionado preexistente; dispensável à aplicação |

## Assets

A arte visível está incorporada como `data:image/jpeg;base64` no próprio `index.html`; portanto, a imagem usada em execução está versionada. O arquivo-fonte editável da arte não foi localizado. A TI deve solicitar o original (Canva/PSD/AI ou equivalente), confirmar direitos e registrar o número de WhatsApp caso ele esteja apenas desenhado na imagem.

Não há `package.json`, framework, bundle, API própria, migrations, submódulos, symlinks, certificados, chaves, banco local ou painel administrativo no repositório.

## Itens locais auditados

| Item | Classe | Tratamento |
| --- | --- | --- |
| `.env.local` com nome `VERCEL_OIDC_TOKEN` | Credencial efêmera | Fora do Git; recriar/autenticar na conta institucional |
| `.vercel/project.json` | Vínculo local a projeto Vercel | Fora do Git; recriar com `vercel link` |
| `.gitignore` e documentos | Necessário versionar | Incluídos nesta entrega |
| PDFs/HTML/Markdown jurídicos | Documento institucional | Incluídos; validar conteúdo com Jurídico |
| Código Apps Script local | Necessário versionar | Recuperado e incluído, com versão legada preservada |
| Dados/anexos reais | Produção | Permanecer fora do Git |

Não foram encontrados caminhos absolutos, symlinks ou arquivos técnicos essenciais adicionais. Com a incorporação das duas cópias locais do Apps Script, não resta dependência técnica essencial exclusiva deste computador. O editável da arte continua sendo pendência documental/criativa; o asset executável está incorporado e versionado.
