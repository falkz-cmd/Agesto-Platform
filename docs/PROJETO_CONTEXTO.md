# 🧠 Contexto do Projeto — Micro-ERP Auto
> Documento gerado para importação em IAs (ChatGPT, Gemini, Claude, etc.)
> Contém todo o contexto técnico, decisões, arquitetura e acordos da equipe.

---

## 1. IDENTIDADE DO AGENTE (SYSTEM PROMPT)

Ao importar este documento em uma IA, use o seguinte papel:

> **Você é um Tech Lead Sênior e Mentor de Carreira.**
> Tom de voz: focado em produtividade, incentivador e levemente irônico quando necessário (estilo peer-to-peer).
> Objetivo: Transformar requisitos acadêmicos em entregas profissionais de mercado.
>
> **Regra de Ouro — Validação Cruzada:**
> Sempre que o usuário sugerir uma mudança no código, verifique:
> 1. Isso respeita as 8 entidades definidas no modelo de dados?
> 2. Isso quebra a lógica de Atendimento Híbrido?
> 3. Isso afeta a parametrização do sistema (Venda/Serviço/Híbrido)?
>
> **Estrutura de Resposta obrigatória:**
> 1. Contexto Técnico (citar fontes dos documentos)
> 2. Instrução Direta (passo a passo numerado)
> 3. Próximo Passo Acionável (encerrar com pergunta que impulsione próxima task no Jira)
>
> **Diretriz crítica:** A classe `Configuracao` é o "cérebro" do sistema.
> Ela dita o que o Frontend e o Mobile exibem. Toda decisão de UI deve ser validada contra ela.

---

## 2. SOBRE O PROJETO

### 2.1 Descrição Geral
**Nome:** Micro-ERP Auto — Sistema de Gestão para Microempreendedores
**Natureza:** Projeto acadêmico com padrão profissional de mercado
**Público-alvo:** Microempreendedores e prestadores de serviço autônomos
**Problema resolvido:** Sistemas existentes são complexos e caros para pequenos negócios
**Jira:** https://gomesdavi731.atlassian.net

### 2.2 Diferenciais Técnicos
- **Offline-First** no módulo Mobile (funciona sem internet)
- **Parametrização centralizada** via entidade `Configuracao` (Venda / Serviço / Híbrido)
- **Sincronização bidirecional** entre Mobile e servidor
- **Multi-tenant** por `usuario_id` em todas as entidades operacionais

### 2.3 Módulos do Sistema

| Módulo | Plataforma | Status |
|--------|-----------|--------|
| Gestão | Web (React) | Em desenvolvimento |
| Operacional | Mobile (React Native) | Checkpoint IV — 18/06 |
| IA/Insights | Python (FastAPI) | Opcional / Paralelo |

---

## 3. EQUIPE

| Membro | Perfil | Responsabilidade |
|--------|--------|-----------------|
| **Davi Gomes Rocha** | Tech Lead / Full Stack | Visão geral, backend C#, auxilia todos os épicos |
| **Diego Mendes Santos** | Dev Sênior | Infraestrutura, Azure, DevOps, backend C# |
| **Luan** | Dev Backend | Backend C# — entidades e regras de negócio |
| **Davi de Oliveira Bueno** | Dev Backend | Módulo Python (FastAPI) + IA/Insights |
| **Richard Gazana Batista** | Dev Part-time | Documentação, diagramas, tasks pontuais de QA |

---

## 4. STACK TECNOLÓGICA (DEFINITIVA)

| Camada | Tecnologia | Observações |
|--------|-----------|-------------|
| Frontend Web | React + TypeScript | Dashboard, CRUD, parametrização |
| Backend Core | C# — ASP.NET Core .NET 8 + Entity Framework Core | Multi-tenant, JWT Auth |
| Módulo IA/Insights | Python — FastAPI | Separado do core, endpoints independentes |
| Banco de Dados | PostgreSQL | Suporte a DECIMAL(12,2), soft delete, TIMESTAMP |
| Mobile | React Native + SQLite | Offline-first, sync bidirecional |
| Nuvem | Microsoft Azure | App Service + PostgreSQL flexível |
| Autenticação | JWT (JSON Web Token) | Middleware de contexto multi-tenant |
| ORM | Entity Framework Core | Code-first, migrations |
| Testes | xUnit + Moq + FluentAssertions | TDD obrigatório no Checkpoint III |
| Versionamento | Git + Gitflow | main → develop → feature/xxx |
| Gestão de Projeto | Jira (Kanban) | Board: A Fazer / Em Andamento / Em Análise / Concluído |

---

## 5. MODELO DE DADOS

### 5.1 DER — As 8 Entidades

```
USUARIO ──── CONFIGURACAO
    │
    ├──── CLIENTE
    │
    └──── ATENDIMENTO ──── ITEM_PRODUTO ──── PRODUTO
                      └─── ITEM_SERVICO ──── SERVICO
```

**Isolamento Multi-tenant:** Todas as entidades operacionais possuem `FK usuario_id`.

### 5.2 Entidades e Atributos (DER)

**USUARIO**
- PK id
- nome
- UK email
- senha

**CONFIGURACAO** ← ⭐ CÉREBRO DO SISTEMA
- PK id
- tipo_operacao (Venda | Serviço | Híbrido)
- FK usuario_id

**CLIENTE**
- PK id
- nome
- telefone
- UK cpf
- FK usuario_id

**ATENDIMENTO** ← ⭐ REGISTRO CENTRAL
- PK id
- data_registro
- status
- valor_total
- FK usuario_id
- FK cliente_id

**PRODUTO**
- PK id
- nome
- preco
- quantidade_estoque
- FK usuario_id

**SERVICO**
- PK id
- descricao
- valor_hora
- FK usuario_id

**ITEM_PRODUTO**
- PK id
- quantidade
- preco_unitario
- subtotal
- FK atendimento_id
- FK produto_id

**ITEM_SERVICO**
- PK id
- quantidade
- preco_unitario
- subtotal
- FK atendimento_id
- FK servico_id

### 5.3 Diagrama de Classes (Java/C# Style)

```
Classe Usuario           Classe Configuracao
- Long id                - Long id
- String nome            - String tipoOperacao
- String email           (Venda | Serviço | Híbrido)
- String senha

Classe Atendimento       Classe Cliente
- Long id                - Long id
- LocalDateTime data     - String nome
- String status          - String telefone
- BigDecimal valorTotal  - String cpf
+ calcularTotal()

Classe Produto           Classe Servico
- Long id                - Long id
- String nome            - String descricao
- BigDecimal preco       - BigDecimal valorHora
- int quantidadeEstoque

Classe ItemProduto       Classe ItemServico
- Long id                - Long id
- int quantidade         - int quantidade
- BigDecimal precUnit    - BigDecimal precUnit
- BigDecimal subtotal    - BigDecimal subtotal
```

### 5.4 Modelo Físico (PostgreSQL — Tipos SQL)

```sql
-- USUARIO
id          BIGINT PK
nome        VARCHAR(120)
email       VARCHAR(150) UNIQUE
senha       VARCHAR(255)
created_at  TIMESTAMP
updated_at  TIMESTAMP

-- CONFIGURACAO
id              BIGINT PK
tipo_operacao   VARCHAR(10)
usuario_id      BIGINT FK
created_at      TIMESTAMP
updated_at      TIMESTAMP

-- CLIENTE
id          BIGINT PK
uuid        CHAR(36) UNIQUE        -- gerado no mobile (offline-first)
nome        VARCHAR(120)
telefone    VARCHAR(20)
cpf         VARCHAR(14) UNIQUE
usuario_id  BIGINT FK
created_at  TIMESTAMP
updated_at  TIMESTAMP
synced_at   TIMESTAMP NULL         -- NULL = pendente de sync
deleted_at  TIMESTAMP NULL         -- soft delete

-- ATENDIMENTO
id          BIGINT PK
uuid        CHAR(36) UNIQUE
data_registro TIMESTAMP
status      VARCHAR(30)
valor_total DECIMAL(12,2)
usuario_id  BIGINT FK
cliente_id  BIGINT FK
created_at  TIMESTAMP
updated_at  TIMESTAMP
synced_at   TIMESTAMP NULL
deleted_at  TIMESTAMP NULL

-- PRODUTO
id                  BIGINT PK
uuid                CHAR(36) UNIQUE
nome                VARCHAR(120)
preco               DECIMAL(12,2)
quantidade_estoque  INT
usuario_id          BIGINT FK
created_at          TIMESTAMP
updated_at          TIMESTAMP
synced_at           TIMESTAMP NULL
deleted_at          TIMESTAMP NULL

-- SERVICO
id          BIGINT PK
uuid        CHAR(36) UNIQUE
descricao   VARCHAR(200)
valor_hora  DECIMAL(12,2)
usuario_id  BIGINT FK
created_at  TIMESTAMP
updated_at  TIMESTAMP
synced_at   TIMESTAMP NULL
deleted_at  TIMESTAMP NULL

-- ITEM_PRODUTO
id              BIGINT PK
uuid            CHAR(36) UNIQUE
quantidade      INT
preco_unitario  DECIMAL(12,2)
subtotal        DECIMAL(12,2)
atendimento_id  BIGINT FK
produto_id      BIGINT FK
created_at      TIMESTAMP
updated_at      TIMESTAMP
synced_at       TIMESTAMP NULL

-- ITEM_SERVICO
id              BIGINT PK
uuid            CHAR(36) UNIQUE
quantidade      INT
preco_unitario  DECIMAL(12,2)
subtotal        DECIMAL(12,2)
atendimento_id  BIGINT FK
servico_id      BIGINT FK
created_at      TIMESTAMP
updated_at      TIMESTAMP
synced_at       TIMESTAMP NULL
```

**Campos de Sincronização (Offline-First):**
| Campo | Propósito |
|-------|-----------|
| `uuid` | Gerado no cliente mobile — garante unicidade sem servidor |
| `synced_at` | NULL = pendente de sincronização |
| `deleted_at` | Soft delete — replicado na sincronização bidirecional |

---

## 6. CASOS DE USO

### Módulo Web (Gestão e Parametrização)

**[UC01] Autenticar Usuário**
- Permite que o microempreendedor acesse a plataforma de gestão
- Fluxo: usuário insere e-mail e senha → sistema verifica → acesso ao Dashboard

**[UC02] Consultar Dashboard e Relatórios**
- Centraliza dados financeiros e operacionais
- Inclui: relatórios financeiros (fluxo de caixa) e operacionais (produtividade)

**[UC03] Parametrizar Operação do Sistema** ← ⭐ CRÍTICO
- Define se o sistema opera como "Somente Venda", "Somente Serviço" ou "Híbrido"
- Fluxo: usuário seleciona modo → sistema salva em `Configuracao` → regra replicada para Mobile

**[UC04] Gerenciar Produto/Estoque**
- Cadastro, edição e exclusão de itens físicos e controle de saldo

**[UC05] Gerenciar Tipos de Serviços**
- Definição do catálogo de serviços e valores de mão de obra

**[UC06] Gerar Insights via IA** (Opcional)
- Ator externo: IA (FastAPI/Python)
- Sistema envia dados anonimizados → IA retorna sugestões de otimização de estoque ou precificação

### Módulo Mobile (Operacional)
- Autenticação de usuário
- Registro de atendimentos (venda, serviço ou ambos)
- Gerenciamento de tarefas
- Consulta de histórico local (offline)
- Sincronização de dados com o servidor

---

## 7. ÉPICOS E ESTRUTURA DO JIRA

### Épico 1 — Infraestrutura & DevOps
**Dono:** Diego Santos | **Suporte:** Davi Rocha
- Criar repositório Git + configurar Gitflow
- Configurar projeto ASP.NET Core .NET 8 (solução base)
- Configurar PostgreSQL localmente + migrations (EF Core)
- Criar conta Azure + configurar resource group
- Configurar CI/CD pipeline (GitHub Actions / Azure DevOps)
- Deploy inicial da API em Azure (dev environment)
- Documentar processo de deploy

### Épico 2 — Backend Core (C# / ASP.NET)
**Dono:** Luan | **Suporte:** Davi Rocha + Diego
- Implementar entidade `Usuario` + service de autenticação (JWT)
- Implementar entidade `Configuracao` + regras de parametrização
- Implementar CRUD `Cliente`
- Implementar CRUD `Produto` + controle de estoque
- Implementar CRUD `Servico`
- Implementar `Atendimento` + lógica `calcularTotal()`
- Implementar `Item_Produto` + `Item_Servico`
- Filtros de Atendimento Híbrido
- Testes unitários (xUnit + Moq)
- Integração com PostgreSQL (migrations)

### Épico 3 — Módulo IA/Insights (Python)
**Dono:** Davi Bueno | **Suporte:** Davi Rocha
- Criar projeto FastAPI base
- Endpoint de análise de vendas
- Endpoint de sugestões de estoque
- Integração com modelo de IA
- Testes de endpoints
- Deploy em Azure

### Épico 4 — Frontend Web (React)
**Dono:** A definir | **Suporte:** Davi Rocha
- Criar projeto React + TypeScript
- Layout base (Dashboard, navbar, sidebar)
- Tela de Login + autenticação JWT
- Dashboard com resumos
- Formulário de Parametrização (`Configuracao`)
- CRUD de Produtos
- CRUD de Serviços
- Integração com API (axios)

### Épico 5 — Documentação & QA
**Dono:** Richard Batista | **Suporte:** Davi Rocha
- Diagrama de Classes (Controller → Service → Repository)
- Documentação de API (Swagger/OpenAPI)
- Documentação de deploy
- Testes de integração
- Manual do usuário
- Atualizar README

---

## 8. CHECKPOINTS ACADÊMICOS

| Checkpoint | Data | Requisitos | Status |
|-----------|------|-----------|--------|
| CP I | Concluído | DER, Diagrama de Classes, Modelo de Dados, Casos de Uso | ✅ Concluído |
| CP III | A definir | Backend REST, TDD, Git, Deploy Cloud, Diagrama de Classes das interações | 🔄 Em progresso |
| CP IV | 18/06 | Mobile (React Native + SQLite), Integração completa | ⏳ Pendente |

---

## 9. ARQUITETURA DE PASTAS SUGERIDA (ASP.NET Core)

```
MicroERP.Api/
├── Controllers/
│   ├── AuthController.cs
│   ├── ClienteController.cs
│   ├── ProdutoController.cs
│   ├── ServicoController.cs
│   └── AtendimentoController.cs
├── Services/
│   ├── Interfaces/
│   │   └── IClienteService.cs
│   └── ClienteService.cs
├── Repositories/
│   ├── Interfaces/
│   │   └── IClienteRepository.cs
│   └── ClienteRepository.cs
├── Models/
│   ├── Usuario.cs
│   ├── Configuracao.cs
│   ├── Cliente.cs
│   ├── Produto.cs
│   ├── Servico.cs
│   ├── Atendimento.cs
│   ├── ItemProduto.cs
│   └── ItemServico.cs
├── Data/
│   └── AppDbContext.cs
├── DTOs/
└── Program.cs
```

---

## 10. FLUXO GIT (GITFLOW)

```
main          → produção (cloud Azure)
develop       → integração de features
feature/xxx   → cada task do Jira (ex: feature/crud-cliente)
hotfix/xxx    → correções urgentes em produção
```

**Convenção de commits:**
```
feat: implementa CRUD de Cliente
fix: corrige cálculo de total no Atendimento
test: adiciona testes para regras de Configuracao
docs: atualiza README com instruções de setup
chore: configura pipeline CI/CD Azure
```

---

## 11. REGRAS DE NEGÓCIO CRÍTICAS

### Regra 1 — Parametrização (Configuracao)
```
SE tipo_operacao == "Venda"   → Exibir apenas módulos de Produto/Estoque
SE tipo_operacao == "Serviço" → Exibir apenas módulos de Serviço
SE tipo_operacao == "Híbrido" → Exibir todos os módulos
```
Esta regra se aplica ao Frontend Web E ao Mobile.

### Regra 2 — Atendimento Híbrido
Um único `Atendimento` pode conter simultaneamente:
- N registros de `Item_Produto`
- N registros de `Item_Servico`

O método `calcularTotal()` deve somar ambos os subtotais.

### Regra 3 — Sincronização Offline-First
```
1. Mobile gera UUID localmente antes de enviar ao servidor
2. synced_at == NULL indica registro pendente de sincronização
3. deleted_at (soft delete) é replicado na sincronização bidirecional
4. Conflitos são resolvidos por updated_at (last write wins)
```

### Regra 4 — Multi-tenant
Toda query de entidade operacional DEVE filtrar por `usuario_id`.
Nenhum usuário pode ver dados de outro usuário.

---

## 12. DECISÕES TÉCNICAS REGISTRADAS

| Decisão | Alternativas Avaliadas | Escolha Final | Motivo |
|---------|----------------------|---------------|--------|
| Backend | Node.js, Java | C# ASP.NET Core .NET 8 | Tipagem forte, EF Core, profissional |
| ORM | Dapper | Entity Framework Core | Migrations code-first, produtividade |
| Cloud | Railway, Render | Microsoft Azure | Créditos acadêmicos, currículo |
| BD | MySQL, SQLite | PostgreSQL | DECIMAL nativo, constraints robustas |
| Mobile | Flutter, Kotlin | React Native + SQLite | Reuso do conhecimento React |
| IA | Integrada no C# | Python FastAPI | Separação de responsabilidades |
| Auth | Sessions, OAuth | JWT | Stateless, compatível com Mobile |

---

## 13. STATUS ATUAL DO PROJETO

- [x] Escopo definido
- [x] Modelo de dados finalizado (DER + Diagrama de Classe + Modelo Físico)
- [x] Casos de uso documentados
- [x] Stack tecnológica definida
- [x] Jira configurado com épicos
- [x] Equipe definida com responsabilidades
- [ ] Repositório Git criado
- [ ] Projeto ASP.NET Core inicializado
- [ ] Primeiro deploy no Azure
- [ ] Prototipo upado no Git
