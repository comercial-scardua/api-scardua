# Migração para Arquitetura DDD/Clean — Guia de fim de semana

> Estado em **2026-06-19**. Este documento lista os módulos que **ainda faltam**
> migrar para o padrão DDD/Clean (estilo Rocketseat) e dá uma receita passo-a-passo
> para fazer cada um sozinho. Build sempre verde (`npx tsc --noEmit` exit 0) e
> Biome aplicado ao final de cada módulo.

---

## ✅ Já migrados (NÃO mexer)

`eventos`, `erros`, `relatorios`, `aniversariantes` (lote 1) ·
`movimentacao`, `patrimonios`, `empresas`, `contratos`, `colaboradores`, `usuarios` (lote 2) ·
`uniforme` (criado novo já em DDD).

Estes vivem em `src/domain/<mod>/` + `src/infra/<mod>.module.ts` e estão
registrados no `AppModule` via `./infra/<mod>.module`. As pastas antigas em
`src/modules/<mod>` foram removidas.

**Use `empresas` como referência principal** (CRUD simples / "flavor leve") e
`eventos` como referência de "flavor rico" (com entidade + value-object + mapper).

---

## ⬜ Faltam migrar (34 módulos)

Todos ainda em `src/modules/<mod>` no estilo antigo (1 controller grande +
`createZodDto` em alguns). Migrar = quebrar em 1 controller por caso de uso,
trocar DTO `class`/`createZodDto` por **zod inline + `ZodValidationPipe`**,
use-cases retornando `Either`, repositório como **classe abstrata** (token DI)
implementada por `Prisma*Repository`.

`ROTAS` = nº de endpoints. `UC` = já tem pasta `use-cases/` (parte do trabalho
pronto). Comece pelos menores de cada lote para ganhar ritmo.

### Lote 3 — núcleo com lógica (faça primeiro)

| Módulo | Rotas | UC? | Observações |
|---|---|---|---|
| `lancamento` | 4 | não | ligado a `conta_corrente` (model `lancamentos`). Pequeno, bom aquecimento. |
| `lancamento-viagem` | 4 | não | ligado a `caixaviagem` (model `viagemlancamento`). |
| `conta-corrente` | 20 | sim | tem use-cases; rotas `stats`, `todos`, `resumo/:id`, `ocultar`, `generate-termo`. **Rotas estáticas antes das `/:id`**. |
| `caixa-viagem` | 24 | não | repo grande (`caixa-viagem.repository.ts`); `adiantamento`, `recalcularSaldos`, `generate-termo`, `stats`, `todos`. |
| `estoque` | 23 | sim | produtos/entradas/saidas/transferencias + `dashboard`, `saldo-filiais`, `empresas`. |
| `banco-horas` | 24 | sim | prefixo de rota é **`banco-de-horas`** (não `banco-horas`). PDFs de termo (Supabase/pdf). O mais pesado depois do epi. |
| `epi` | 39 | sim | **maior do projeto**. Irmão do `uniforme` (já migrado) — copie a estrutura do `uniforme` e expanda (epi tem `epi_estoque_filial`, `epi_transferencias`, dashboard, alertas). Deixe por último do lote. |

### Lote 4 — fiscal / preços

| Módulo | Rotas | UC? | Observações |
|---|---|---|---|
| `gestor-empresas` | 2 | não | trivial. |
| `ncm-check` | 2 | não | utilitário NCM. |
| `monitor-registros` | 2 | não | 2 rotas, mas controller de 157 linhas (lógica). |
| `preco-venda` | 3 | não | `importar`, `incluir`, `template`. |
| `permissoes` | 5 | sim | mexe no `paginas.constant.ts` e no cache do `PermissionsGuard`. Cuidado. |
| `importacao-precos` | 5 | não | `categorias`, `grupos`, `marcas`, `importar`, `exportar`. |
| `ncm` | 6 | sim | CRUD + `import`. |
| `ncm-utilities` | 6 | não | `search-ncm`, `list-ncms`, `validar-pecas-ncm` etc. |
| `tabela-de-preco` | 6 | não | repo de 254 linhas; `importar`/`template`/`historico`. |
| `suporte` | 8 | não | tickets + comentários (`/:id/comentarios`). |
| `precificador` | 9 | não | `buscar-*` (fornecedor/ncm/nf/produto), `salvar`, `historico`, `atualizar-precos[-lote]`. |
| `sgq` | 13 | não | documents/processes/non-conformities/dashboard/help/files. |

### Lote 5 — utilitários / infra (mais rápidos)

| Módulo | Rotas | UC? | Observações |
|---|---|---|---|
| `status` | 1 | não | público. Trivial. |
| `health` | 1 | não | público, checa DB. |
| `protected` | 1 | não | rota de teste de auth. |
| `download` | 1 | não | stream de arquivo. |
| `upload-image` | 1 | não | Supabase. |
| `img-proxy` | 1 | não | público, proxy de imagem. |
| `check-cpf` | 1 | não | consulta CPF. |
| `oracle-credentials` | 1 | não | Oracle bridge. |
| `reports` | 1 | não | `run-query`. |
| `oracle-test` | 2 | não | Oracle. |
| `debug` | 4 | não | rotas de debug (permissions/ncm/usuarios). |
| `test-modules` | 4 | não | testes de NCM em lote. |
| `bridge` | 5 | não | `connect`/`tables`/`describe`/`execute`. |
| `oracle-query` | 6 | não | `connect`/`disconnect`/`execute`/`tables`/`describe`/`update`. |
| `manuais` | 11 | sim | Supabase (arquivos). Já tem use-cases — bom candidato. |

> Muitos do lote 5 são wrappers finos de serviços (`OracleBridgeService`,
> `SupabaseService` — ambos `@Global`). Para esses, "flavor leve" extremo:
> talvez nem precise de repositório próprio, só controller + use-case fino que
> injeta o service global. Avalie caso a caso — não force a estrutura.

---

## Estrutura de pastas alvo (por módulo)

```
src/domain/<mod>/
  application/
    repositories/<mod>-repository.ts        # classe ABSTRATA (token DI) + tipos
    use-cases/<caso-de-uso>.ts              # 1 arquivo por caso de uso, retorna Either
    use-cases/errors/<erro>.error.ts        # erros de domínio (implements UseCaseError)
    dtos/<mod>-schema.ts                    # SÓ quando o schema zod é grande/compartilhado
  enterprise/                               # APENAS no "flavor rico"
    entities/<entidade>.ts
    value-objects/<vo>.ts

src/infra/
  <mod>.module.ts                           # controllers + providers + { provide: Repo, useClass: PrismaRepo }
  database/prisma/
    repositories/prisma-<mod>-repository.ts # implements <Mod>Repository
    mappers/prisma-<entidade>-mapper.ts     # APENAS no "flavor rico"
  http/
    controllers/<mod>/<caso-de-uso>.controller.ts  # 1 controller por caso de uso
    presenters/<entidade>-presenter.ts      # APENAS no "flavor rico"
```

`src/core/` (either, entities, errors/use-case-error, types/optional) e
`src/infra/http/pipes/zod-validation-pipe.ts` já existem — **não recriar**.

---

## Receita passo-a-passo (1 módulo)

1. **Mapeie as rotas**: abra `src/modules/<mod>/<mod>.controller.ts` e liste cada
   endpoint (método + path + body/query + permissão). Confira contra o portal em
   `portal-scardua/src/app/api/<area>/...` para não perder comportamento.
2. **Repositório abstrato** (`domain/.../repositories/<mod>-repository.ts`):
   declare os tipos (linha do Prisma, `Create*Data`, `Update*Data`, filtros) e a
   `abstract class <Mod>Repository` com os métodos que os use-cases precisam.
3. **Use-cases**: 1 por operação. Cada um injeta o repositório abstrato, retorna
   `Promise<Either<Erro, Resultado>>`. Regras de negócio (unicidade, existência,
   saldo) vivem aqui via `left(new XError())`.
4. **Erros de domínio** em `use-cases/errors/`, `extends Error implements UseCaseError`.
5. **PrismaRepository** (`infra/database/prisma/repositories/prisma-<mod>-repository.ts`):
   `@Injectable() implements <Mod>Repository`, injeta `PrismaService`. Use
   `select`/`include` **escopados** (nunca vazar `password`/`token` do `users`).
6. **Controllers** (`infra/http/controllers/<mod>/`): 1 por caso de uso. Validação
   com `ZodValidationPipe` (zod inline). Traduza o `Either` em resposta/exceção HTTP.
7. **Módulo** (`infra/<mod>.module.ts`): registre controllers, use-cases e
   `{ provide: <Mod>Repository, useClass: Prisma<Mod>Repository }`.
8. **AppModule**: troque o import de `./modules/<mod>/<mod>.module` para
   `./infra/<mod>.module` e ajuste a posição na lista.
9. **Apague** `src/modules/<mod>/` inteiro.
10. **Valide**: `npx tsc --noEmit` (exit 0) e `npx biome check --write src/domain/<mod> src/infra/<mod>.module.ts src/infra/database/prisma/repositories/prisma-<mod>-repository.ts src/infra/http/controllers/<mod>`.
11. **Commit** por módulo (ou por lote): mensagem `refactor: migra <mod> para arquitetura DDD/Clean`.

---

## Convenções OBRIGATÓRIAS (não desviar)

- **Either pattern** — use-cases retornam `Either<Erro, Resultado>` (`src/core/either.ts`).
- **Zod inline + `ZodValidationPipe`** — NUNCA `class-validator` nem `createZodDto`.
  - Body com `@Param` no método: `@Body(new ZodValidationPipe(schema))`.
  - Body **sem** `@Param`: pode usar `@UsePipes(new ZodValidationPipe(schema))`
    (o `@UsePipes` roda em TODOS os params e quebraria um `@Param`).
  - Query: `@Query(new ZodValidationPipe(querySchema))`. Use `z.coerce.number()` e
    `z.enum(['true','false']).transform(v => v === 'true')` para flags.
- **Convenção de resposta**: `create → 201 { <recurso> }` (ou `{ <recurso>Id }` no
  flavor mínimo) · `edit/delete → 204 No Content` · `get → 200 { <recurso> }` ·
  `list → 200 { <recursos> }`. (No `uniforme` create/edit devolvem o objeto inteiro
  por compat com o front — confirme a tolerância por módulo.)
- **HttpCode explícito** em cada rota: `@HttpCode(200/201/204)`.
- **Ordem dos controllers no módulo**: rotas **estáticas antes das paramétricas**
  (ex.: `POST /relatorios/execute` antes de `POST /:id`), senão o Nest casa errado.
- **`import type`** APENAS para DTOs/tipos Prisma/`JwtPayload`. NUNCA para classes
  injetáveis (Services, Repositories, UseCases) — quebra o DI.
- **Permissões**: `@UseGuards(PermissionsGuard)` na classe + `@RequirePermission('<pagina>', 'access'|'edit'|'delete')` por rota.
  ADMIN faz bypass. `@CurrentUser() user: JwtPayload` traz `{ userId, email, role }`.
- **PrismaModule e SupabaseModule são `@Global`** — não importar em cada módulo.
- **Sem path alias `@/`** — imports relativos (tsconfig é `nodenext`, prod roda
  `node dist/main` sem tsconfig-paths).

### Flavor leve vs. rico
- **Leve** (maioria): repo retorna tipos do Prisma direto, sem entidade/mapper.
  Use para CRUD. (ref: `empresas`).
- **Rico**: entidade de domínio + value-object + mapper + presenter. Só quando o
  domínio justifica regras/invariantes. (ref: `eventos`).

---

## Gotchas conhecidos (já custaram tempo)

- **Banco é o legado `scarduapp`**: o `schema.prisma` NÃO pode declarar coluna que
  não existe no banco — o Prisma seleciona todos os escalares por default e
  qualquer coluna fantasma quebra TODAS as queries do model com `P2022`. Antes de
  adicionar campo ao schema, confira via `INFORMATION_SCHEMA.COLUMNS`.
- **colaboradores ativos** = `oculto: false` (não existe campo `ativo`).
- **gestor↔subordinado** NÃO é coluna `gestorId`; é a tabela de junção
  `colaborador_gestores` (relações `gestoresRelacao`/`subordinadosRelacao`).
- **PKs legados** são `Int @default(autoincrement())`. No flavor rico, no mapper:
  `new UniqueEntityID(String(raw.id))` e o `create` devolve a entidade já persistida.
- **Tratamento conservador de retorno**: bata com o que o `portal-scardua` retorna
  — NÃO corte campos que o portal expõe na listagem (ex.: `relatorios.query_sql`,
  `erros_solucoes.solucao`). Mas SEMPRE escope o relacionamento `user` (sem
  `password`/`token`).
- **Cuidado com código morto do portal**: ele às vezes referencia tabelas que nem
  existem no próprio schema (ex.: `uniforme_estoque_movimentacoes`). Se a tabela
  não está no `prisma/schema.prisma`, **não replique** — confirme antes.

---

## Validação rápida

```bash
# typecheck (precisa sair 0)
npx tsc --noEmit

# formatação do módulo recém-migrado
npx biome check --write src/domain/<mod> src/infra/<mod>.module.ts \
  src/infra/database/prisma/repositories/prisma-<mod>-repository.ts \
  src/infra/http/controllers/<mod>

# se mexeu no schema, regenere o client
npx prisma generate
```

## Referências
- Exemplo CRUD: `src/domain/empresas/**` + `src/infra/empresas.module.ts` +
  `src/infra/http/controllers/empresas/**`.
- Exemplo rico: `src/domain/eventos/**` (entidade + value-object + mapper + presenter).
- Exemplo recém-feito (irmão do epi): `src/domain/uniforme/**`.
- Rotas originais: `docs/API_ROUTES_DOCUMENTATION.md` e
  `portal-scardua/src/app/api/<area>/route.ts`.
- Schema do banco: `prisma/schema.prisma`.

---

## Checklist de progresso

**Lote 3**
- [ ] lancamento
- [ ] lancamento-viagem
- [ ] conta-corrente
- [ ] caixa-viagem
- [ ] estoque
- [ ] banco-horas
- [ ] epi

**Lote 4**
- [ ] gestor-empresas
- [ ] ncm-check
- [ ] monitor-registros
- [ ] preco-venda
- [ ] permissoes
- [ ] importacao-precos
- [ ] ncm
- [ ] ncm-utilities
- [ ] tabela-de-preco
- [ ] suporte
- [ ] precificador
- [ ] sgq

**Lote 5**
- [ ] status
- [ ] health
- [ ] protected
- [ ] download
- [ ] upload-image
- [ ] img-proxy
- [ ] check-cpf
- [ ] oracle-credentials
- [ ] reports
- [ ] oracle-test
- [ ] debug
- [ ] test-modules
- [ ] bridge
- [ ] oracle-query
- [ ] manuais
