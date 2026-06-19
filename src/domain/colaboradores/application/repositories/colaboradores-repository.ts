import type { colaboradores, termos_assinados } from '@prisma/client'
import type {
  CreateColaboradorData,
  UpdateColaboradorData,
} from '../dtos/colaborador-schema'

export abstract class ColaboradoresRepository {
  abstract findAll(filters: {
    cpf?: string
    simple?: boolean
  }): Promise<Partial<colaboradores>[]>
  abstract findById(id: number): Promise<colaboradores | null>
  abstract findByCpf(cpf: string): Promise<colaboradores | null>
  abstract findByUserId(userId: string): Promise<colaboradores | null>
  abstract findTermos(colaboradorId: number): Promise<termos_assinados[]>
  abstract create(data: CreateColaboradorData): Promise<colaboradores>
  abstract update(
    id: number,
    data: UpdateColaboradorData,
  ): Promise<colaboradores>
  abstract softDelete(id: number): Promise<colaboradores>
  abstract updateFoto(id: number, fotoUrl: string): Promise<colaboradores>
}
