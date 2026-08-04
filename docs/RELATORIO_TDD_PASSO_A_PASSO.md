# Relatorio TDD - Passo a Passo

## Objetivo
Este relatorio explica, de forma direta, como o ciclo de TDD foi aplicado no projeto `micro-erp-auto` para testes de `ClienteService` e `AuthService`.

## O que foi criado
- Projeto de testes `MicroERP.Tests`.
- Testes com `xUnit`.
- Mocks com `Moq` para dependencias de repositorio.
- Uso de `EF Core InMemory` para cenarios de autenticacao sem banco real ativo.

## Estrutura principal
- `MicroERP.Tests/Services/ClienteServiceTests.cs`
- `MicroERP.Tests/Services/AuthServiceTests.cs`
- `MicroERP.Tests/MicroERP.Tests.csproj`

## Passo a passo do ciclo TDD usado
1. Escolher um comportamento especifico ja existente no sistema.
2. Escrever o teste primeiro, descrevendo o resultado esperado.
3. Rodar os testes e confirmar falha inicial quando aplicavel (fase RED).
4. Ajustar apenas o necessario no codigo de suporte de teste (fase GREEN).
5. Refatorar os testes para manter clareza e reutilizacao (fase REFACTOR).
6. Rodar toda a suite novamente para garantir estabilidade.

## Exemplos aplicados
### ClienteService
- `CreateAsync`:
  - deve falhar com excecao quando CPF ja existe.
  - deve criar cliente com CPF normalizado quando CPF e novo.
- `UpdateAsync`:
  - retorna `null` quando cliente nao existe.
  - lanca excecao quando CPF novo ja pertence a outro cliente.
  - atualiza e persiste quando CPF esta disponivel.
- `DeleteAsync`:
  - retorna `true` e marca exclusao logica quando cliente existe.
  - retorna `false` quando cliente nao e encontrado.

### AuthService
- `RegisterAsync`:
  - deve falhar quando email ja existe.
  - deve persistir usuario com senha em hash.
- `LoginAsync`:
  - retorna token quando credenciais estao corretas.
  - retorna `null` quando senha esta incorreta.

## Resultado obtido
- Suite de testes executada com sucesso.
- Total atual validado: **11 testes aprovados**.
- Regras principais da API preservadas para este ciclo.

## Como executar
Na raiz do repositorio:

```bash
dotnet test MicroERP.sln
```

## Beneficios praticos
- Menor risco de regressao ao alterar codigo.
- Confirmacao rapida de comportamento esperado.
- Base mais segura para evolucao de funcionalidades.

## Proximo uso recomendado
Para cada mudanca futura:
1. escrever o teste primeiro,
2. executar,
3. implementar o minimo,
4. validar tudo novamente.

Esse fluxo mantem previsibilidade e reduz erros em producao.
