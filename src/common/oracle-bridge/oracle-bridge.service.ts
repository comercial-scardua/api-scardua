import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export interface BridgeResult<T = Record<string, unknown>> {
  success: boolean
  results: T[]
  raw?: unknown
  message?: string
}

@Injectable()
export class OracleBridgeService {
  private readonly logger = new Logger(OracleBridgeService.name)
  private readonly bridgeUrl: string
  private readonly projectId: string

  constructor(config: ConfigService) {
    this.bridgeUrl = config.getOrThrow<string>('ORACLE_BRIDGE_URL')
    this.projectId = config.getOrThrow<string>('BRIDGE_PROJECT_ID')
  }

  async query<T = Record<string, unknown>>(
    sql: string,
    params: unknown[] = [],
    timeoutMs = 30_000,
  ): Promise<BridgeResult<T>> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const res = await fetch(`${this.bridgeUrl}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Vercel-Project-ID': this.projectId,
        },
        body: JSON.stringify({ query: sql, params }),
        signal: controller.signal,
      })

      clearTimeout(timer)

      const data = (await res.json().catch(() => ({}))) as Record<
        string,
        unknown
      >

      if (!res.ok) {
        this.logger.error(`[Bridge] HTTP ${res.status}`, JSON.stringify(data))
        return {
          success: false,
          results: [],
          message: (data.message as string) || 'Erro na bridge',
        }
      }

      const results = (data.data || data.results || []) as T[]
      return { success: true, results, raw: data }
    } catch (err: unknown) {
      clearTimeout(timer)
      const error = err as { name?: string; message?: string }
      if (error.name === 'AbortError') {
        return {
          success: false,
          results: [],
          message: `Query timeout (${timeoutMs / 1000}s)`,
        }
      }
      this.logger.error('[Bridge] Erro de conexão', error?.message)
      return {
        success: false,
        results: [],
        message: error?.message || 'Erro de conexão',
      }
    }
  }
}
