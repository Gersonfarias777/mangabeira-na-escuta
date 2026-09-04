# Relatório de transferência institucional

Data da auditoria: 04/09/2026. Escopo: repositório local, Git/GitHub acessível, URL pública do GitHub Pages e metadados locais da Vercel. Não houve envio de formulário, alteração de produção, transferência de conta, DNS, dados ou revogação.

## 1. Resumo executivo

O frontend é simples e transferível: uma página estática sem dependências, build ou servidor próprio. Após a primeira auditoria, foram localizadas duas cópias do backend fora do repositório; ambas agora estão preservadas no Git, com a versão completa como fonte principal e a anterior em `legacy/`. O fluxo está tecnicamente documentado, mas a TI deve comprovar que a fonte corresponde à implantação atual e registrar os ativos remotos. O acesso ao Gmail/e-mail do canal e ao WhatsApp foi confirmado pelo responsável.

## 2. Escopo e limitações

Foram lidos arquivos textuais relevantes, histórico Git, estado ignorado/não rastreado, configurações locais, fontes encontradas nas pastas adjacentes e PDFs fornecidos. Consultas GitHub foram somente leitura. Não havia Vercel CLI instalada; não foi usado token local nem consultado o painel. Não houve consulta ao editor Apps Script, planilha, Drive, DNS ou logs. O acesso da TI ao Gmail/e-mail e WhatsApp foi informado pelo responsável, mas seus metadados administrativos não foram expostos no Git.

## 3. Arquitetura

`navegador -> index.html estático -> HTTPS POST form-urlencoded -> doPost Apps Script -> Sheets + Drive opcional + MailApp`.

O backend recuperado confirma Sheets, Drive e MailApp, além de dashboard institucional. O frontend público gera o protocolo no cliente e o backend aceita o protocolo válido recebido; a versão do formulário interna ao Apps Script recebe protocolo gerado pelo servidor. Essa diferença explica parte da divergência documental. Não existe API própria, Supabase ou banco SQL.

## 4. GitHub

- Repositório: `Gersonfarias777/mangabeira-na-escuta`, **público** na data da auditoria.
- Branch padrão/produção Pages: `gh-pages`; única branch, sem tags e sem proteção/rulesets.
- Quatro commits; autoria por `GERSON FARIAS` e um commit por `Codex <canaldeescuta@mangabeirashopping.com.br>`.
- Um colaborador administrador: `Gersonfarias777`.
- Sem secrets/variables de Actions, webhooks ou deploy keys; workflow interno ativo `pages-build-deployment` e environment `github-pages`.
- Local e remoto estavam 0 ahead/0 behind antes desta entrega.
- Varredura por padrões comuns de chaves privadas/tokens no histórico não encontrou ocorrências; isso não é garantia criptográfica absoluta.

A TI deve transferir/espelhar para organização, decidir a visibilidade, aplicar proteção e revisar colaboradores, Apps instalados, audit log e políticas após a transferência.

## 5. Vercel

Existe `.vercel/project.json` ignorado com nome de projeto `mangabeira-na-escuta` e IDs de projeto/organização, sem prova do Team, Git integration, branch, domínio, variáveis, deployments ou logs. `.env.local` contém apenas o nome `VERCEL_OIDC_TOKEN`; seu valor não foi exibido e não será versionado. A CLI não estava instalada. Os dois cenários operacionais — transferir ou recriar — estão no manual.

## 6. Google Apps Script

O endpoint público está hardcoded no `fetch`. `apps-script/Code.gs` contém `doGet`, `doPost`, configuração, validações, setup da planilha, dashboard, Drive, protocolo e MailApp; `Index.html` e `Dashboard.html` completam o projeto. A cópia anterior está em `legacy/`. O manifesto é mínimo e o `scriptId`, executor, deployment, scopes efetivos, triggers e logs devem ser confirmados via conta institucional. A principal pendência agora é comprovar paridade com a versão implantada.

## 7. Sheets/banco

O código cria cinco abas: `01_COLETA` (22 colunas), `02_ACOMPANHAMENTO` (33), `03_DASHBOARD`, `04_APRESENTAÇÃO` e `99_LISTAS`, com fórmulas e validações. O mapa detalha suas finalidades. O estado e as permissões da planilha real ainda precisam ser comparados.

## 8. Drive/storage

Um arquivo opcional é convertido para Base64. O backend valida MIME declarado/tamanho decodificado, cria o arquivo na pasta `Canal de Escuta - Anexos (Formulario)` e grava a URL na coleta. A pasta é localizada apenas por nome, o que pode selecionar a pasta errada se houver duplicatas. ACLs e conteúdo real não foram consultados; nenhum anexo real está no Git.

## 9. Formulário

Cinco etapas: tipo; identificação/anonimato; detalhes; anexo; revisão. Tipos e cópias ficam nos cartões `#tipoGrid` e `TIPO_COPY`; condicionais em `applyTipoCopy`; validações nos handlers `toStep3`, `toStep4` e `fileInput`; payload e protocolo no submit/`send`; resumo em `renderSummary`; comprovante em `buildComprovanteHtml`. O mapeamento campo a campo consta no mapa de dados e no documento jurídico.

Validações são somente client-side no código auditável. O `accept` limita o seletor, não comprova MIME/conteúdo. O tamanho máximo é 8 MiB no navegador; Base64 aumenta o corpo. Não há validação visível de backend.

## 10. E-mail

Nenhuma API key foi localizada. `sendCanalEmail_()` usa `MailApp.sendEmail`, destinatário `canaldeescuta@mangabeirashopping.com.br`, corpo texto e anexo opcional. O remetente efetivo é a conta executora; aliases, quotas e logs devem ser confirmados no Workspace. A TI possui acesso informado ao e-mail/Gmail.

## 11. WhatsApp

Não há link `wa.me`, API, token, webhook ou fornecedor no texto do código. O WhatsApp `+55 83 99306-9348` aparece rasterizado na arte e é usado para divulgação; a TI possui acesso informado. Foram versionados PNG/JPEG atuais, imagens históricas, avatar e o PSD institucional encontrado; a correspondência exata do PSD com a arte vertical deve ser confirmada por Marketing.

## 12. Domínio/DNS

Comprovado apenas o GitHub Pages `https://gersonfarias777.github.io/mangabeira-na-escuta/`, sem CNAME customizado e com HTTPS forçado. Não há domínio institucional, registrador, DNS ou registros comprovados. A tabela de campos a preencher está no manual. Desligar Pages antes de validar Vercel/domínio pode interromper o canal.

## 13. Variáveis e secrets

Não há variáveis consumidas pelo frontend. `VERCEL_OIDC_TOKEN` é local e sensível; permanece ignorado. O endpoint Apps Script é um identificador público necessário ao cliente, não segredo, mas deve ser configurável em evolução futura. Nenhuma credencial real foi adicionada.

## 14. Dependências locais

Não há dependência de pacote, symlink, submódulo, certificado, chave ou banco local. `.vercel/` é recriável; `.env.local` é credencial a recriar. As fontes do backend, assets, PSD, preview e instruções locais foram incorporados. Não resta dependência técnica essencial exclusiva deste computador.

## 15. Segurança

Riscos prioritários:

1. **Falso sucesso crítico:** `mode: no-cors` produz resposta opaca e o `.then` mostra “Manifestação recebida” sem confirmar escrita no backend.
2. **Protocolo no cliente:** `Math.random`, sem confirmação/unicidade server-side; o PDF contradiz esse fato.
3. **Endpoint público sem proteção visível:** CAPTCHA, rate limit, autenticação administrativa, validação server-side e antifraude não são auditáveis.
4. **Anexos:** confiança em tamanho/MIME/nome fornecidos pelo cliente; ausência de antivírus e ACL comprovados.
5. **Planilha:** campos livres podem iniciar fórmulas; sanitização contra formula injection não comprovada.
6. **LGPD:** não há aviso/política visível, retenção, canal do titular, base legal formalizada ou minimização validada; denúncias podem conter dados sensíveis de terceiros.
7. **Operação:** fonte recuperada ainda sem teste de paridade remota, monitoração ou restauração comprovada.
9. **Pasta por nome:** `getFoldersByName()` pode escolher a primeira pasta homônima; preferir ID em Script Properties após migração controlada.
8. **XSS local no resumo:** `renderSummary` concatena valores digitados em `innerHTML` sem escape; a mesma sessão pode executar markup inserido pelo usuário. O comprovante usa escape para valores, mas o resumo não.

Nenhuma correção de comportamento foi feita silenciosamente. Recomenda-se corrigir em branch de teste, com backend versionado e resposta CORS/JSON verificável, após aprovação funcional/Jurídico.

## 16. Matriz de propriedade

Está em `MATRIZ_PROPRIEDADE.md`; quase todos os ativos externos ainda carecem de dono nominal e evidência de acesso institucional.

## 17. Pendências

- Comparar `apps-script/` com o Apps Script remoto implantado e reconciliar manifesto.
- Auditar planilha, Drive, e-mail, triggers, quotas e logs.
- Confirmar/recriar Vercel e domínio/DNS; registrar metadados institucionais do WhatsApp.
- Confirmar com Marketing a matriz gráfica correta e entregar o POP-01 ou registrar sua localização institucional.
- Corrigir/testar riscos de falso sucesso, protocolo, XSS, anexos, abuso e formula injection.
- Formalizar LGPD, retenção, backups, resposta a incidentes e acesso mínimo.
- Executar e assinar o roteiro em computador limpo.

## 18. Nota de transferibilidade

**80%**. Frontend, backend recuperado, schema criado por código, dashboards, e-mail e anexos estão versionados/documentados; a TI tem acesso informado ao Gmail/e-mail e WhatsApp. Faltam comprovação de paridade com o Apps Script implantado, inventário dos IDs/ACLs reais, Vercel/domínio/DNS e teste completo de restauração.

## 19. Resultado final

**Se a transferência fosse realizada hoje, a TI teria controle técnico, administrativo e operacional integral do Mangabeira na Escuta? PARCIALMENTE.**

A TI consegue compreender e modificar frontend, backend, schema, dashboard, anexos e notificação por e-mail usando o Git. O controle integral ainda depende de comparar a implantação real, registrar IDs/ACLs e concluir o roteiro em máquina limpa. Nenhum código técnico essencial precisa permanecer neste computador.
