# Validação de recebimento pela TI

Execute em computador limpo, com dados exclusivamente sintéticos e endpoint de teste. Registre executor, data, evidência e resultado de cada item.

## Repositório e frontend

- [ ] Clonar sem arquivos copiados deste computador; conferir assinatura/hash e branch padrão.
- [ ] Criar branch de teste e alterar um texto de cada modalidade.
- [ ] Servir localmente; validar desktop/mobile, navegação, voltar e revisão.
- [ ] Confirmar que nenhum secret aparece em `git status`, `git diff` ou histórico.
- [ ] Criar preview Vercel pelo acesso institucional; confirmar que o repositório privado está autorizado.
- [ ] Promover/reverter apenas em janela aprovada e demonstrar rollback.

## Backend e dados

- [ ] Abrir e editar o Apps Script com conta institucional; confirmar fonte completa e manifesto.
- [ ] Identificar deployment, versão, executor, acesso, scopes, Script Properties, triggers e logs.
- [ ] Abrir a planilha; listar abas, cabeçalhos, fórmulas, validações, proteções e dashboards.
- [ ] Abrir a pasta Drive; confirmar proprietário, ACL, retenção e ligação dos anexos por protocolo.
- [ ] Confirmar destinatário/remetente, template, anexos, quotas e logs do e-mail.
- [ ] Validar backend contra campos faltantes, tamanho/MIME real, nomes perigosos, formula injection e abuso.

## Casos funcionais sintéticos

- [ ] Manifestação anônima sem anexo: só aceitar sucesso após confirmação server-side.
- [ ] Manifestação identificada com retorno: validar contato e e-mail esperado.
- [ ] Denúncia com PDF/JPG/PNG válido: confirmar protocolo, linha, anexo e ACL.
- [ ] Arquivo inválido e maior que 8 MiB: rejeição no cliente e servidor.
- [ ] Campo/JSON adulterado via DevTools: rejeição no servidor.
- [ ] Falha/rede/HTTP 4xx/5xx: não mostrar falso sucesso.
- [ ] Protocolo duplicado: impedir/solucionar atomicamente.
- [ ] Dashboard e consulta por protocolo, se existirem no backend: validar autorização e resultado.

## Publicação e continuidade

- [ ] Conferir domínio oficial, registrador, DNS, TTL, HTTPS e renovação.
- [ ] Confirmar o número `+55 83 99306-9348`, arte e acesso institucional ao WhatsApp; registrar conta Business/Meta e MFA.
- [ ] Executar backup de Git, Script, Sheets e Drive; restaurar em ambiente de teste.
- [ ] Confirmar monitoramento, contato de incidente, RPO/RTO e retenção LGPD.
- [ ] Após aceite formal, revisar colaboradores e revogar acessos anteriores autorizados.

## Critério de aceite

Aceitar somente quando o repositório contiver o Apps Script real, o mapa de dados estiver reconciliado com a planilha, os acessos externos tiverem donos institucionais e os casos acima tiverem evidência. Até lá, registrar aceite condicionado.
