# Mangabeira na Escuta

Canal institucional estático para envio de Elogio, Sugestão, Crítica e Denúncia. O frontend está em `index.html` e envia as manifestações a um Web App do Google Apps Script.

> A documentação operacional, os riscos conhecidos, o inventário de ativos e o roteiro de aceite da TI estão em [docs/transferencia/README.md](docs/transferencia/README.md).

## Execução local rápida

Não há etapa de build nem dependências de aplicação. Sirva a raiz por HTTP:

```bash
python3 -m http.server 8080
```

Abra `http://localhost:8080`. Não envie manifestações de teste ao endpoint de produção sem autorização.

## Componentes

- `index.html`: HTML, CSS, JavaScript e imagem JPEG incorporada em Base64.
- `assets/`: arte atual em alta resolução, versão otimizada, PSD/arquivo institucional e materiais históricos.
- `preview/`: visualização offline sem gravação real.
- `apps-script/`: backend recuperado (`Code.gs`, formulário, dashboard), manifesto, histórico legado e exemplo de vínculo clasp. A TI deve compará-lo com a versão implantada na conta institucional antes de qualquer publicação.
- `docs/transferencia/`: pacote de transferência institucional.
- `docs/canal-de-escuta-validacao-juridica.*`: levantamento jurídico descritivo preexistente.
- `Arquitetura-Mangabeira-na-Escuta.pdf`: documento técnico preexistente; contém afirmações que precisam ser reconciliadas com o código atual, conforme o relatório de transferência.
- `docs/historico/`: instruções anteriores preservadas para rastreabilidade, não substituem o manual atual.
