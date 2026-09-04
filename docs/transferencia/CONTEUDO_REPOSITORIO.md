# Conteúdo do repositório

## Árvore funcional

| Caminho | Finalidade | Situação |
| --- | --- | --- |
| `index.html` | Aplicação completa: UI, estilos, validações, payload, envio e comprovante | Versionado |
| `assets/` | Arte atual, PNG original, JPEG otimizado, PSD institucional, avatar e imagens históricas | Versionado |
| `preview/preview-canal-escuta.html` | Preview offline sem persistência | Versionado |
| `docs/historico/` | READMEs das versões inicial e dashboard | Versionado; somente histórico |
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

A arte visível está incorporada como `data:image/jpeg;base64` no `index.html` e também foi incluída como `assets/hero-unificada-opt.jpg`; a versão maior está em `assets/hero-unificada.png`. Um PSD institucional de 1600 × 400 e o avatar do WhatsApp foram recuperados em `assets/editaveis/`. A TI/Marketing deve confirmar se o PSD corresponde à matriz exata da arte vertical antes de editar. Os contatos rasterizados são WhatsApp `+55 83 99306-9348` e e-mail `canaldeescuta@mangabeirashopping.com.br`.

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

Não foram encontrados caminhos absolutos, symlinks ou arquivos técnicos essenciais adicionais. Código, cópias do Apps Script, assets atuais/históricos, PSD encontrado, preview e documentação local relevante foram incorporados. Não resta dependência técnica essencial exclusiva deste computador.
