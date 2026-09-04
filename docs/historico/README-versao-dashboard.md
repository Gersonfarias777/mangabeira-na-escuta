# Mangabeira na Escuta — Canal de Escuta / Ouvidoria

Portal do Canal de Escuta do Mangabeira Shopping, seguindo o mesmo padrão dos
demais módulos (Google Apps Script: sem hospedagem, grava direto em planilha,
gratuito). Implementa o **POP-01 — Ouvidoria e Canal de Escuta**.

- Tipos de manifestação: Elogio, Sugestão, Crítica, Denúncia.
- Envio identificado ou 100% anônimo.
- Protocolo gerado automaticamente: prefixo `ME-<ano>-`.
- Anexo opcional (PDF, JPG, PNG, até 8 MB).
- Comprovante de envio para download **em PDF**, gerado logo após o envio.
- E-mail automático para `canaldeescuta@mangabeirashopping.com.br` a cada envio.
- Registro na planilha **MANGABEIRA NA ESCUTA**, com coleta, acompanhamento,
  listas controladas e dashboard criados automaticamente.

## Estrutura

- `apps-script/Code.gs` — backend (Google Apps Script): grava na planilha,
  sobe anexo pro Drive, gera protocolo, envia e-mail.
- `apps-script/Index.html` — formulário em wizard (5 etapas) com a identidade
  visual do Mangabeira Shopping.
- `preview/preview-canal-escuta.html` — versão para abrir direto no navegador
  e conferir o visual, sem gravar nada de verdade (backend simulado).
- `assets/` — pasta reservada para as duas artes ("Sua voz importa" e
  "Precisa Falar?"). Ver seção **Imagens** abaixo.

## Como publicar (Google Apps Script)

1. Crie uma **planilha nova** no Google Sheets (ex: "Canal de Escuta —
   Respostas").
2. Na planilha, vá em **Extensões → Apps Script**.
3. Apague o conteúdo padrão de `Código.gs` e cole o conteúdo de
   `apps-script/Code.gs`.
4. Crie um arquivo HTML chamado exatamente `Index` (menu **+ → HTML**) e cole
   o conteúdo de `apps-script/Index.html`.
5. Rode a função `authorizeCanalEscuta` uma vez (seletor de funções no topo →
   `authorizeCanalEscuta` → ▶) e aceite as permissões solicitadas.
6. Isso renomeia a planilha para **MANGABEIRA NA ESCUTA** e cria automaticamente:
   - **01_COLETA** — respostas originais do formulário (não editar);
   - **02_ACOMPANHAMENTO** — investigação, análise de risco e plano de ação;
   - **03_DASHBOARD** — indicadores por status, tipo, prazo e criticidade;
   - **99_LISTAS** — opções controladas para os campos de acompanhamento;
   - a pasta **Canal de Escuta - Anexos (Formulario)** no Google Drive.
7. Compartilhe essa pasta do Drive e a planilha somente com quem for tratar as
   manifestações (Ouvidoria/RH), conforme o item 7 (Confidencialidade) do
   POP-01.
8. **Implantar → Nova implantação** → tipo **App da Web** → executar como
   **Eu** → acesso **Qualquer pessoa** (ou restrito ao domínio, se preferir).
9. Copie a URL do Web App gerada — esse é o link que os colaboradores vão
   acessar (pode virar um botão no WhatsApp/e-mail interno, ou um QR code para
   cartazes no shopping).
10. Sempre que editar o código depois: **Implantar → Gerenciar implantações →
    editar → Nova versão → Implantar**, ou a URL publicada não atualiza.

> Diferente dos outros módulos, este não usa uma planilha/ID fixo no código —
> ele grava sempre na planilha onde o script está vinculado. Isso significa
> que você pode simplesmente criar a planilha do zero, sem precisar me
> informar nenhum ID.

## Imagem (arte oficial unificada)

O topo do formulário usa a arte oficial, agora preservada em `assets/`, que já traz o segurança e a bombeira civil
lado a lado com um único texto de marca ("Mangabeira na escuta", "Sua voz
importa", frase de confidencialidade e contatos) — sem precisar montar nada
por CSS, é a arte pronta e oficial do canal.

- `assets/hero-unificada.png` — arquivo original (2,1 MB).
- `assets/hero-unificada-opt.jpg` — versão redimensionada (900px, JPEG
  qualidade 65, ~125 KB) embutida como base64 no `Index.html`, para não
  inflar demais o HTML do Apps Script.

Os arquivos das artes anteriores (`hero-seguranca*.jpg`, `hero-bombeira*.jpg`,
`logo-avatar.png`) continuam em `assets/` como histórico, mas não são mais
usados no HTML.

## Comprovante em PDF

Ao concluir o envio, o botão **"Baixar comprovante"** gera um PDF (protocolo,
tipo, modo de envio, dados preenchidos e descrição) e baixa direto no
navegador do colaborador. A conversão HTML → PDF é feita no backend
(`gerarComprovantePdf` em `Code.gs`, usando `Blob.getAs(MimeType.PDF)`), então
só funciona de verdade **depois de publicado como Web App**.

No `preview/preview-canal-escuta.html` (sem backend), o mesmo botão abre a
janela de impressão do navegador como alternativa — dá pra escolher "Salvar
como PDF" ali também, só que sem o protocolo real.

## Textos por tipo de manifestação

A etapa 3 (detalhes) muda de título, subtítulo e placeholders conforme o tipo
escolhido na etapa 1 — elogio, sugestão e crítica têm linguagem própria, mais
leve, enquanto denúncia usa um tom mais formal e orientado à apuração.

## Campos extras para Denúncia

Quando o tipo é **Denúncia**, aparecem campos adicionais alinhados ao que um
canal de denúncias/compliance normalmente pede, e ao escopo da **NR-1**
(Gerenciamento de Riscos Ocupacionais, incluindo riscos psicossociais como
assédio e violência no trabalho):

- **Categoria da denúncia** (obrigatório): assédio moral, assédio sexual,
  discriminação, riscos psicossociais/saúde mental (NR-1), segurança do
  trabalho, corrupção/fraude, conflito de interesses, descumprimento de
  normas internas, ou outro.
- **Pessoas envolvidas** (opcional).
- **Há testemunhas?** (sim/não).
- **Quem pode testemunhar** (nome, cargo ou forma de localização, quando souber).
- **Em que contexto ocorreu** (atividade, situação ou relação de trabalho).
- **Há recorrência** (não, uma vez, algumas vezes ou frequentemente).
- Aviso fixo citando a base legal: NR-1, CLT e Lei nº 14.457/2022 (Comitês de
  Prevenção ao Assédio), reforçando que não há retaliação para denúncias de
  boa-fé.

Esses campos aparecem no formulário, na planilha (`01_COLETA`), no e-mail
enviado à Ouvidoria e no comprovante para download.

## Fluxo de acompanhamento

Cada envio também abre uma linha em **02_ACOMPANHAMENTO**, ligada pelo protocolo.
Essa aba inclui responsável pela investigação, procedimentos, evidências,
análise técnica, fatores organizacionais/relacionais/de gestão, probabilidade,
severidade, nível de risco calculado, impactos à saúde, medidas de controle,
prazo, indicadores, revisão do PGR, documento digitalizado, conclusão e retorno.

Os campos **NÍVEL DE RISCO**, **DIAS EM ABERTO** e **PRAZO** são calculados por
fórmula. As opções de status, prioridade, probabilidade, severidade e revisão
do PGR possuem validação para manter o dashboard consistente.

> Para preservar o sigilo, limite o compartilhamento de `01_COLETA` e da pasta
> de anexos à equipe formalmente autorizada. O dashboard deve trabalhar apenas
> com dados agregados e protocolo, nunca com nome ou contato do manifestante.

## Regras do POP-01 embutidas no fluxo

- Aviso de confidencialidade e de proibição de retaliação na etapa de forma
  de envio (identificado/anônimo).
- Campo de urgência e de "deseja retorno", coerente com os prazos do POP
  (confirmação em até 48h, resposta final em até 15 dias úteis) — texto
  exibido na tela de sucesso e no e-mail enviado à Ouvidoria.
- Protocolo único por manifestação, inclusive nas anônimas.
- Retorno só é exigido ter contato se o colaborador pedir explicitamente
  retorno E tiver escolhido se identificar.

## Próximos passos possíveis

- Divulgar o link do Web App (cartaz com QR code, grupo interno, intranet).
- Rodar `/security-review` neste módulo antes de publicar em produção, dado
  que trata denúncias sensíveis.
- Se quiser evoluir para um painel de acompanhamento (status da apuração,
  indicadores do item 10 do POP), dá pra construir depois em cima da mesma
  planilha, sem precisar migrar de stack.
