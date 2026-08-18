# Documentação de produto do Agesto

Esta pasta passa a ser a fonte versionada da documentação de produto e arquitetura. As cópias externas e `MicroERP.Doc/` são legadas e não devem orientar novas implementações.

## Documentos

| Documento | Função | Estado inicial |
|---|---|---|
| `OVERVIEW.md` | visão do produto e estado geral | importado; revisão necessária |
| `REQUIREMENTS.md` | comportamento esperado do sistema | **em auditoria** após reconstrução anterior |
| `DESIGN.md` | arquitetura, integrações e experiência | importado; revisão necessária |
| `DECISIONS.md` | histórico de decisões e justificativas | fonte histórica; validar status de implementação |
| `TASKS.md` | roadmap e pendências | importado; contém status antigos a reconciliar |

## Estados permitidos

- **Implementado:** comprovado por código e testes no repositório.
- **Decidido:** aprovado por Davi, ainda que não implementado.
- **Proposto:** hipótese ou alternativa aguardando decisão.
- **Obsoleto:** preservado apenas por contexto histórico.

Documentação não transforma uma proposta em requisito. Em caso de divergência, registrar a evidência encontrada no código ou Git e pedir a decisão de produto necessária.

## Processo de atualização

1. Trabalhar por patch pequeno no mesmo pull request da mudança.
2. Citar a task/KAN e, quando útil, o commit que comprova a implementação.
3. Revisar o diff completo; nunca substituir um documento inteiro para reconstruí-lo.
4. Atualizar `TASKS.md` somente depois de verificar código e testes.
5. Manter documentos legados até a auditoria terminar; a exclusão será uma tarefa separada.
