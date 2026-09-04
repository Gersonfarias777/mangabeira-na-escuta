# Transferência institucional

Este diretório é o ponto de entrada para a TI assumir o Mangabeira na Escuta. A auditoria foi realizada em 04/09/2026, sem alterar produção, DNS, dados, contas ou credenciais.

## Ordem recomendada

1. Leia o [relatório institucional](RELATORIO_TRANSFERENCIA_INSTITUCIONAL.md).
2. Confira o [conteúdo do repositório](CONTEUDO_REPOSITORIO.md) e o [mapa de dados](MAPA_DADOS.md).
3. Complete o [inventário de credenciais](INVENTARIO_CREDENCIAIS.md) e a [matriz de propriedade](MATRIZ_PROPRIEDADE.md).
4. Confira os [ativos externos e contatos institucionais](ATIVOS_EXTERNOS.md).
5. Siga o [manual de continuidade](MANUAL_CONTINUIDADE.md).
6. Execute a [validação de recebimento](VALIDACAO_RECEBIMENTO_TI.md).
7. Assine o [checklist de entrega](CHECKLIST_ENTREGA_INSTITUCIONAL.md).

## Estado objetivo e bloqueio atual

O frontend, seus assets incorporados, o backend local recuperado, o schema criado por código, o dashboard e a documentação estão versionados. A TI possui acesso ao Gmail/e-mail do canal e ao WhatsApp, conforme confirmação do responsável. A transferência ainda exige **aceite condicionado** porque a fonte recuperada deve ser comparada com a versão efetivamente implantada e os IDs/ACLs reais de Apps Script, Sheets e Drive devem ser registrados no inventário seguro.

Não confunda URL pública de implantação com prova de paridade. A TI deve executar `clasp pull` usando a conta institucional e comparar o projeto remoto com `apps-script/` antes do aceite.
