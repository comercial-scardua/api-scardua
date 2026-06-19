import { SetMetadata } from '@nestjs/common'

export type PermissionAction = 'access' | 'edit' | 'delete'

export interface RequiredPermission {
  page: string
  action: PermissionAction
}

export const PERMISSION_KEY = 'requiredPermission'

export const RequirePermission = (
  page: string,
  action: PermissionAction = 'access',
) => SetMetadata(PERMISSION_KEY, { page, action } satisfies RequiredPermission)
