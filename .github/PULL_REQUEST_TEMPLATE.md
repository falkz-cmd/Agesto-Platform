## Objetivo

<!-- Qual problema esta mudança resolve? Cite a KAN/task quando existir. -->

## O que mudou

-

## Impacto

- [ ] Backend/API
- [ ] Banco/migration
- [ ] Web
- [ ] Mobile/offline
- [ ] Sincronização
- [ ] Documentação

## Evidências

<!-- Testes executados, resultados e screenshots quando aplicável. -->

## Checklist

- [ ] O escopo corresponde à task aprovada.
- [ ] Não há `empresaId` ou `usuarioId` confiado pelo body.
- [ ] Queries operacionais respeitam `EmpresaId` e soft delete.
- [ ] Contratos C# e TypeScript permanecem compatíveis.
- [ ] Falhas offline/retentativas foram consideradas quando aplicável.
- [ ] Não há segredos ou configuração local no diff.
- [ ] Build, lint, typecheck e testes relevantes estão verdes.
- [ ] Migration foi revisada e não foi aplicada sem autorização.
- [ ] Documentação relevante foi atualizada por patch pequeno.

## Riscos e rollback

<!-- O que ainda não foi validado? Como desfazer a mudança com segurança? -->
