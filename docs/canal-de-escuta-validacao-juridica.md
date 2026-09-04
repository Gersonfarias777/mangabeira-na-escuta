# CANAL DE ESCUTA

## Estrutura do Formulário e Fundamentação para Validação Jurídica

**Documento descritivo da estrutura atualmente implementada**

Data do levantamento: 04/09/2026

---

## 1. Objetivo do documento

Este documento apresenta ao Departamento Jurídico a estrutura atualmente implementada no sistema "Canal de Escuta" (aplicação "Mangabeira na Escuta"), descrevendo, a partir da leitura direta do código-fonte, as perguntas, campos, opções de resposta, fluxos de identificação/anonimato e o mecanismo de protocolo hoje existentes. O propósito é permitir a apreciação e validação jurídica da estrutura vigente, sem propor alterações. Nenhum arquivo do sistema foi modificado na elaboração deste documento.

## 2. Visão geral do Canal de Escuta

O Canal de Escuta é uma aplicação web de página única (arquivo `index.html`), que apresenta um formulário em 5 etapas para o registro de manifestações. Após o envio, os dados são transmitidos a um backend externo — um Web App do Google Apps Script — cuja URL de destino está referenciada no código, mas cujo código-fonte (`.gs`) não está armazenado neste repositório e não pôde ser inspecionado nesta análise.

Fluxo geral do formulário (comum às quatro modalidades):

1. **Etapa 1 — Tipo de manifestação**: escolha entre Elogio, Sugestão, Crítica ou Denúncia.
2. **Etapa 2 — Forma de envio**: identificação (nome, setor/função, contato) ou anonimato.
3. **Etapa 3 — Detalhes**: assunto, descrição, contexto, local, data aproximada, urgência, desejo de retorno; e, exclusivamente para Denúncia, campos adicionais (categoria, pessoas envolvidas, recorrência, testemunhas).
4. **Etapa 4 — Anexo**: upload de um arquivo (PDF, JPG ou PNG, até 8 MB), opcional para todas as modalidades.
5. **Etapa 5 — Revisão**: resumo dos dados informados e declaração de veracidade, seguida do envio.

Ao final, é exibido um número de protocolo e a opção de baixar um comprovante.

## 3. Tipos de manifestação

O sistema contempla quatro modalidades, apresentadas ao usuário como cartões de seleção na Etapa 1, cada uma com um texto de apresentação:

| Modalidade | Texto de apresentação exibido ao usuário |
|---|---|
| 🌟 Elogio | "Reconheça algo positivo ou um bom atendimento." |
| 💡 Sugestão | "Compartilhe ideias para melhorar processos." |
| ⚠️ Crítica | "Aponte situações que precisam ser revistas." |
| 🔒 Denúncia | "Relate situações inadequadas com sigilo." |

A seleção de uma modalidade é obrigatória para prosseguir.

---

## 4. Formulário de Elogio

**Título da etapa de detalhes:** "Conte o que foi bom"
**Subtítulo:** "Queremos saber o que fizemos certo — isso ajuda a reconhecer boas práticas e replicar em outras áreas."

| Pergunta | Tipo de resposta | Opções disponíveis | Obrigatória? | Observação |
|---|---|---|---|---|
| Quero me identificar / Enviar anônimo | Alternância (toggle) | "Quero me identificar"; "Enviar anônimo" | Sim (escolha obrigatória) | Comum a todas as modalidades |
| Nome completo | Texto | — | Sim, se identificado | Exibido apenas se "Quero me identificar" for escolhido |
| Setor / Função | Texto | — | Não | Exibido apenas se identificado |
| Telefone ou e-mail (opcional) | Texto | — | Condicional | Torna-se obrigatório apenas se "Deseja retorno" = Sim e usuário identificado |
| Sobre o que é o elogio? | Texto curto | — | Sim | Placeholder: "Ex: Atendimento da segurança na portaria B" |
| Conte os detalhes | Texto longo (textarea) | — | Sim | Placeholder: "O que aconteceu, quem foi envolvido e por que isso fez diferença para você?" |
| Em que contexto aconteceu? (opcional) | Texto longo | — | Não | Comum a todas as modalidades |
| Local / setor relacionado (opcional) | Texto | — | Não | Comum a todas as modalidades |
| Data aproximada do ocorrido (opcional) | Data | — | Não | Comum a todas as modalidades |
| Existe urgência? | Alternância | "Sim"; "Não" (padrão: Não) | Não (possui valor padrão) | Comum a todas as modalidades |
| Deseja retorno? | Alternância | "Sim"; "Não" (padrão: Não) | Não (possui valor padrão) | Comum a todas as modalidades |
| Anexo | Upload de arquivo | PDF, JPG, JPEG, PNG — até 8 MB | Não | Um único arquivo |
| Declaração de veracidade | Caixa de marcação (checkbox) | "Confirmo que as informações acima são verdadeiras, na medida do meu conhecimento." | Sim | Necessária para envio |

Não há campos exclusivos de categorização para Elogio.

---

## 5. Formulário de Sugestão

**Título da etapa de detalhes:** "Compartilhe sua ideia"
**Subtítulo:** "Toda sugestão é lida com atenção — conte o que poderia melhorar e, se possível, como."

| Pergunta | Tipo de resposta | Opções disponíveis | Obrigatória? | Observação |
|---|---|---|---|---|
| Quero me identificar / Enviar anônimo | Alternância | "Quero me identificar"; "Enviar anônimo" | Sim | Comum a todas as modalidades |
| Nome completo | Texto | — | Sim, se identificado | Condicional |
| Setor / Função | Texto | — | Não | Condicional |
| Telefone ou e-mail (opcional) | Texto | — | Condicional | Igual ao descrito na modalidade Elogio |
| Do que se trata a sugestão? | Texto curto | — | Sim | Placeholder: "Ex: Sinalização do estacionamento" |
| Descreva sua ideia | Texto longo | — | Sim | Placeholder: "O que você sugere mudar ou criar? Como isso ajudaria no dia a dia?" |
| Em que contexto aconteceu? (opcional) | Texto longo | — | Não | Comum a todas as modalidades |
| Local / setor relacionado (opcional) | Texto | — | Não | Comum a todas as modalidades |
| Data aproximada do ocorrido (opcional) | Data | — | Não | Comum a todas as modalidades |
| Existe urgência? | Alternância | "Sim"; "Não" (padrão: Não) | Não | Comum a todas as modalidades |
| Deseja retorno? | Alternância | "Sim"; "Não" (padrão: Não) | Não | Comum a todas as modalidades |
| Anexo | Upload de arquivo | PDF, JPG, JPEG, PNG — até 8 MB | Não | Um único arquivo |
| Declaração de veracidade | Caixa de marcação | Idêntica à do Elogio | Sim | — |

Não há campos exclusivos de categorização para Sugestão.

---

## 6. Formulário de Crítica

**Título da etapa de detalhes:** "Nos ajude a melhorar"
**Subtítulo:** "Aponte o que não está funcionando bem. Uma crítica construtiva é o primeiro passo para uma mudança."

| Pergunta | Tipo de resposta | Opções disponíveis | Obrigatória? | Observação |
|---|---|---|---|---|
| Quero me identificar / Enviar anônimo | Alternância | "Quero me identificar"; "Enviar anônimo" | Sim | Comum a todas as modalidades |
| Nome completo | Texto | — | Sim, se identificado | Condicional |
| Setor / Função | Texto | — | Não | Condicional |
| Telefone ou e-mail (opcional) | Texto | — | Condicional | Igual ao descrito na modalidade Elogio |
| Sobre o que é a crítica? | Texto curto | — | Sim | Placeholder: "Ex: Demora no atendimento da manutenção" |
| Descreva a situação | Texto longo | — | Sim | Placeholder: "O que aconteceu, onde e quando? O que você esperava que fosse diferente?" |
| Em que contexto aconteceu? (opcional) | Texto longo | — | Não | Comum a todas as modalidades |
| Local / setor relacionado (opcional) | Texto | — | Não | Comum a todas as modalidades |
| Data aproximada do ocorrido (opcional) | Data | — | Não | Comum a todas as modalidades |
| Existe urgência? | Alternância | "Sim"; "Não" (padrão: Não) | Não | Comum a todas as modalidades |
| Deseja retorno? | Alternância | "Sim"; "Não" (padrão: Não) | Não | Comum a todas as modalidades |
| Anexo | Upload de arquivo | PDF, JPG, JPEG, PNG — até 8 MB | Não | Um único arquivo |
| Declaração de veracidade | Caixa de marcação | Idêntica à do Elogio | Sim | — |

Não há campos exclusivos de categorização para Crítica.

---

## 7. Formulário de Denúncia

Esta modalidade possui, além dos campos comuns às demais, campos adicionais específicos, dado o maior grau de sensibilidade da informação tratada.

**Título da etapa de detalhes:** "Relate com detalhes"
**Subtítulo:** "Este relato é tratado com sigilo, conforme o POP-01 de Ouvidoria. Quanto mais detalhes, mais rápido conseguimos apurar."

**Aviso legal exibido exclusivamente nesta modalidade** (bloco de texto fixo na tela, sem interação do usuário):

> "Este canal segue a NR-1 (Gerenciamento de Riscos Ocupacionais, incluindo riscos psicossociais como assédio e violência no trabalho), a CLT e a Lei nº 14.457/2022 (Comitês de Prevenção ao Assédio). Denúncias de boa-fé não sofrem retaliação."

| Pergunta | Tipo de resposta | Opções disponíveis | Obrigatória? | Observação |
|---|---|---|---|---|
| Quero me identificar / Enviar anônimo | Alternância | "Quero me identificar"; "Enviar anônimo" | Sim | Comum a todas as modalidades |
| Nome completo | Texto | — | Sim, se identificado | Condicional |
| Setor / Função | Texto | — | Não | Condicional |
| Telefone ou e-mail (opcional) | Texto | — | Condicional | Igual ao descrito nas demais modalidades |
| Assunto da denúncia | Texto curto | — | Sim | Placeholder: "Ex: Assédio moral no setor de limpeza" |
| Descreva o ocorrido | Texto longo | — | Sim | Placeholder: "Descreva o que aconteceu, incluindo datas, locais e comportamentos observados." |
| **Categoria da denúncia** | Seleção única (select) | "Selecione..." (opção vazia); "Assédio moral"; "Assédio sexual"; "Discriminação (raça, gênero, orientação sexual, religião, etc.)"; "Riscos psicossociais / saúde mental (NR-1)"; "Segurança do trabalho / condições inseguras"; "Corrupção, fraude ou desvio"; "Conflito de interesses"; "Descumprimento de normas internas"; "Outro" | **Sim** — exclusiva desta modalidade | Única seleção; validação JS impede envio sem escolha |
| **Pessoas envolvidas (opcional)** | Texto | — | Não | Exclusiva desta modalidade. Hint: "Nomes, cargos ou como identificá-las. Só preencha se souber." Não há campo específico separado para "denunciado" — este único campo cobre "envolvidos" de forma genérica |
| **A situação já aconteceu outras vezes?** | Seleção única (select) | "Prefiro não informar" (padrão); "Não"; "Sim, uma vez"; "Sim, algumas vezes"; "Sim, frequentemente" | Não | Exclusiva desta modalidade |
| **Há testemunhas?** | Alternância + texto | "Sim" / "Não" (padrão: Não); campo de texto livre para detalhar nomes/cargos/localização das testemunhas | Não | Exclusiva desta modalidade; campo de texto sempre visível, não condicionado ao valor do toggle |
| Em que contexto aconteceu? (opcional) | Texto longo | — | Não | Comum a todas as modalidades |
| Local / setor relacionado (opcional) | Texto | — | Não | Comum a todas as modalidades |
| Data aproximada do ocorrido (opcional) | Data | — | Não | Comum a todas as modalidades |
| Existe urgência? | Alternância | "Sim"; "Não" (padrão: Não) | Não | Comum a todas as modalidades |
| Deseja retorno? | Alternância | "Sim"; "Não" (padrão: Não) | Não | Comum a todas as modalidades |
| Anexo / evidência | Upload de arquivo | PDF, JPG, JPEG, PNG — até 8 MB | Não | Único arquivo; opcional inclusive para Denúncia |
| Declaração de veracidade | Caixa de marcação | Idêntica às demais modalidades | Sim | — |

**Ponto para apreciação do Jurídico:** o sistema não possui um campo específico para identificação do "denunciado" separado do campo genérico "Pessoas envolvidas", tampouco distingue formalmente denunciante, denunciado e testemunha em campos estruturados distintos — todos são tratados por meio de textos livres.

---

## 8. Quadro comparativo dos formulários

| Informação solicitada | Elogio | Sugestão | Crítica | Denúncia |
|---|---|---|---|---|
| Identificação (nome, setor, contato) ou anonimato | Sim (escolha do usuário) | Sim (escolha do usuário) | Sim (escolha do usuário) | Sim (escolha do usuário) |
| Assunto (título curto) | Sim | Sim | Sim | Sim |
| Descrição (texto livre) | Sim | Sim | Sim | Sim |
| Contexto (opcional) | Sim | Sim | Sim | Sim |
| Local / setor (opcional) | Sim | Sim | Sim | Sim |
| Data aproximada (opcional) | Sim | Sim | Sim | Sim |
| Urgência | Sim | Sim | Sim | Sim |
| Desejo de retorno | Sim | Sim | Sim | Sim |
| Categoria específica (select) | Não | Não | Não | Sim (obrigatória) |
| Pessoas envolvidas | Não | Não | Não | Sim (opcional) |
| Recorrência do fato | Não | Não | Não | Sim (opcional) |
| Testemunhas | Não | Não | Não | Sim (opcional) |
| Aviso legal específico na tela | Não | Não | Não | Sim (NR-1, CLT, Lei 14.457/2022) |
| Anexo/evidência | Sim (opcional) | Sim (opcional) | Sim (opcional) | Sim (opcional) |
| Declaração de veracidade | Sim | Sim | Sim | Sim |
| Geração de protocolo | Sim | Sim | Sim | Sim |

---

## 9. Identificação, anonimato e confidencialidade

O sistema apresenta, na Etapa 2, uma escolha binária obrigatória entre "Quero me identificar" e "Enviar anônimo", aplicável de forma idêntica às quatro modalidades. Independentemente da escolha, é exibida a mensagem fixa: "Este canal é confidencial. Não há retaliação por manifestações feitas de boa-fé."

Quando o usuário opta por se identificar, são solicitados: nome completo (obrigatório), setor/função (opcional) e telefone ou e-mail (opcional, tornando-se necessário apenas se o usuário também indicar que deseja retorno).

**Ponto para apreciação do Jurídico:** não foi localizada, no código analisado, nenhuma referência textual explícita à Lei Geral de Proteção de Dados (LGPD) nem uma política de privacidade acessível a partir do formulário, informando ao titular dos dados a finalidade do tratamento, a base legal e os direitos previstos na Lei nº 13.709/2018.

## 10. Protocolo e acompanhamento

Ao final do envio, o sistema gera, no próprio navegador (lado cliente), um número de protocolo no formato `ME-<ano>-<8 caracteres alfanuméricos aleatórios>` (por exemplo, `ME-2026-A1B2C3D4`). Esse número é exibido na tela de confirmação, junto à mensagem: "Guarde este número para acompanhar sua manifestação. O recebimento foi confirmado e a manifestação seguirá o fluxo interno de análise e apuração, conforme o POP-01 de Ouvidoria. O prazo para conclusão poderá variar de acordo com a natureza e a complexidade do caso." É disponibilizado um botão para baixar um comprovante.

**Ponto para apreciação do Jurídico:** (i) o número de protocolo é gerado de forma aleatória no navegador do usuário, não havendo, no código analisado, geração sequencial nem verificação de unicidade no lado servidor; (ii) não foi localizada, na aplicação, uma funcionalidade de consulta de status por número de protocolo — o acompanhamento da manifestação após o envio depende de mecanismo externo, possivelmente administrado pela equipe responsável pelo Apps Script/planilha de backend, cujo código não está disponível neste repositório para verificação; (iii) o documento "POP-01 de Ouvidoria", citado como referência de fluxo interno, não está incluído neste repositório.

## 11. Fundamentação jurídica e normativa

Esta seção tem caráter exclusivamente informativo, reunindo o contexto normativo potencialmente relacionado à estrutura descrita, para subsídio da análise do Departamento Jurídico. Não constitui parecer jurídico nem juízo de conformidade.

**Lei nº 14.457/2022** — institui medidas para prevenção e combate ao assédio sexual e a outras formas de violência no ambiente de trabalho, alterando a CLT quanto à obrigatoriedade de canais de denúncia em determinadas hipóteses (art. 23 e incisos, quando aplicáveis ao porte e à atividade da empresa). O aviso legal exibido na etapa de Denúncia faz referência expressa a esta lei, o que constitui elemento sujeito à validação do Departamento Jurídico quanto à correção e suficiência da menção.

**Lei nº 13.709/2018 (LGPD)** — a coleta de dados pessoais no formulário (nome, setor, contato, relatos envolvendo terceiros) relaciona-se aos princípios da finalidade, adequação, necessidade, transparência, segurança, prevenção e responsabilização (art. 6º). Destaca-se especialmente o princípio da necessidade, segundo o qual a coleta deve limitar-se ao mínimo indispensável ao tratamento da manifestação — ponto que se sugere seja avaliado pelo Jurídico à luz dos campos atualmente coletados, sobretudo os campos livres de "Pessoas envolvidas" e "testemunhas" na modalidade Denúncia, que podem conter dados pessoais de terceiros não titulares da manifestação.

**Lei nº 12.846/2013 (Lei Anticorrupção)** — relaciona-se, quando pertinente ao porte e à atividade da empresa, à existência de programas de integridade e mecanismos internos de comunicação de irregularidades, dos quais um canal de denúncia pode constituir elemento. A lei não impõe, de forma automática, a toda empresa privada, a obrigatoriedade de manutenção de canal de denúncia.

**Decreto nº 11.129/2022** — regulamenta a Lei nº 12.846/2013 e estabelece parâmetros de avaliação de programas de integridade, incluindo a existência de canais para comunicação de irregularidades e mecanismos de proteção ao denunciante de boa-fé — aspecto compatível com a mensagem de "não retaliação" exibida no formulário.

**Normas internas** — o código faz referência ao documento "POP-01 de Ouvidoria/Canal de Escuta" como norteador do fluxo de apuração. Este documento não está presente no repositório analisado, não sendo possível verificar seu conteúdo ou correspondência com a estrutura atual do formulário.

## 12. Pontos para apreciação do Jurídico

- Ausência de menção expressa à LGPD e de política de privacidade vinculada ao formulário.
- Ausência de campo estruturado que distinga formalmente denunciante, denunciado e testemunha na modalidade Denúncia (atualmente tratados por texto livre em um único campo "Pessoas envolvidas").
- Geração do número de protocolo de forma aleatória no lado cliente, sem controle server-side de unicidade visível no código analisado.
- Ausência de funcionalidade de consulta de status da manifestação por número de protocolo dentro da aplicação.
- Documento "POP-01 de Ouvidoria", citado como referência normativa interna no próprio formulário, não está disponível neste repositório para conferência.
- Correção e suficiência da menção legal exibida na modalidade Denúncia (NR-1, CLT, Lei nº 14.457/2022) sujeitas à validação jurídica.

## 13. Conclusão

O presente documento tem caráter exclusivamente descritivo e apresenta a estrutura funcional atualmente implementada no Canal de Escuta. Seu objetivo é permitir que o Departamento Jurídico conheça e avalie as perguntas, opções de resposta, fluxos e mecanismos existentes, bem como sua relação com o marco normativo aplicável. Eventuais adequações somente deverão ser realizadas após apreciação e orientação formal do setor competente.

---

## Referências normativas

| Norma | Número/Ano | Artigo relevante | Fonte oficial consultada | Data da consulta |
|---|---|---|---|---|
| Lei ordinária | Lei nº 14.457/2022 | Art. 23 e incisos (medidas de prevenção ao assédio e violência no trabalho) | planalto.gov.br | 04/09/2026 |
| Lei ordinária (LGPD) | Lei nº 13.709/2018 | Art. 6º (princípios do tratamento de dados) | planalto.gov.br | 04/09/2026 |
| Lei ordinária | Lei nº 12.846/2013 | Arts. 7º, VIII (programas de integridade) | planalto.gov.br | 04/09/2026 |
| Decreto federal | Decreto nº 11.129/2022 | Art. 57 e Anexo (parâmetros de programas de integridade) | planalto.gov.br | 04/09/2026 |

---

*Documento gerado a partir da leitura do código-fonte do repositório "mangabeira-na-escuta" (arquivo `index.html`), sem qualquer alteração ao sistema, ao banco de dados ou às regras de negócio nele existentes.*
