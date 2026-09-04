# Checklist de entrega institucional

Legenda: `[x]` verificado nesta auditoria; `[ ]` exige ação/aceite da TI.

## Git e código

- [x] Frontend e asset usado em runtime presentes.
- [x] README e pacote de transferência presentes.
- [x] `.env.local`, `.vercel/` e `.clasp.json` real ignorados.
- [x] Branch local inicialmente sincronizada com `origin/gh-pages`.
- [x] GitHub Pages inicialmente idêntico ao `index.html` local.
- [x] Varredura por padrões comuns de secrets no histórico sem achados.
- [ ] Código `.gs` real exportado, revisado e versionado.
- [ ] Arquivo editável original da arte entregue ou dispensa formal registrada.
- [ ] POP-01 citado no produto entregue ao repositório apropriado ou link institucional documentado.

## Administração externa

- [ ] Repositório sob organização/controle institucional; visibilidade definida pela TI.
- [ ] Proteção/ruleset, revisão e MFA configurados.
- [ ] Team Vercel, projeto, integração GitHub, branch e rollback testados.
- [ ] Apps Script, Sheets, Drive e e-mail com proprietário/grupos institucionais.
- [ ] WhatsApp/Meta e domínio/DNS inventariados e acessíveis.
- [ ] Cofre contém os acessos; nenhum secret no Git.

## Dados, segurança e operação

- [ ] Schema real de abas/colunas/fórmulas/validações documentado.
- [ ] Validação backend e resposta de sucesso confiável implementadas/testadas.
- [ ] CAPTCHA/rate limit e monitoração avaliados.
- [ ] Política de privacidade/LGPD, base legal, retenção e direitos validados por Jurídico/DPO.
- [ ] ACL de anexos e dados sensíveis revisada por menor privilégio.
- [ ] Backup e restauração completos testados.
- [ ] Roteiro `VALIDACAO_RECEBIMENTO_TI.md` concluído e assinado.

## Termo de aceite

Responsável TI: ____________________  Data: __________

Responsável funcional: ______________  Data: __________

Resultado: [ ] Aceito  [ ] Aceito com pendências  [ ] Rejeitado

Pendências e prazos: ____________________________________________________
