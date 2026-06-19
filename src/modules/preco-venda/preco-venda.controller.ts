import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from '../../auth/decorators/require-permission.decorator'
import { PermissionsGuard } from '../../auth/guards/permissions.guard'
import { PrismaService } from '../../prisma/prisma.service'
import type {
  IncluirPrecoVendaDto,
  ImportarPrecoVendaDto,
} from './dto/incluir-preco-venda.dto'

@ApiTags('Preço de Venda')
@ApiBearerAuth()
@Controller('preco-venda')
@UseGuards(PermissionsGuard)
export class PrecoVendaController {
  constructor(private prisma: PrismaService) {}

  @Post('incluir')
  @HttpCode(200)
  @RequirePermission('preco-venda', 'edit')
  @ApiOperation({ summary: 'Incluir/atualizar preço de venda de um produto' })
  async incluir(@Body() dto: IncluirPrecoVendaDto) {
    const produto = await this.prisma.products.findUnique({
      where: { id: dto.produtoId },
    })
    if (!produto)
      throw new NotFoundException(`Produto #${dto.produtoId} não encontrado`)

    // O modelo products não possui campo precoVenda; armazenamos o valor na descricao
    // como metadado estruturado até que o schema seja atualizado
    const descricaoAtualizada = JSON.stringify({
      ...(produto.descricao
        ? (() => {
            try {
              return JSON.parse(produto.descricao)
            } catch {
              return { texto: produto.descricao }
            }
          })()
        : {}),
      precoVenda: dto.precoVenda,
      observacao: dto.observacao ?? undefined,
    })

    const atualizado = await this.prisma.products.update({
      where: { id: dto.produtoId },
      data: { descricao: descricaoAtualizada, updatedAt: new Date() },
    })

    return { ...atualizado, precoVenda: dto.precoVenda }
  }

  @Post('importar')
  @HttpCode(201)
  @RequirePermission('preco-venda', 'edit')
  @ApiOperation({ summary: 'Importar múltiplos preços de venda (array)' })
  async importar(@Body() dto: ImportarPrecoVendaDto) {
    const resultados: {
      produtoId: number
      status: string
      precoVenda?: number
      erro?: string
    }[] = []

    for (const item of dto.itens) {
      const produto = await this.prisma.products.findUnique({
        where: { id: item.produtoId },
      })
      if (!produto) {
        resultados.push({
          produtoId: item.produtoId,
          status: 'erro',
          erro: 'Produto não encontrado',
        })
        continue
      }

      const descricaoAtualizada = JSON.stringify({
        ...(produto.descricao
          ? (() => {
              try {
                return JSON.parse(produto.descricao)
              } catch {
                return { texto: produto.descricao }
              }
            })()
          : {}),
        precoVenda: item.precoVenda,
      })

      await this.prisma.products.update({
        where: { id: item.produtoId },
        data: { descricao: descricaoAtualizada, updatedAt: new Date() },
      })

      resultados.push({
        produtoId: item.produtoId,
        status: 'atualizado',
        precoVenda: item.precoVenda,
      })
    }

    return { total: dto.itens.length, resultados }
  }

  @Get('template')
  @HttpCode(200)
  @RequirePermission('preco-venda', 'access')
  @ApiOperation({
    summary: 'Retorna template JSON para importação de preços de venda',
  })
  template() {
    return {
      descricao: 'Template para importação de preços de venda',
      formato: 'JSON',
      campos: [
        {
          campo: 'produtoId',
          tipo: 'number',
          obrigatorio: true,
          descricao: 'ID do produto no sistema',
        },
        {
          campo: 'precoVenda',
          tipo: 'number',
          obrigatorio: true,
          descricao: 'Preço de venda em reais',
        },
      ],
      exemplo: {
        itens: [
          { produtoId: 1, precoVenda: 29.99 },
          { produtoId: 2, precoVenda: 49.9 },
        ],
      },
    }
  }
}
