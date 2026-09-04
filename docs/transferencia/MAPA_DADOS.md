# Mapa de dados

## Banco real

O frontend envia dados a um Web App do Google Apps Script. O `apps-script/Code.gs` recuperado confirma Google Sheets como armazenamento, Google Drive para anexos e `MailApp` para notificação. O projeto é container-bound e usa `getActiveSpreadsheet()`, sem ID hardcoded. A paridade entre esta fonte e a implantação atual ainda deve ser comprovada pela TI. Não há evidência de Supabase, SQL, Firebase ou outro banco.

## Contrato enviado pelo frontend

O POST usa `application/x-www-form-urlencoded`; há uma única chave de formulário, `payload`, cujo valor é JSON:

| Campo JSON | Tipo esperado | Quando enviado | Origem/limite no frontend |
| --- | --- | --- | --- |
| `tipo` | texto | Sempre | Elogio, Sugestão, Crítica ou Denúncia |
| `identificado` | booleano | Sempre | Escolha obrigatória |
| `nome` | texto | Sempre; vazio se anônimo | Mín. 3 e máx. 150 se identificado |
| `setorFuncao` | texto | Sempre; vazio se anônimo | Máx. 150 |
| `contato` | texto | Sempre; vazio se anônimo | Máx. 150; exigido para retorno somente se identificado |
| `assunto` | texto | Sempre | Mín. 3, máx. 150 |
| `descricao` | texto | Sempre | Mín. 10, máx. 4000 |
| `contexto` | texto | Sempre | Máx. 1000 |
| `local` | texto | Sempre | Máx. 150 |
| `dataOcorrido` | texto `YYYY-MM-DD` | Sempre | Data opcional |
| `categoriaDenuncia` | texto | Sempre; vazio fora de Denúncia | Obrigatório em Denúncia; opções no HTML |
| `envolvidos` | texto | Sempre; vazio fora de Denúncia | Máx. 300 |
| `recorrencia` | texto | Sempre; vazio fora de Denúncia | Lista fechada |
| `testemunhas` | booleano | Sempre | Só significativo em Denúncia |
| `testemunhasDetalhes` | texto | Sempre; vazio fora de Denúncia | Máx. 300 |
| `urgente` | booleano | Sempre | Padrão falso |
| `desejaRetorno` | booleano | Sempre | Padrão falso |
| `protocol` | texto | Sempre | `ME-AAAA-XXXXXXXX`, gerado no cliente |
| `fileBase64` | texto Base64 | Se houver anexo | Até 8 MiB antes da codificação |
| `fileName` | texto | Se houver anexo | Nome fornecido pelo cliente |
| `fileMimeType` | texto | Se houver anexo | MIME fornecido pelo navegador |

## Abas e colunas criadas pelo código

`setupMangabeiraNaEscuta()` cria/atualiza:

- `01_COLETA` — 22 colunas: Data/Hora, Protocolo, Tipo, Modo, Nome, Setor/Função, Contato, Categoria, Assunto, Relato, Contexto, Local, Data do ocorrido, Recorrência, Envolvidos, Testemunhas, Detalhes de testemunhas, Urgente, Retorno, URL do anexo, Status inicial e limite de triagem.
- `02_ACOMPANHAMENTO` — 33 colunas operacionais, do protocolo até observações de governança; inclui status, prioridade, responsável, análises, risco, ações, conclusão, dias em aberto e prazo.
- `03_DASHBOARD` — painel gerencial com KPIs, tabelas, gráficos e lista de casos que exigem atenção.
- `04_APRESENTAÇÃO` — painel executivo formatado para apresentação.
- `99_LISTAS` — listas de status, prioridade, probabilidade, severidade, sim/não e fatores.

O protocolo liga `01_COLETA` e `02_ACOMPANHAMENTO`. A coluna 20 da coleta guarda a URL do arquivo no Drive. `appendFollowupRow_()` cria a linha de acompanhamento. Fórmulas calculam limite de triagem (2 dias úteis), nível de risco, dias em aberto e prazo de 15 dias úteis. Validações usam `99_LISTAS`.

A TI deve, em cópia controlada:

1. listar planilha, abas, intervalos nomeados, filtros, gráficos e proteções;
2. comparar cabeçalhos reais com `getCollectionHeaders_()` e `getFollowupHeaders_()`;
3. localizar fórmulas/validações e proteger contra formula injection (valores iniciados por `=`, `+`, `-` ou `@`);
4. confirmar que `protocol` é chave única e que a URL/ID do anexo se relaciona por protocolo;
5. documentar IDs como configuração segura, nunca dados reais no Git.

## Backup e restauração

- Código: clone/mirror Git e exportação clasp do Apps Script.
- Planilha: exportar XLSX/ODS/CSV por aba e manter cópia Google versionada/Drive conforme política.
- Drive: exportar anexos preservando mapa `protocolo -> fileId/url` e ACLs.
- Restaurar primeiro em planilha/pasta de teste, atualizar IDs na cópia do Apps Script, implantar uma URL de teste e executar o roteiro de aceite.
- Nunca usar dados ou denúncias reais em testes de restauração fora do ambiente aprovado.
