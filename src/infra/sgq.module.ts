import { Module } from '@nestjs/common'
import { SgqRepository } from '../domain/sgq/application/repositories/sgq-repository'
import { AtualizarDocumentoUseCase } from '../domain/sgq/application/use-cases/atualizar-documento'
import { BuscarDocumentoUseCase } from '../domain/sgq/application/use-cases/buscar-documento'
import { CriarDocumentoUseCase } from '../domain/sgq/application/use-cases/criar-documento'
import { CriarNaoConformidadeUseCase } from '../domain/sgq/application/use-cases/criar-nao-conformidade'
import { CriarProcessoUseCase } from '../domain/sgq/application/use-cases/criar-processo'
import { DeletarArquivoUseCase } from '../domain/sgq/application/use-cases/deletar-arquivo'
import { ListarArquivosUseCase } from '../domain/sgq/application/use-cases/listar-arquivos'
import { ListarDocumentosUseCase } from '../domain/sgq/application/use-cases/listar-documentos'
import { ListarHelpUseCase } from '../domain/sgq/application/use-cases/listar-help'
import { ListarNaoConformidadesUseCase } from '../domain/sgq/application/use-cases/listar-nao-conformidades'
import { ListarProcessosUseCase } from '../domain/sgq/application/use-cases/listar-processos'
import { ObterDashboardUseCase } from '../domain/sgq/application/use-cases/obter-dashboard'
import { UploadArquivoUseCase } from '../domain/sgq/application/use-cases/upload-arquivo'
import { PrismaSgqRepository } from './database/prisma/repositories/prisma-sgq-repository'
import { AtualizarDocumentoController } from './http/controllers/sgq/atualizar-documento.controller'
import { BuscarDocumentoController } from './http/controllers/sgq/buscar-documento.controller'
import { CriarDocumentoController } from './http/controllers/sgq/criar-documento.controller'
import { CriarNaoConformidadeController } from './http/controllers/sgq/criar-nao-conformidade.controller'
import { CriarProcessoController } from './http/controllers/sgq/criar-processo.controller'
import { DeletarArquivoController } from './http/controllers/sgq/deletar-arquivo.controller'
import { ListarArquivosController } from './http/controllers/sgq/listar-arquivos.controller'
import { ListarDocumentosController } from './http/controllers/sgq/listar-documentos.controller'
import { ListarHelpController } from './http/controllers/sgq/listar-help.controller'
import { ListarNaoConformidadesController } from './http/controllers/sgq/listar-nao-conformidades.controller'
import { ListarProcessosController } from './http/controllers/sgq/listar-processos.controller'
import { ObterDashboardController } from './http/controllers/sgq/obter-dashboard.controller'
import { UploadArquivoController } from './http/controllers/sgq/upload-arquivo.controller'

@Module({
  controllers: [
    ListarDocumentosController,
    CriarDocumentoController,
    ListarProcessosController,
    CriarProcessoController,
    ListarNaoConformidadesController,
    CriarNaoConformidadeController,
    ListarArquivosController,
    UploadArquivoController,
    DeletarArquivoController,
    ObterDashboardController,
    ListarHelpController,
    BuscarDocumentoController,
    AtualizarDocumentoController,
  ],
  providers: [
    ListarDocumentosUseCase,
    CriarDocumentoUseCase,
    ListarProcessosUseCase,
    CriarProcessoUseCase,
    ListarNaoConformidadesUseCase,
    CriarNaoConformidadeUseCase,
    ListarArquivosUseCase,
    UploadArquivoUseCase,
    DeletarArquivoUseCase,
    ObterDashboardUseCase,
    ListarHelpUseCase,
    BuscarDocumentoUseCase,
    AtualizarDocumentoUseCase,
    { provide: SgqRepository, useClass: PrismaSgqRepository },
  ],
})
export class SgqModule {}
