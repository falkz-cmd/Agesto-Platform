# Guia Simples de TDD (para leigos)

## O que e TDD
TDD significa "Desenvolvimento Guiado por Testes".

Em vez de programar primeiro e testar depois, voce faz assim:
1. escreve um teste,
2. ve esse teste falhar,
3. implementa o minimo para passar,
4. melhora o codigo com seguranca.

## Como isso ajuda
- Reduz medo de quebrar o sistema.
- Mostra rapidamente quando algo deu errado.
- Deixa o codigo mais confiavel para evoluir.

## O que foi feito neste projeto
Criamos um projeto de testes chamado `MicroERP.Tests`.

Testamos comportamentos reais de servicos, sem depender de banco ativo:
- `ClienteService`
- `AuthService`

Ferramentas usadas:
- xUnit (estrutura de testes)
- Moq (simular dependencias)
- EF Core InMemory (banco em memoria para teste unitario do Auth)

## Resultado atual
- 11 testes passando.
- Nenhuma alteracao na regra principal para esse ciclo de TDD de cobertura.

## Como rodar os testes
No terminal, na raiz do repositorio:

```bash
dotnet test MicroERP.sln
```

## Ciclo TDD na pratica (passo a passo)
1. Escolha um comportamento existente (ex.: atualizar cliente).
2. Escreva um teste antes de mexer no codigo.
3. Rode os testes e confirme que o novo teste falha.
4. Ajuste o minimo necessario no codigo.
5. Rode tudo de novo ate ficar verde.
6. Refatore mantendo testes verdes.

## Diferenca importante
- "Escrever teste depois": melhora cobertura.
- "TDD de verdade": teste vem antes da implementacao.

Os dois sao uteis, mas TDD te da mais seguranca durante a mudanca.

## Resumo final
TDD nao e sobre testar no fim.
TDD e usar teste como guia de desenvolvimento desde o inicio.
