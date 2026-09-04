# Mapa de dados

## Banco real

O frontend envia dados a um Web App do Google Apps Script. O PDF arquitetural afirma que Google Sheets é o armazenamento persistente, mas o código `.gs`, a planilha e seus metadados não estavam disponíveis. Assim, Sheets é a arquitetura declarada, não um schema auditado. Não há evidência de Supabase, SQL, Firebase ou outro banco no frontend ou no Git.

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

## Abas, colunas e relacionamentos

Não é possível listar nomes de abas, ordem/número de colunas, cabeçalhos, fórmulas, validações, dashboards, triggers ou URLs de anexos sem a planilha e o backend. A TI deve exportar o `.gs` e, em cópia controlada:

1. listar planilha, abas, intervalos nomeados, filtros, gráficos e proteções;
2. registrar cada cabeçalho por índice e a função que escreve a linha;
3. localizar fórmulas/validações e proteger contra formula injection (valores iniciados por `=`, `+`, `-` ou `@`);
4. confirmar que `protocol` é chave única e que a URL/ID do anexo se relaciona por protocolo;
5. documentar IDs como configuração segura, nunca dados reais no Git.

## Backup e restauração

- Código: clone/mirror Git e exportação clasp do Apps Script.
- Planilha: exportar XLSX/ODS/CSV por aba e manter cópia Google versionada/Drive conforme política.
- Drive: exportar anexos preservando mapa `protocolo -> fileId/url` e ACLs.
- Restaurar primeiro em planilha/pasta de teste, atualizar IDs na cópia do Apps Script, implantar uma URL de teste e executar o roteiro de aceite.
- Nunca usar dados ou denúncias reais em testes de restauração fora do ambiente aprovado.
