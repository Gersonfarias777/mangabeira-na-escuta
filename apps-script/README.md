# Google Apps Script

Este diretório contém o backend local recuperado durante a auditoria.

## Fonte principal

- `Code.gs`: endpoint `doPost`, formulário Apps Script, criação/organização da planilha, dashboard, anexos, protocolo e e-mail.
- `Index.html`: versão do formulário servida diretamente pelo Apps Script (`?view=form`).
- `Dashboard.html`: painel restrito ao destinatário configurado ou ao domínio `@mangabeirashopping.com.br`.
- `appsscript.json`: manifesto mínimo V8; comparar com o manifesto do projeto institucional antes de implantar.

## Versão legada

`legacy/` preserva a cópia local anterior, menor e sem `doPost`/dashboard completo. Não implante essa pasta. Ela existe para auditoria, comparação e recuperação histórica.

## Configuração atual

`CANAL_CONFIG` define nomes de abas, pasta, destinatário, limite/MIME e prefixo de protocolo. O projeto é container-bound: usa `SpreadsheetApp.getActiveSpreadsheet()`, portanto não contém ID de planilha. A pasta é localizada/criada por nome. O e-mail institucional não é senha nem token, mas alterações devem ser aprovadas e testadas.

## Primeiro recebimento pela TI

1. Abra o projeto Apps Script da planilha institucional e compare cada arquivo com este diretório.
2. Registre divergências e identifique qual versão está implantada no endpoint público.
3. Copie `apps-script/.clasp.json.example` para `.clasp.json`, preencha o `scriptId` fora do Git e faça `clasp pull` em branch de conferência.
4. Não execute `setupMangabeiraNaEscuta()` na planilha de produção durante a comparação: a função renomeia/estrutura abas e repara fórmulas.
5. Após revisão, mantenha este diretório como fonte de verdade e publique versões numeradas via clasp/painel institucional.

## Implantação Web App

O frontend público chama `doPost`. Configure a implantação de acordo com a política da empresa, registrando conta executora, audiência, deployment ID e versão no inventário seguro. O dashboard deve exigir usuário Google institucional; valide `Session.getActiveUser().getEmail()` no modelo de implantação escolhido.
