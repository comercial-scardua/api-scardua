import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import {
  PERMISSION_KEY,
  type RequiredPermission,
} from '../decorators/require-permission.decorator';
import type { JwtPayload } from '../types/jwt-payload.type';

const cache = new Map<
  string,
  {
    data: Array<{
      page: string;
      canAccess: boolean;
      canEdit: boolean;
      canDelete: boolean;
    }>;
    expiresAt: number;
  }
>();
const TTL_MS = 5 * 60 * 1000;

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<RequiredPermission>(
      PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required) return true;

    const user = context.switchToHttp().getRequest<{ user: JwtPayload }>().user;
    if (!user?.userId) return false;

    if (user.role === 'ADMIN') return true;

    const permissions = await this.loadPermissions(user.userId);
    const perm = permissions.find((p) => p.page === required.page);

    if (!perm)
      throw new ForbiddenException(`Sem acesso à página "${required.page}"`);

    const allowed =
      required.action === 'access'
        ? perm.canAccess
        : required.action === 'edit'
          ? perm.canEdit
          : required.action === 'delete'
            ? perm.canDelete
            : false;

    if (!allowed)
      throw new ForbiddenException(
        `Sem permissão de "${required.action}" em "${required.page}"`,
      );

    return true;
  }

  private async loadPermissions(userId: string) {
    const cached = cache.get(userId);
    if (cached && cached.expiresAt > Date.now()) return cached.data;

    const data = await this.prisma.permission.findMany({
      where: { userId },
      select: { page: true, canAccess: true, canEdit: true, canDelete: true },
    });

    cache.set(userId, { data, expiresAt: Date.now() + TTL_MS });
    return data;
  }

  static invalidate(userId: string) {
    cache.delete(userId);
  }
}
