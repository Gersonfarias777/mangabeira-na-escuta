# Manual de continuidade

## Se o desenvolvedor anterior não estiver disponível amanhã

A TI consegue manter e publicar frontend e backend a partir deste repositório. O acesso ao Gmail/e-mail institucional e ao WhatsApp foi confirmado. Antes de operar produção, deve comparar o Apps Script remoto com a fonte recuperada e registrar planilha, pasta, implantação e permissões reais.

## 1. Clonar e executar

```bash
git clone https://github.com/Gersonfarias777/mangabeira-na-escuta.git
cd mangabeira-na-escuta
git switch gh-pages
python3 -m http.server 8080
```

Abra `http://localhost:8080`. Não há instalação/build. Para um teste que não escreva em produção, bloqueie a requisição ao `script.google.com` no DevTools ou use uma cópia de teste do endpoint.

## 2. Alterar o formulário

Existe uma única cópia executável: `index.html`.

| Alteração | Local lógico |
| --- | --- |
| Tipos Elogio/Sugestão/Crítica/Denúncia | cartões em `#tipoGrid` e chaves de `TIPO_COPY` |
| Textos específicos | objeto `TIPO_COPY` e markup das etapas |
| Identificação/anonimato | `state.identificado`, `.toggle-row`, `#identFields`, listener de `toStep3` |
| Campos e limites | inputs/selects/textarea e handlers `toStep3`/`toStep4` |
| Condicionais de Denúncia | `applyTipoCopy`, campos `categoria`, `envolvidos`, `recorrencia`, `testemunhas` |
| Urgência/retorno/testemunhas | `state` e chamadas `wireToggle` |
| Anexo | `#fileInput`, atributo `accept`, listener `change`, `FileReader` |
| Payload/backend | objeto `payload`, função interna `send`, URL do `fetch` |
| Protocolo | função `send`; hoje gerado no cliente |
| Revisão | `renderSummary` |
| Sucesso/comprovante | bloco `data-step="done"`, `buildComprovanteHtml`, `btnDownload` |

Ao adicionar/remover campo, mantenha sincronizados: markup, estado, validação, resumo, `payload`, comprovante, contrato do Apps Script, cabeçalhos da planilha, e-mail e documentação. Há ainda três representações do levantamento jurídico (`.md`, `.html`, `.pdf`); regenere-as juntas se o conteúdo for atualizado.

## 3. Google Apps Script, Sheets, Drive e e-mail

1. Acesse o projeto com conta institucional e habilite MFA.
2. Copie `apps-script/.clasp.json.example` para `apps-script/.clasp.json`, preencha o `scriptId` pelo cofre e instale/autentique o clasp conforme padrão da TI.
3. Execute `clasp pull` em uma branch/diretório de conferência; compare `Code.gs`, `Index.html`, `Dashboard.html` e manifesto com `apps-script/`. Não sobrescreva a fonte sem revisar divergências.
4. Identifique `doGet`, `doPost`, validações server-side, criação de protocolo, escrita no Sheets, criação de arquivo no Drive, `MailApp`/`GmailApp`, templates, locks e tratamento de erro.
5. Mantenha IDs de planilha/pasta e endereços configuráveis em Script Properties quando apropriado. Entregue valores pelo cofre.
6. Faça uma implantação Web App de teste, registre versão, executor e quem tem acesso. Atualize o frontend de teste para a nova URL.
7. Só após aceite, crie nova versão de produção e atualize o endpoint do frontend em mudança revisada.

Para trocar o fornecedor, implemente um endpoint HTTPS que aceite o contrato de `MAPA_DADOS.md`, valide server-side e retorne resposta verificável. Antes disso, remova `no-cors` do frontend e passe a exigir resposta estruturada de sucesso.

## 4. Publicar frontend

### GitHub Pages atual

O Pages usa a raiz da branch `gh-pages`. Merge/push nessa branch publica automaticamente. Preserve-o durante a migração até validar domínio e HTTPS na Vercel.

### Vercel — cenário A: transferir

1. No painel, confirmar projeto, Team, GitHub repo, branch de produção, domínios, variáveis e histórico.
2. Transferir pelo processo administrativo da Vercel para o Team institucional.
3. Instalar/autorizar a integração GitHub para o repositório (especialmente se privado).
4. Em máquina limpa: autenticar como TI, executar `vercel link`, conferir Team/projeto e criar preview.

### Vercel — cenário B: recriar

1. Importar o repositório privado no Team institucional.
2. Framework preset: `Other`; root: raiz; sem build command; output: raiz.
3. Definir `gh-pages` como branch de produção se essa convenção for mantida.
4. Criar preview, testar sem escrever em produção, então adicionar o domínio institucional.

Não versionar `.vercel/`. Para rollback, use o painel ou `vercel rollback <deployment-url>`; no GitHub Pages, reverta o commit com `git revert`, revise e envie.

## 5. Domínio e DNS

Nenhum domínio institucional/registrador/provedor DNS foi comprovado. Não invente registros.

| Tipo | Host | Destino | Serviço |
| --- | --- | --- | --- |
| A preencher | A preencher | Valor fornecido pela Vercel após adicionar o domínio | Vercel/DNS institucional |

No dia da mudança: adicionar domínio na Vercel, copiar exatamente os registros apresentados, aplicar no provedor autorizado, validar resolução e certificado, testar HTTP→HTTPS e somente depois desativar o Pages/URL anterior. Registrar responsável, TTL, janela e plano de retorno.

## 6. WhatsApp

Não há `wa.me`, SDK, webhook, Twilio, Evolution ou token no código textual. O WhatsApp é divulgação do link. O número público `+55 83 99306-9348` está rasterizado na arte. Os PNG/JPEG atuais, materiais históricos, avatar e um PSD institucional estão em `assets/`; confirme com Marketing a matriz correta. Para alterar: editar a matriz, atualizar a imagem nas duas versões do formulário, atualizar os canais oficiais, validar conta Business/Meta e guardar PIN/MFA no cofre.

## 7. Diagnóstico e incidentes

- Frontend: Console/Network do navegador, status do Pages/Vercel e comparação do SHA do arquivo.
- Apps Script: Executions, Cloud Logging, versão/deployment e quotas.
- Sheets/Drive: permissões, capacidade, IDs, linha por protocolo e ACL do anexo.
- E-mail: logs do Apps Script/Admin, spam, aliases e quotas.
- Falha de envio: interromper alegação de sucesso, preservar logs sem conteúdo sensível e publicar aviso aprovado.
- Suspeita de acesso indevido: limitar acesso, preservar evidências, acionar TI/DPO/Jurídico, avaliar titulares/ANPD e rotacionar credenciais pelo processo interno.

## 8. Backup e restauração

Use exportações datadas e criptografadas, com acesso mínimo. Teste trimestralmente em ambiente isolado: clone Git, `clasp pull`, export da planilha e anexos, restauração numa cópia, implantação de teste e amostras sintéticas. Registre RPO/RTO, retenção, custodiante e resultado; backup não testado não conta como restauração comprovada.
