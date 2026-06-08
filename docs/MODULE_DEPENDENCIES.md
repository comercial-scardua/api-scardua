# Module Dependencies Map - Portal Scardua

Mapa de dependências entre módulos para planejamento da migração.

---

## Dependências Críticas (Implementar Primeiro)

```
┌─────────────────────────────────────────────────────────┐
│                   CORE MODULES                          │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐          │
│  │ Database │  │ JWT Auth │  │ Permissions  │          │
│  │ (Prisma) │  │  Guard   │  │   Guard      │          │
│  └──────────┘  └──────────┘  └──────────────┘          │
│        ↑              ↑              ↑                   │
│        └──────────────┴──────────────┘                  │
│              (Dependências Transversais)                │
└─────────────────────────────────────────────────────────┘
```

### 1. Health Module (Sem dependências)
```
Health
 └─ PrismaService
```
'
**Status:** ✓ Pode ser implementado primeiro para validar setup
**Endpoints:** 1
**Dependências:** PrismaService

---

### 2. Auth Module (Mínimo, apenas Database)
```
Auth
 ├─ Usuarios (fetch user)
 ├─ JWT Strategy
 ├─ Bcrypt
 └─ PrismaService
```

**Status:** ✓ Implementar como segundo módulo
**Endpoints:** 8
**Dependências:** Usuarios (Service), PrismaService
**Dependências (Saintes):** Nenhuma
**Crítico:** SIM - Necessário para proteger outros endpoints

---

### 3. Usuarios Module (Dependências mínimas)
```
Usuarios
 ├─ PrismaService
 ├─ Auth (via JWT)
 └─ Logger
```

**Status:** ✓ Implementar como terceiro módulo
**Endpoints:** 6
**Dependências:** PrismaService
**Dependências (Saintes):** Auth (injetado via guard)
**Crítico:** SIM - Necessário para permissões

---

## Dependências por Módulo

### Nível 1: Sem Dependências (Implementar Imediatamente)
```
┌─────────────┐
│   Health    │
└─────────────┘
```

### Nível 2: Dependências Simples (1-2 módulos)
```
┌─────────────┐      ┌─────────────┐
│    Auth     │──→  │  Usuarios   │
└─────────────┘      └─────────────┘
     │
     └──→ JWT Guard (Comum)
```

**Duração estimada:** 1 semana

---

### Nível 3: Recursos Básicos (Banco de Horas, Estoque, EPI)
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ┌────────────────┐  ┌──────────────┐             │
│  │ Colaboradores  │  │ Empresas     │             │
│  └────────────────┘  └──────────────┘             │
│         ↑                   ↑                      │
│         └─────┬─────────────┘                      │
│               │                                   │
│  ┌────────────┴────────────┐                      │
│  │                         │                      │
│ ┌┴──────────┐  ┌──────────┴┐  ┌──────────┐       │
│ │Banco Horas│  │  Estoque  │  │   EPI    │       │
│ └───────────┘  └───────────┘  └──────────┘       │
│         ↑              ↑              ↑            │
│         └──────────────┴──────────────┘            │
│              (Dependem de)                         │
│  Usuarios + Colaboradores + Empresas              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Módulos:**
1. **Colaboradores** - Dependências: Auth, Usuarios
2. **Empresas** - Dependências: Auth, Usuarios
3. **Banco de Horas** - Dependências: Auth, Colaboradores, Empresas
4. **Estoque** - Dependências: Auth, Empresas
5. **EPI** - Dependências: Auth, Colaboradores, Estoque

**Duração estimada:** 2 semanas

---

### Nível 4: Recursos Secundários
```
┌─────────────────────────────────────────────────┐
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │         Caixa Viagem                    │   │
│  │  Deps: Colaboradores, Usuarios          │   │
│  └─────────────────────────────────────────┘   │
│                   ↓                             │
│  ┌─────────────────────────────────────────┐   │
│  │         Conta Corrente                  │   │
│  │  Deps: Colaboradores, Caixa Viagem     │   │
│  └─────────────────────────────────────────┘   │
│                   ↓                             │
│  ┌─────────────────────────────────────────┐   │
│  │         Patrimonio                      │   │
│  │  Deps: Colaboradores, Empresas          │   │
│  └─────────────────────────────────────────┘   │
│                   ↓                             │
│  ┌─────────────────────────────────────────┐   │
│  │         Contratos                       │   │
│  │  Deps: Colaboradores, Empresas          │   │
│  └─────────────────────────────────────────┘   │
│                   ↓                             │
│  ┌─────────────────────────────────────────┐   │
│  │         Manuais                         │   │
│  │  Deps: Nenhuma                          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Duração estimada:** 2 semanas

---

### Nível 5: Precificação e NCM
```
┌────────────────────────────────────────────┐
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  NCM Module                          │  │
│  │  Deps: Auth, Usuarios                │  │
│  │  Services:                           │  │
│  │   - NCM List                         │  │
│  │   - NCM Check                        │  │
│  │   - NCM Search                       │  │
│  │   - NCM Validate                     │  │
│  └──────────────────────────────────────┘  │
│           ↓                                 │
│  ┌──────────────────────────────────────┐  │
│  │  Precificador Module                 │  │
│  │  Deps: Auth, Estoque, NCM, Oracle   │  │
│  │  Services:                           │  │
│  │   - Price Calculation                │  │
│  │   - Supplier Search                  │  │
│  │   - Invoice Processing               │  │
│  └──────────────────────────────────────┘  │
│           ↓                                 │
│  ┌──────────────────────────────────────┐  │
│  │  Importacao Precos Module            │  │
│  │  Deps: Precificador, Estoque         │  │
│  └──────────────────────────────────────┘  │
│           ↓                                 │
│  ┌──────────────────────────────────────┐  │
│  │  Preco Venda Module                  │  │
│  │  Deps: Precificador                  │  │
│  └──────────────────────────────────────┘  │
│           ↓                                 │
│  ┌──────────────────────────────────────┐  │
│  │  Tabela de Preco Module              │  │
│  │  Deps: Preco Venda                   │  │
│  └──────────────────────────────────────┘  │
│                                            │
└────────────────────────────────────────────┘
```

**Duração estimada:** 2-3 semanas

---

### Nível 6: Integrações Externas
```
┌───────────────────────────────────────────────┐
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │  Oracle Module                          │  │
│  │  Deps: Auth, Config                     │  │
│  │  Endpoints: 7                           │  │
│  └─────────────────────────────────────────┘  │
│                   ↓                           │
│  ┌─────────────────────────────────────────┐  │
│  │  Bridge Module (Generic Database Link) │  │
│  │  Deps: Auth, Config                     │  │
│  │  Endpoints: 5                           │  │
│  └─────────────────────────────────────────┘  │
│                                               │
└───────────────────────────────────────────────┘
```

**Duração estimada:** 1-2 semanas

---

### Nível 7: Relatórios e Gestão
```
┌────────────────────────────────────────────┐
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  Relatorios Module                   │  │
│  │  Deps: Auth, Usuarios (permissions) │  │
│  │  Endpoints: 4                        │  │
│  └──────────────────────────────────────┘  │
│           ↓                                 │
│  ┌──────────────────────────────────────┐  │
│  │  Reports Module (Query Runner)       │  │
│  │  Deps: Relatorios, Oracle/Bridge     │  │
│  │  Endpoints: 1                        │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  SGQ Module                          │  │
│  │  Deps: Auth, Usuarios, Colaboradores│  │
│  │  Endpoints: 6                        │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  Suporte Module                      │  │
│  │  Deps: Auth, Usuarios, Colaboradores│  │
│  │  Endpoints: 4                        │  │
│  └──────────────────────────────────────┘  │
│                                            │
└────────────────────────────────────────────┘
```

**Duração estimada:** 2 semanas

---

### Nível 8: Utilitários e Complementos
```
┌────────────────────────────────────────────┐
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  Lancamentos Module                  │  │
│  │  Deps: Auth, Colaboradores           │  │
│  │  Sub-modules:                        │  │
│  │   - Lancamento                       │  │
│  │   - Lancamento Viagem                │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  Movimentacao Module                 │  │
│  │  Deps: Auth, Estoque                 │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  Eventos Module                      │  │
│  │  Deps: Auth, Usuarios                │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  Erros Module                        │  │
│  │  Deps: Auth                          │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  Monitor Registros                   │  │
│  │  Deps: Auth                          │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  Utilitários (Download, Upload, etc) │  │
│  │  Deps: Auth                          │  │
│  └──────────────────────────────────────┘  │
│                                            │
└────────────────────────────────────────────┘
```

**Duração estimada:** 1-2 semanas

---

## Tabela de Dependências Detalhada

| Módulo | Dependências | Endpoints | Prioridade | Complexidade |
|--------|--------------|-----------|------------|--------------|
| **Health** | - | 1 | ALTA | BAIXA |
| **Auth** | Usuarios | 8 | CRÍTICA | ALTA |
| **Usuarios** | - | 6 | CRÍTICA | MÉDIA |
| **Colaboradores** | Usuarios, Empresas | 3 | ALTA | MÉDIA |
| **Empresas** | Usuarios | 4 | ALTA | BAIXA |
| **Banco de Horas** | Colaboradores, Empresas | 17 | ALTA | ALTA |
| **Estoque** | Empresas | 11 | ALTA | ALTA |
| **EPI** | Colaboradores, Estoque | 20 | MÉDIA | ALTA |
| **Caixa Viagem** | Colaboradores, Usuarios | 10 | MÉDIA | MÉDIA |
| **Conta Corrente** | Colaboradores, Caixa Viagem | 7 | MÉDIA | MÉDIA |
| **Patrimonio** | Colaboradores, Empresas | 5 | MÉDIA | MÉDIA |
| **Contratos** | Colaboradores, Empresas | 5 | MÉDIA | MÉDIA |
| **Manuais** | - | 6 | BAIXA | BAIXA |
| **NCM** | Usuarios | 3 | ALTA | ALTA |
| **Precificador** | Estoque, NCM, Oracle | 9 | ALTA | MUITO_ALTA |
| **Importacao Precos** | Precificador, Estoque | 5 | MÉDIA | ALTA |
| **Preco Venda** | Precificador | 3 | MÉDIA | BAIXA |
| **Tabela de Preco** | Precificador | 5 | MÉDIA | MÉDIA |
| **Oracle** | Usuarios | 7 | ALTA | MUITO_ALTA |
| **Bridge** | Usuarios | 5 | ALTA | MUITO_ALTA |
| **Relatorios** | Usuarios | 4 | MÉDIA | ALTA |
| **Reports** | Relatorios, Oracle/Bridge | 1 | MÉDIA | ALTA |
| **SGQ** | Usuarios, Colaboradores | 6 | BAIXA | MÉDIA |
| **Suporte** | Usuarios, Colaboradores | 4 | BAIXA | MÉDIA |
| **Lancamentos** | Colaboradores | 4 | BAIXA | BAIXA |
| **Movimentacao** | Estoque | 2 | BAIXA | BAIXA |
| **Eventos** | Usuarios | 1 | BAIXA | BAIXA |
| **Erros** | Usuarios | 2 | BAIXA | BAIXA |
| **Utilitários** | Usuarios | 10+ | BAIXA | BAIXA |

---

## Ordem de Implementação Recomendada

### Semana 1: Core Foundation
- [ ] Health Module (validar setup)
- [ ] Auth Module (com JWT)
- [ ] Usuarios Module (com permissões)
- [ ] Database setup (Prisma migrations)

**Total Endpoints:** 15
**Tempo Estimado:** 5-7 dias

### Semana 2: Recursos Primários - Pessoas
- [ ] Colaboradores Module
- [ ] Empresas Module
- [ ] Testes unitários para módulos anteriores

**Total Endpoints:** 7
**Tempo Estimado:** 5 dias

### Semana 3-4: Recursos Primários - Dados
- [ ] Banco de Horas Module
- [ ] Estoque Module
- [ ] Integrações com Banco de Dados

**Total Endpoints:** 28
**Tempo Estimado:** 10 dias

### Semana 5: EPI e Recursos Complementares
- [ ] EPI Module
- [ ] Caixa Viagem Module
- [ ] Testes de integração

**Total Endpoints:** 30
**Tempo Estimado:** 7 dias

### Semana 6-7: Complementos Financeiros
- [ ] Conta Corrente Module
- [ ] Patrimonio Module
- [ ] Contratos Module
- [ ] Lancamentos Module

**Total Endpoints:** 26
**Tempo Estimado:** 10 dias

### Semana 8: Integrações de Preços
- [ ] NCM Module (básico)
- [ ] Precificador Module
- [ ] Oracle Query Module

**Total Endpoints:** 19
**Tempo Estimado:** 8-10 dias

### Semana 9: Gestão e Relatórios
- [ ] Relatorios Module
- [ ] Reports Module
- [ ] SGQ Module
- [ ] Suporte Module

**Total Endpoints:** 15
**Tempo Estimado:** 7 dias

### Semana 10+: Complementos
- [ ] Manuais Module
- [ ] Utilitários (Upload, Download, etc)
- [ ] Endpoints de debug e testes
- [ ] Otimizações finais

**Total Endpoints:** 10+
**Tempo Estimado:** 5-7 dias

---

## Padrão de Compartilhamento

### Módulos Compartilhados (Common)
```
common/
├── guards/
│   ├── jwt-auth.guard.ts       (✓ Implementar logo)
│   ├── permissions.guard.ts    (✓ Implementar logo)
│   └── roles.guard.ts
├── pipes/
│   └── validation.pipe.ts      (✓ Implementar logo)
├── filters/
│   └── http-exception.filter.ts (✓ Implementar logo)
├── decorators/
│   ├── auth.decorator.ts       (✓ Implementar logo)
│   ├── permissions.decorator.ts (✓ Implementar logo)
│   └── public.decorator.ts
├── middleware/
│   └── logger.middleware.ts
└── exceptions/
    └── custom-exceptions.ts    (✓ Implementar logo)
```

### Serviços Compartilhados
- **PrismaService** - Acesso ao banco (importado por todos)
- **LoggerService** - Logging centralizado
- **CacheService** - Cache em memória/Redis
- **MailService** - Envio de emails
- **FileService** - Gerenciamento de arquivos

---

## Mitigação de Riscos

### Riscos Identificados

1. **Dependência Circular**
   - Risco: Auth → Usuarios → ... → Auth
   - Solução: Usar lazy loading, injetar serviços via método, não via constructor

2. **Performance**
   - Risco: Queries lentas em módulos com muitos dados
   - Solução: Implementar paginação, índices, cache desde o início

3. **Permissões**
   - Risco: Sistema de permissões incompleto
   - Solução: Implementar no Nível 2, antes de outros módulos

4. **Migração de Dados**
   - Risco: Inconsistência de dados durante migração
   - Solução: Manter ambos os sistemas rodando em paralelo inicialmente

---

**Última atualização:** 2026-06-08
**Total de módulos:** 50
**Total de endpoints:** 194+
**Tempo estimado total:** 10-12 semanas
