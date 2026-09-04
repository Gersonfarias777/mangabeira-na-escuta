# Relatório de transferência institucional

Data da auditoria: 04/09/2026. Escopo: repositório local, Git/GitHub acessível, URL pública do GitHub Pages e metadados locais da Vercel. Não houve envio de formulário, alteração de produção, transferência de conta, DNS, dados ou revogação.

## 1. Resumo executivo

O frontend é simples e transferível: uma página estática sem dependências, build ou servidor próprio. O fluxo integral ainda não é transferível porque o backend implantado no Google Apps Script não está no Git e os ativos reais de Sheets, Drive e e-mail não foram auditados. A documentação criada torna explícitos o contrato conhecido, os riscos e o roteiro para fechar essas lacunas.

## 2. Escopo e limitações

Foram lidos arquivos textuais relevantes, histórico Git, estado ignorado/não rastreado, configurações locais e PDFs fornecidos. Consultas GitHub foram somente leitura. Não havia Vercel CLI instalada; não foi usado token local nem consultado o painel. Não havia acesso comprovado ao editor Apps Script, planilha, Drive, DNS, WhatsApp ou logs, portanto detalhes desses serviços permanecem “a confirmar”.

## 3. Arquitetura

`navegador -> index.html estático -> HTTPS POST form-urlencoded -> Web App Apps Script -> armazenamento/notificação não auditados`.

O PDF arquitetural declara Sheets como armazenamento, Drive implícito para anexos e e-mail institucional, mas não substitui evidência do backend. Também afirma que o Apps Script gera o protocolo; o código atual demonstra geração client-side. Não existe API própria, Supabase, banco SQL, autenticação ou dashboard no repositório.

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

O endpoint público está hardcoded no `fetch` do frontend. Não há `.gs`, manifesto original, `doGet`, `doPost`, scopes, executor, deployment, triggers ou logs no Git. Foi criado um manifesto mínimo V8 e exemplo clasp, que não substituem a exportação real. Esta é a maior pendência bloqueante.

## 7. Sheets/banco

Sheets é declarado como banco no PDF; não foi possível verificar planilha, abas, colunas, fórmulas, validações, dashboard ou unicidade. O contrato exato enviado pelo frontend está em `MAPA_DADOS.md`. Não há evidência de Supabase ou outro banco.

## 8. Drive/storage

Um arquivo opcional é convertido integralmente para Base64 e enviado no JSON. A criação do arquivo, pasta, URL e permissões dependem do backend ausente. Não foram encontrados anexos reais no Git.

## 9. Formulário

Cinco etapas: tipo; identificação/anonimato; detalhes; anexo; revisão. Tipos e cópias ficam nos cartões `#tipoGrid` e `TIPO_COPY`; condicionais em `applyTipoCopy`; validações nos handlers `toStep3`, `toStep4` e `fileInput`; payload e protocolo no submit/`send`; resumo em `renderSummary`; comprovante em `buildComprovanteHtml`. O mapeamento campo a campo consta no mapa de dados e no documento jurídico.

Validações são somente client-side no código auditável. O `accept` limita o seletor, não comprova MIME/conteúdo. O tamanho máximo é 8 MiB no navegador; Base64 aumenta o corpo. Não há validação visível de backend.

## 10. E-mail

Nenhuma API key ou código de e-mail foi localizado. O PDF cita `canaldeescuta@mangabeirashopping.com.br`, mas remetente/destinatário, `MailApp`/`GmailApp`, template, anexos, logs e quotas só podem ser confirmados no `.gs` e Workspace.

## 11. WhatsApp

Não há link `wa.me`, API, token, webhook ou fornecedor no texto do código. O PDF descreve apenas compartilhamento do link. A arte é JPEG Base64 e pode conter texto rasterizado; não há editável original.

## 12. Domínio/DNS

Comprovado apenas o GitHub Pages `https://gersonfarias777.github.io/mangabeira-na-escuta/`, sem CNAME customizado e com HTTPS forçado. Não há domínio institucional, registrador, DNS ou registros comprovados. A tabela de campos a preencher está no manual. Desligar Pages antes de validar Vercel/domínio pode interromper o canal.

## 13. Variáveis e secrets

Não há variáveis consumidas pelo frontend. `VERCEL_OIDC_TOKEN` é local e sensível; permanece ignorado. O endpoint Apps Script é um identificador público necessário ao cliente, não segredo, mas deve ser configurável em evolução futura. Nenhuma credencial real foi adicionada.

## 14. Dependências locais

Não há dependência de pacote, symlink, submódulo, certificado, chave ou banco local. `.vercel/` é recriável; `.env.local` é credencial a recriar. O backend e o editável da arte são dependências externas ausentes, não necessariamente exclusivas deste computador; precisam de entrega comprovada antes de declarar autonomia plena.

## 15. Segurança

Riscos prioritários:

1. **Falso sucesso crítico:** `mode: no-cors` produz resposta opaca e o `.then` mostra “Manifestação recebida” sem confirmar escrita no backend.
2. **Protocolo no cliente:** `Math.random`, sem confirmação/unicidade server-side; o PDF contradiz esse fato.
3. **Endpoint público sem proteção visível:** CAPTCHA, rate limit, autenticação administrativa, validação server-side e antifraude não são auditáveis.
4. **Anexos:** confiança em tamanho/MIME/nome fornecidos pelo cliente; ausência de antivírus e ACL comprovados.
5. **Planilha:** campos livres podem iniciar fórmulas; sanitização contra formula injection não comprovada.
6. **LGPD:** não há aviso/política visível, retenção, canal do titular, base legal formalizada ou minimização validada; denúncias podem conter dados sensíveis de terceiros.
7. **Operação:** sem fonte do backend, testes, monitoração, restauração ou runbook anterior.
8. **XSS local no resumo:** `renderSummary` concatena valores digitados em `innerHTML` sem escape; a mesma sessão pode executar markup inserido pelo usuário. O comprovante usa escape para valores, mas o resumo não.

Nenhuma correção de comportamento foi feita silenciosamente. Recomenda-se corrigir em branch de teste, com backend versionado e resposta CORS/JSON verificável, após aprovação funcional/Jurídico.

## 16. Matriz de propriedade

Está em `MATRIZ_PROPRIEDADE.md`; quase todos os ativos externos ainda carecem de dono nominal e evidência de acesso institucional.

## 17. Pendências

- Exportar e versionar o Apps Script real; reconciliar manifesto.
- Auditar planilha, Drive, e-mail, triggers, quotas e logs.
- Confirmar/recriar Vercel, domínio/DNS e WhatsApp.
- Entregar editável da arte e POP-01 ou registrar sua localização institucional.
- Corrigir/testar riscos de falso sucesso, protocolo, XSS, anexos, abuso e formula injection.
- Formalizar LGPD, retenção, backups, resposta a incidentes e acesso mínimo.
- Executar e assinar o roteiro em computador limpo.

## 18. Nota de transferibilidade

**55%**. O frontend e a documentação são reproduzíveis, mas o componente que recebe e persiste denúncias — junto com o mapa real dos dados e ativos administrativos — ainda não foi entregue/auditado. A nota não mede qualidade visual; mede autonomia técnica, administrativa e operacional.

## 19. Resultado final

**Se a transferência fosse realizada hoje, a TI teria controle técnico, administrativo e operacional integral do Mangabeira na Escuta? PARCIALMENTE.**

A TI controlaria o frontend e conseguiria publicá-lo. Não conseguiria, apenas com o Git, modificar/restaurar com segurança o backend, comprovar escrita e e-mail, administrar schema/anexos ou substituir integralmente os acessos externos. O aceite integral depende das pendências acima.
