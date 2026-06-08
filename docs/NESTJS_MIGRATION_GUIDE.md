# NestJS Migration Guide - Portal Scardua

Guia técnico para migração da API Next.js para NestJS.

---

## 1. Estrutura de Pastas Recomendada

```
src/
├── main.ts                          # Entry point
├── app.module.ts                    # Root module
├── app.controller.ts                # Root controller
├── app.service.ts                   # Root service
│
├── config/
│   ├── database.config.ts
│   ├── env.config.ts
│   ├── app.config.ts
│   └── jwt.config.ts
│
├── common/
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   ├── permissions.guard.ts
│   │   └── roles.guard.ts
│   ├── pipes/
│   │   └── validation.pipe.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── decorators/
│   │   ├── auth.decorator.ts
│   │   ├── permissions.decorator.ts
│   │   └── public.decorator.ts
│   ├── middleware/
│   │   └── logger.middleware.ts
│   └── exceptions/
│       └── custom-exceptions.ts
│
├── database/
│   ├── prisma.module.ts
│   └── prisma.service.ts
│
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   │   └── refresh-token.dto.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── local.strategy.ts
│   │   └── entities/
│   │       └── token.entity.ts
│   │
│   ├── usuarios/
│   │   ├── usuarios.module.ts
│   │   ├── usuarios.service.ts
│   │   ├── usuarios.controller.ts
│   │   ├── dto/
│   │   │   ├── create-usuario.dto.ts
│   │   │   ├── update-usuario.dto.ts
│   │   │   └── update-permissions.dto.ts
│   │   └── entities/
│   │       └── usuario.entity.ts
│   │
│   ├── colaboradores/
│   │   ├── colaboradores.module.ts
│   │   ├── colaboradores.service.ts
│   │   ├── colaboradores.controller.ts
│   │   ├── dto/
│   │   │   ├── create-colaborador.dto.ts
│   │   │   └── update-colaborador.dto.ts
│   │   └── entities/
│   │       └── colaborador.entity.ts
│   │
│   ├── banco-de-horas/
│   │   ├── banco-de-horas.module.ts
│   │   ├── banco-de-horas.service.ts
│   │   ├── banco-de-horas.controller.ts
│   │   ├── dto/
│   │   ├── entities/
│   │   └── helpers/
│   │
│   ├── caixa-viagem/
│   ├── conta-corrente/
│   ├── estoque/
│   ├── epi/
│   ├── patrimonio/
│   ├── contratos/
│   ├── manuais/
│   ├── precificador/
│   ├── ncm/
│   ├── relatorios/
│   ├── reports/
│   ├── sgq/
│   ├── suporte/
│   ├── erros/
│   ├── empresas/
│   ├── eventos/
│   ├── lancamentos/
│   │   ├── lancamento/
│   │   └── lancamento-viagem/
│   ├── oracle/
│   ├── bridge/
│   ├── integrations/
│   │   └── ncm/
│   │       ├── ncm-list.service.ts
│   │       ├── ncm-check.service.ts
│   │       └── ncm-search.service.ts
│   └── health/
│       ├── health.module.ts
│       ├── health.controller.ts
│       └── health.service.ts
│
└── utils/
    ├── validators/
    ├── helpers/
    ├── constants/
    └── enums/
```

---

## 2. Módulos por Ordem de Prioridade

### Fase 1: Core (Semana 1-2)
- [ ] Health Check
- [ ] Auth Module (Login, Register, Refresh Token)
- [ ] Usuarios Module (Permissões)
- [ ] Database Setup (Prisma)
- [ ] Exception Handling

### Fase 2: Recursos Principais (Semana 3-4)
- [ ] Colaboradores
- [ ] Banco de Horas
- [ ] Estoque
- [ ] EPI

### Fase 3: Recursos Secundários (Semana 5-6)
- [ ] Caixa Viagem
- [ ] Conta Corrente
- [ ] Patrimonio
- [ ] Contratos

### Fase 4: Integrações (Semana 7-8)
- [ ] Precificador
- [ ] NCM
- [ ] Oracle Query
- [ ] Bridge

### Fase 5: Utilitários (Semana 9+)
- [ ] Relatórios
- [ ] SGQ
- [ ] Suporte
- [ ] Manuais

---

## 3. Padrão de Implementação por Módulo

### Template: Modulo Base

#### modulo.module.ts
```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from '../database/prisma.module';
import { ModuloService } from './modulo.service';
import { ModuloController } from './modulo.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ModuloController],
  providers: [ModuloService],
  exports: [ModuloService], // Se usado por outros módulos
})
export class ModuloModule {}
```

#### modulo.service.ts
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';

@Injectable()
export class ModuloService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateModuloDto) {
    return this.prisma.modulo.create({ data: dto });
  }

  async findAll() {
    return this.prisma.modulo.findMany();
  }

  async findOne(id: string) {
    const item = await this.prisma.modulo.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Not found');
    return item;
  }

  async update(id: string, dto: UpdateModuloDto) {
    return this.prisma.modulo.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.prisma.modulo.delete({ where: { id } });
  }
}
```

#### modulo.controller.ts
```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ModuloService } from './modulo.service';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';

@Controller('modulo')
@UseGuards(JwtAuthGuard)
@UseFilters(HttpExceptionFilter)
export class ModuloController {
  constructor(private readonly service: ModuloService) {}

  @Post()
  create(@Body() createDto: CreateModuloDto) {
    return this.service.create(createDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateModuloDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
```

#### create-modulo.dto.ts
```typescript
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateModuloDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
```

---

## 4. Implementação de Camadas

### Auth Guard
```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### JWT Strategy
```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuariosService } from '../../modules/usuarios/usuarios.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usuariosService: UsuariosService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return this.usuariosService.findOne(payload.sub);
  }
}
```

### Permissions Guard
```typescript
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const hasPermission = requiredPermissions.some(permission =>
      user.permissions.includes(permission)
    );

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
```

### Decorador de Permissões
```typescript
import { SetMetadata } from '@nestjs/common';

export const Permissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);
```

---

## 5. Migrations Guide (Prisma)

### Comandos Principais
```bash
# Criar nova migration
npx prisma migrate dev --name <migration_name>

# Sincronizar schema com banco
npx prisma generate

# Resetar banco (dev apenas)
npx prisma migrate reset

# Status das migrations
npx prisma migrate status
```

---

## 6. Implementação de Features por Módulo

### 6.1 Auth Module

**Endpoints:**
```
POST   /auth/login
POST   /auth/register
POST   /auth/logout
POST   /auth/refresh-token
POST   /auth/refresh-permissions
POST   /auth/reset-password
POST   /auth/verify-password
POST   /auth/verify-username
```

**Considerações:**
- Implementar JWT com refresh tokens
- Validar força de senha
- Hash de senhas com bcrypt
- Implementar rate limiting para login

### 6.2 Usuarios Module

**Endpoints:**
```
GET    /usuarios
POST   /usuarios
PUT    /usuarios/{id}
DELETE /usuarios/{id}
GET    /usuarios/{id}/permissions
POST   /usuarios/{id}/permissions
GET    /usuarios/all-permissions
POST   /usuarios/checkpermission
```

**Considerações:**
- Implementar soft delete
- Audit log para mudanças de permissão
- Cache de permissões

### 6.3 Banco de Horas Module

**Endpoints:**
```
GET    /banco-de-horas/registros
POST   /banco-de-horas/registros
PUT    /banco-de-horas/registros/{id}
DELETE /banco-de-horas/registros/{id}
GET    /banco-de-horas/estatisticas
GET    /banco-de-horas/relatorios
POST   /banco-de-horas/gerar-termo
POST   /banco-de-horas/sincronizar
```

**Considerações:**
- Implementar validação de sobreposição de horários
- Calcular saldo de horas dinamicamente
- Considerar background job para sincronização

### 6.4 Estoque Module

**Endpoints:**
```
GET    /estoque/produtos
POST   /estoque/produtos
PUT    /estoque/produtos/{id}
GET    /estoque/entradas
POST   /estoque/entradas
GET    /estoque/saidas
POST   /estoque/saidas
GET    /estoque/transferencias
POST   /estoque/transferencias
GET    /estoque/saldo-filiais
```

**Considerações:**
- Implementar transações para movimentações
- Controle de saldo negativo
- Histórico completo de movimentações

---

## 7. Database Design

### Alterações Necessárias
```prisma
// Exemplo de modelo
model Usuario {
  id        String   @id @default(cuid())
  email     String   @unique
  senha     String
  nome      String
  ativo     Boolean  @default(true)
  
  // Soft delete
  deletadoEm DateTime?
  
  // Timestamps
  criadoEm   DateTime @default(now())
  atualizadoEm DateTime @updatedAt
  
  // Relations
  colaborador Colaborador?
  permissoes  Permissao[]

  @@index([email])
  @@index([deletadoEm])
}

model Permissao {
  id        String @id @default(cuid())
  nome      String @unique
  descricao String
  
  usuarioIds String[]
  
  @@index([nome])
}
```

---

## 8. Testing Strategy

### Unit Tests
```typescript
// exemplo: usuario.service.spec.ts
describe('UsuarioService', () => {
  let service: UsuarioService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsuarioService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a user', async () => {
    const result = await service.create({ email: 'test@test.com' });
    expect(result).toHaveProperty('id');
  });
});
```

### Integration Tests
- Usar banco de dados de teste
- Limpar estado entre testes
- Testar fluxos completos

---

## 9. API Documentation

### Swagger Setup
```typescript
// main.ts
const config = new DocumentBuilder()
  .setTitle('Portal Scardua API')
  .setDescription('API Documentation')
  .setVersion('2.0.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

### Documentar Endpoints
```typescript
@Get(':id')
@ApiOperation({ summary: 'Get user by ID' })
@ApiResponse({ status: 200, type: UsuarioEntity })
@ApiResponse({ status: 404, description: 'User not found' })
@ApiParam({ name: 'id', type: 'string' })
findOne(@Param('id') id: string) {
  return this.service.findOne(id);
}
```

---

## 10. Deployment

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/portal

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRATION=3600

# Server
PORT=3000
NODE_ENV=production

# Oracle (se necessário)
ORACLE_HOST=
ORACLE_PORT=
ORACLE_USER=
ORACLE_PASSWORD=
ORACLE_DATABASE=
```

### Docker Setup
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/portal
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=portal
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 11. Performance Optimization

### Caching Strategy
```typescript
@Injectable()
export class CacheService {
  constructor(private cache: CacheManager) {}

  async get<T>(key: string): Promise<T> {
    return this.cache.get(key);
  }

  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    await this.cache.set(key, value, ttl * 1000);
  }
}
```

### Query Optimization
- Usar select para limitar campos
- Implementar paginação
- Usar índices no banco de dados
- Evitar N+1 queries

### Rate Limiting
```typescript
@UseGuards(ThrottlerGuard)
@Throttle(100, 60) // 100 requests per minute
@Get()
findAll() {
  return this.service.findAll();
}
```

---

## 12. Logging

### Implementação
```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class UsuarioService {
  private logger = new Logger(UsuarioService.name);

  async findOne(id: string) {
    this.logger.log(`Finding user with id: ${id}`);
    try {
      return await this.prisma.usuario.findUnique({ where: { id } });
    } catch (error) {
      this.logger.error(`Error finding user: ${error.message}`, error.stack);
      throw error;
    }
  }
}
```

---

## 13. Error Handling

### Global Exception Filter
```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ExecutionContext) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = 500;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getMessage();
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
```

---

## 14. CI/CD

### GitHub Actions
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm run test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to server
        run: npm run deploy
```

---

## 15. Checklist de Migração

### Pré-Migração
- [ ] Documentar todas as rotas (✓ já feito)
- [ ] Identificar dependências
- [ ] Planejar mudanças no banco de dados
- [ ] Preparar ambiente de teste

### Durante a Migração
- [ ] Implementar por módulos
- [ ] Testar cada módulo isoladamente
- [ ] Implementar testes unitários
- [ ] Implementar testes de integração
- [ ] Documentar mudanças

### Pós-Migração
- [ ] Testar em staging
- [ ] Performance testing
- [ ] Security testing
- [ ] Deploy gradual (canary)
- [ ] Monitoramento

---

**Última atualização:** 2026-06-08
**Status:** Pronto para implementação
