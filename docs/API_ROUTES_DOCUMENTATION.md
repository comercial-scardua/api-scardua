# API Routes Documentation - Portal Scardua

Documentação de todos os módulos e rotas da API atual (Next.js App Router) para facilitar a migração para NestJS.

**Total de Módulos:** 50
**Total de Endpoints:** 194+

---

## 1. Auth Module
**Descrição:** Autenticação e autorização de usuários

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Login do usuário |
| POST | `/api/auth/logout` | Logout do usuário |
| POST | `/api/auth/register` | Registro de novo usuário |
| GET, POST | `/api/auth/reset-password` | Resetar senha |
| POST | `/api/auth/refresh-token` | Renovar token JWT |
| POST | `/api/auth/refresh-permissions` | Renovar permissões do usuário |
| POST | `/api/auth/verify-username` | Verificar disponibilidade de username |
| POST | `/api/auth/verify-password` | Verificar força da senha |

---

## 2. Usuarios Module
**Descrição:** Gerenciamento de usuários e permissões

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, DELETE, PATCH | `/api/usuarios` | Listar/deletar/atualizar usuários |
| POST | `/api/usuarios/updatepermissions` | Atualizar permissões de usuário |
| GET | `/api/usuarios/checkpermission` | Verificar permissão específica |
| GET | `/api/usuarios/checkpermission-debug` | Debug de permissões |
| GET | `/api/usuarios/all-permissions` | Listar todas as permissões disponíveis |
| GET, POST | `/api/usuarios/permissions` | Gerenciar permissões |

---

## 3. Usuario Module
**Descrição:** Gerenciamento do perfil do usuário autenticado

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/usuario/me` | Obter dados do usuário logado |
| POST | `/api/usuario/foto` | Upload de foto do usuário |

---

## 4. Colaboradores Module
**Descrição:** Gerenciamento de colaboradores/funcionários

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, POST, PUT, PATCH | `/api/colaboradores` | CRUD de colaboradores |
| GET | `/api/colaboradores/me` | Obter dados do colaborador logado |
| GET | `/api/colaboradores/[id]/foto` | Obter/atualizar foto do colaborador |

---

## 5. Colaborador Module
**Descrição:** Dados específicos de um colaborador

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/colaborador/[id]` | Obter dados de um colaborador |
| GET | `/api/colaborador/[id]/termos` | Obter termos assinados pelo colaborador |

---

## 6. Banco de Horas Module
**Descrição:** Controle de banco de horas e ponto

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, POST, DELETE, PATCH | `/api/banco-de-horas/registros` | CRUD de registros de ponto |
| GET, POST, DELETE, PATCH | `/api/banco-de-horas/registros/[id]` | Gerenciar registro individual |
| GET | `/api/banco-de-horas/estatisticas` | Obter estatísticas de horas |
| GET | `/api/banco-de-horas/relatorios` | Obter relatórios de horas |
| GET | `/api/banco-de-horas/funcionarios` | Listar funcionários |
| GET | `/api/banco-de-horas/usuario/horas` | Obter horas do usuário |
| GET | `/api/banco-de-horas/conta-corrente` | Conta corrente de horas |
| POST | `/api/banco-de-horas/gerar-termo` | Gerar termo de horas |
| POST | `/api/banco-de-horas/gerar-termo-pdf` | Gerar termo em PDF |
| POST | `/api/banco-de-horas/gerar-termo-ausencia` | Gerar termo de ausência |
| POST | `/api/banco-de-horas/gerar-termo-ausencia-pdf` | Gerar termo de ausência em PDF |
| POST | `/api/banco-de-horas/gerar-termos-registros` | Gerar múltiplos termos |
| POST | `/api/banco-de-horas/baixar-termo` | Download de termo |
| GET, POST | `/api/banco-de-horas/sincronizar` | Sincronizar dados |
| GET | `/api/banco-de-horas/exportar` | Exportar dados |
| POST | `/api/banco-de-horas/exportar-relatorio` | Exportar relatório |
| GET | `/api/banco-de-horas/debug` | Debug de banco de horas |

---

## 7. Caixa Viagem Module
**Descrição:** Controle de adiantamento para viagens

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, POST, DELETE | `/api/caixaviagem` | CRUD de caixas de viagem |
| GET, POST, PUT, DELETE | `/api/caixaviagem/adiantamento` | Gerenciar adiantamentos |
| GET, POST, PUT, PATCH | `/api/caixaviagem/todos` | Listar todas as caixas |
| GET | `/api/caixaviagem/stats` | Estatísticas de caixas |
| GET, POST, PUT, PATCH | `/api/caixaviagem/ultimo-caixa/[funcionarioId]` | Último caixa do funcionário |
| GET, POST, PUT, PATCH | `/api/caixaviagem/usuario/[id]` | Caixas de viagem do usuário |
| POST | `/api/caixaviagem/resumo/[id]` | Resumo de caixa |
| POST | `/api/caixaviagem/generate-termo` | Gerar termo |
| POST | `/api/caixaviagem/recalcularSaldos` | Recalcular saldos |
| POST | `/api/caixaviagem/ocultar` | Ocultar caixa |

---

## 8. Conta Corrente Module
**Descrição:** Gerenciamento de conta corrente de colaboradores

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, POST, PUT, DELETE | `/api/contacorrente` | CRUD de conta corrente |
| GET, POST, PUT | `/api/contacorrente/todos` | Listar contas correntes |
| GET | `/api/contacorrente/stats` | Estatísticas de conta corrente |
| GET, POST, PUT | `/api/contacorrente/usuario/[id]` | Conta corrente do usuário |
| POST | `/api/contacorrente/resumo/[id]` | Resumo de conta corrente |
| POST | `/api/contacorrente/generate-termo` | Gerar termo |
| POST | `/api/contacorrente/ocultar` | Ocultar conta |

---

## 9. Lancamento Module
**Descrição:** Lançamentos financeiros

| Método | Rota | Descrição |
|--------|------|-----------|
| POST, DELETE | `/api/lancamento` | CRUD de lançamentos |
| POST, DELETE | `/api/lancamento/usuario/[id]` | Lançamentos do usuário |

---

## 10. Lancamento Viagem Module
**Descrição:** Lançamentos de despesas de viagem

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, POST | `/api/lancamentoviagem` | CRUD de lançamentos de viagem |
| GET, POST | `/api/lancamentoviagem/usuario/[id]` | Lançamentos de viagem do usuário |

---

## 11. Estoque Module
**Descrição:** Controle de estoque e movimentações

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, POST | `/api/estoque/produtos` | CRUD de produtos |
| GET, POST | `/api/estoque/produtos/[id]` | Gerenciar produto individual |
| GET, POST | `/api/estoque/entradas` | CRUD de entradas |
| GET, POST | `/api/estoque/entradas/[id]` | Gerenciar entrada individual |
| GET, POST | `/api/estoque/saidas` | CRUD de saídas |
| GET, POST | `/api/estoque/saidas/[id]` | Gerenciar saída individual |
| GET, POST | `/api/estoque/transferencias` | CRUD de transferências |
| GET, POST | `/api/estoque/transferencias/[id]` | Gerenciar transferência |
| GET | `/api/estoque/saldo-filiais` | Saldo por filial |
| GET | `/api/estoque/dashboard` | Dashboard de estoque |
| GET | `/api/estoque/empresas` | Listar empresas com estoque |

---

## 12. EPI Module
**Descrição:** Equipamento de Proteção Individual (EPI)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, POST | `/api/epi/epis` | CRUD de EPIs |
| GET, POST | `/api/epi/epis/[id]` | Gerenciar EPI individual |
| GET, POST | `/api/epi/estoque` | Gerenciar estoque de EPI |
| GET, POST | `/api/epi/estoque/[id]` | Gerenciar estoque individual |
| GET, POST | `/api/epi/movimentacoes` | CRUD de movimentações |
| GET, POST | `/api/epi/movimentacoes/colaborador/[id]` | Movimentações de colaborador |
| GET, POST | `/api/epi/cargos` | CRUD de cargos |
| GET, POST | `/api/epi/cargos/[id]` | Gerenciar cargo individual |
| GET, POST | `/api/epi/cargo-epi` | Associar EPI a cargo |
| GET, POST | `/api/epi/cargo-epi/[id]` | Gerenciar associação |
| GET, POST | `/api/epi/transferencias` | CRUD de transferências |
| GET, POST | `/api/epi/transferencias/[id]` | Gerenciar transferência |
| GET | `/api/epi/colaboradores` | Listar colaboradores com EPI |
| GET | `/api/epi/colaboradores/[id]` | Dados de EPI do colaborador |
| GET | `/api/epi/me` | Meus EPIs |
| GET | `/api/epi/empresas` | Listar empresas |
| GET | `/api/epi/produtos` | Listar produtos |
| GET | `/api/epi/responsaveis` | Listar responsáveis |
| GET | `/api/epi/saldo-filiais` | Saldo de EPI por filial |
| GET | `/api/epi/alertas` | Alertas de EPI |
| GET | `/api/epi/dashboard` | Dashboard de EPI |

---

## 13. Patrimonio Module
**Descrição:** Gerenciamento de patrimônio/bens

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, POST, PUT, PATCH | `/api/patrimonio` | CRUD de patrimônios |
| GET | `/api/patrimonio/veiculos` | Listar veículos |
| GET | `/api/patrimonio/check-serial` | Verificar número de série |
| POST | `/api/patrimonio/generate-doc` | Gerar documentação |
| GET | `/api/patrimonio/stats` | Estatísticas de patrimônio |

---

## 14. Contratos Module
**Descrição:** Gerenciamento de contratos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, POST | `/api/contratos` | CRUD de contratos |
| POST | `/api/contratos/[id]` | Atualizar contrato |
| POST | `/api/contratos/[id]/arquivos` | CRUD de arquivos do contrato |
| POST | `/api/contratos/[id]/arquivos/[arquivoId]` | Gerenciar arquivo individual |
| POST | `/api/contratos/upload-url` | Obter URL de upload |

---

## 15. Manuais Module
**Descrição:** Gerenciamento de manuais e documentação

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, POST | `/api/manuais` | CRUD de manuais |
| GET | `/api/manuais/details` | Detalhes dos manuais |
| GET | `/api/manuais/[id]` | Obter manual específico |
| GET | `/api/manuais/[id]/descricao` | Obter descrição do manual |
| GET | `/api/manuais/[id]/remove-arquivo` | Remover arquivo do manual |
| GET | `/api/manuais/[id]/Arquivos/[arquivoId]` | Gerenciar arquivo do manual |

---

## 16. Importacao Precos Module
**Descrição:** Importação de preços de produtos

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/importacao-precos/importar` | Importar preços |
| GET | `/api/importacao-precos/exportar` | Exportar preços |
| GET | `/api/importacao-precos/categorias` | Listar categorias |
| GET | `/api/importacao-precos/grupos` | Listar grupos |
| GET | `/api/importacao-precos/marcas` | Listar marcas |

---

## 17. Preco Venda Module
**Descrição:** Gerenciamento de preços de venda

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/preco-venda/incluir` | Incluir novo preço |
| POST | `/api/preco-venda/importar` | Importar preços |
| GET | `/api/preco-venda/template` | Obter template de importação |

---

## 18. Tabela de Preco Module
**Descrição:** Gerenciamento de tabelas de preço

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/tabela-de-preco/incluir` | Incluir nova tabela |
| POST | `/api/tabela-de-preco/importar` | Importar tabelas |
| POST | `/api/tabela-de-preco/atualizar` | Atualizar tabelas |
| GET | `/api/tabela-de-preco/template` | Obter template |
| GET, DELETE | `/api/tabela-de-preco/historico` | Histórico de tabelas |

---

## 19. Precificador Module
**Descrição:** Sistema de precificação de produtos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/precificador/buscar-produto` | Buscar produto |
| GET | `/api/precificador/buscar-ncm` | Buscar por NCM |
| GET | `/api/precificador/buscar-fornecedor` | Buscar fornecedor |
| GET | `/api/precificador/buscar-nf` | Buscar nota fiscal |
| GET | `/api/precificador/buscar-nf-importacao` | Buscar NF de importação |
| GET | `/api/precificador/historico` | Histórico de preços |
| POST | `/api/precificador/salvar` | Salvar preço |
| POST | `/api/precificador/atualizar-precos` | Atualizar preços |
| POST | `/api/precificador/atualizar-precos-lote` | Atualizar preços em lote |

---

## 20. NCM Module
**Descrição:** Nomenclatura Comum do Mercosul (NCM)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, POST | `/api/ncm` | CRUD de NCMs |
| POST | `/api/ncm/[id]` | Atualizar NCM |
| POST | `/api/ncm/import` | Importar NCMs |

---

## 21. NCM Check Module
**Descrição:** Validação de NCMs

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/ncm-check` | Validar único NCM |
| POST | `/api/ncm-check-batch` | Validar múltiplos NCMs |

---

## 22. Relatorios Module
**Descrição:** Sistema de relatórios

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, POST | `/api/relatorios` | CRUD de relatórios |
| POST | `/api/relatorios/[id]` | Atualizar relatório |
| POST | `/api/relatorios/[id]/permissions` | Gerenciar permissões |
| POST | `/api/relatorios/execute` | Executar relatório |

---

## 23. Reports Module
**Descrição:** Execução de queries de relatórios

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/reports/run-query` | Executar query de relatório |

---

## 24. SGQ Module
**Descrição:** Sistema de Gestão da Qualidade

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, POST | `/api/sgq/documents` | CRUD de documentos |
| GET, POST | `/api/sgq/processes` | CRUD de processos |
| GET, POST | `/api/sgq/non-conformities` | CRUD de não conformidades |
| GET, POST, DELETE | `/api/sgq/files` | Gerenciar arquivos |
| GET | `/api/sgq/dashboard` | Dashboard SGQ |
| GET | `/api/sgq/help` | Ajuda do SGQ |

---

## 25. Suporte Module
**Descrição:** Sistema de suporte/tickets

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, POST | `/api/suporte` | CRUD de tickets |
| GET | `/api/suporte/[id]` | Obter ticket específico |
| GET | `/api/suporte/[id]/comentarios` | Comentários do ticket |
| GET | `/api/suporte/comentarios/novos` | Novos comentários |

---

## 26. Erros Module
**Descrição:** Registro e gerenciamento de erros

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, POST | `/api/erros` | CRUD de erros |
| GET, POST | `/api/erros/[id]` | Detalhes do erro |

---

## 27. Empresas Module
**Descrição:** Gerenciamento de empresas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, POST, PUT, DELETE | `/api/empresas` | CRUD de empresas |
| GET | `/api/empresas/list` | Listar empresas |

---

## 28. Gestor Empresas Module
**Descrição:** Gestores de empresas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, PUT | `/api/gestor-empresas` | Gerenciar gestores |

---

## 29. Eventos Module
**Descrição:** Gestão de eventos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, POST, DELETE, PATCH | `/api/eventos` | CRUD de eventos |

---

## 30. Aniversariantes Module
**Descrição:** Listagem de aniversariantes

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/aniversariantes` | Listar aniversariantes |

---

## 31. Oracle Query Module
**Descrição:** Conexão e execução de queries Oracle

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/oracle-query/connect` | Conectar ao Oracle |
| POST | `/api/oracle-query/disconnect` | Desconectar |
| POST | `/api/oracle-query/execute` | Executar query |
| POST | `/api/oracle-query/describe` | Descrever tabelas |
| POST | `/api/oracle-query/tables` | Listar tabelas |
| POST | `/api/oracle-query/update` | Atualizar dados |

---

## 32. Bridge Module
**Descrição:** Bridge para conexão de dados externo

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/bridge/connect` | Conectar |
| POST | `/api/bridge/disconnect` | Desconectar |
| POST | `/api/bridge/execute` | Executar |
| POST | `/api/bridge/describe` | Descrever |
| POST | `/api/bridge/tables` | Listar tabelas |

---

## 33. Movimentacao Module
**Descrição:** Movimentações genéricas

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, POST | `/api/movimentacao` | Gerenciar movimentações |

---

## 34. Monitor Registros Module
**Descrição:** Monitoramento de registros

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, POST | `/api/monitor-registros` | Monitorar registros |

---

## 35. Download Module
**Descrição:** Download de arquivos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/download/[...path]` | Download de arquivo |

---

## 36. Upload Image Module
**Descrição:** Upload de imagens

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/upload-image` | Upload de imagem |

---

## 37. Img Proxy Module
**Descrição:** Proxy de imagens

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/img-proxy` | Proxy de imagem |

---

## 38. Check CPF Module
**Descrição:** Validação de CPF

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/check-cpf` | Validar CPF |

---

## 39. Protected Module
**Descrição:** Rota protegida (teste)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/protected` | Rota protegida |

---

## 40. Status Module
**Descrição:** Status da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/status` | Status da API |

---

## 41. Health Module
**Descrição:** Health check da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/health` | Health check |

---

## 42. Debug Modules
**Descrição:** Endpoints de debug

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/debug/permissions` | Debug de permissões |
| GET | `/api/debug-ncm` | Debug NCM |
| GET | `/api/debug-ncm-format` | Debug formato NCM |
| GET | `/api/debug-usuarios` | Debug usuários |

---

## 43. NCM Utilities
**Descrição:** Utilitários para NCM

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/list-ncms` | Listar todos NCMs |
| GET | `/api/search-ncm` | Buscar NCM |
| GET | `/api/diagnose-ncm-limit` | Diagnosticar limite |
| POST | `/api/compare-ncm-queries` | Comparar queries |
| GET | `/api/final-ncm-validation` | Validação final |
| GET | `/api/validar-pecas-ncm` | Validar peças |

---

## 44. Oracle Credentials Module
**Descrição:** Gerenciamento de credenciais Oracle

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/oracle-credentials` | Obter credenciais |

---

## 45. Oracle Test Module
**Descrição:** Teste de conexão Oracle

| Método | Rota | Descrição |
|--------|------|-----------|
| GET, POST | `/api/oracle-test` | Testar conexão |

---

## 46. Test Modules (Desenvolvimento)
**Descrição:** Endpoints de teste

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/test-52-ncms` | Teste 52 NCMs |
| GET | `/api/test-batch-50` | Teste batch 50 |
| GET | `/api/test-batch-sizes` | Teste tamanhos batch |
| GET | `/api/test-sync-horas` | Teste sincronização horas |

---

## Padrões Identificados

### Métodos HTTP Utilizados
- **GET**: Leitura/listagem de dados
- **POST**: Criação/submissão de dados
- **PUT**: Atualização parcial ou total
- **PATCH**: Atualização parcial
- **DELETE**: Exclusão de dados

### Padrões de Rota
- `/api/[modulo]` - CRUD base
- `/api/[modulo]/[id]` - Operações em recurso específico
- `/api/[modulo]/[acao]` - Ações específicas
- `/api/[modulo]/[recurso]/[id]/[sub-acao]` - Operações em sub-recursos

### Segurança
- Implementar autenticação em todos os endpoints (exceto login/register)
- Validar permissões de usuário
- Implementar rate limiting

---

## Recomendações para Migração NestJS

### Estrutura de Módulos Sugerida

```
src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   └── strategies/
├── usuarios/
│   ├── usuarios.module.ts
│   ├── usuarios.service.ts
│   ├── usuarios.controller.ts
│   └── dto/
├── colaboradores/
├── banco-de-horas/
├── caixa-viagem/
├── estoque/
├── epi/
├── patrimonio/
├── contratos/
├── precificador/
├── sgq/
├── suporte/
├── relatorios/
├── oracle/
├── common/
│   ├── guards/
│   ├── pipes/
│   ├── filters/
│   └── decorators/
└── config/
```

### Middlewares/Guards Necessários
- AuthGuard - Validação de JWT
- PermissionsGuard - Verificação de permissões
- RateLimitGuard - Proteção contra abuso
- ValidationPipe - Validação de DTOs

### Database
- Manter Prisma como ORM
- Considerar caching com Redis
- Implementar soft delete onde apropriado

### API Documentation
- Implementar Swagger/OpenAPI
- Adicionar validação automática com class-validators

---

**Última atualização:** 2026-06-08
**Versão da documentação:** 1.0
