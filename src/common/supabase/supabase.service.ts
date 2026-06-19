import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

@Injectable()
export class SupabaseService {
  private client: SupabaseClient

  constructor(private config: ConfigService) {
    this.client = createClient(
      this.config.getOrThrow('NEXT_PUBLIC_SUPABASE_URL'),
      this.config.getOrThrow('SUPABASE_SERVICE_ROLE_KEY'),
    )
  }

  async upload(
    bucket: string,
    path: string,
    buffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    const { error } = await this.client.storage
      .from(bucket)
      .upload(path, buffer, { contentType: mimeType, upsert: false })

    if (error) throw new Error(`Supabase upload error: ${error.message}`)

    const { data } = this.client.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  async remove(bucket: string, paths: string[]): Promise<void> {
    const { error } = await this.client.storage.from(bucket).remove(paths)
    if (error) throw new Error(`Supabase remove error: ${error.message}`)
  }

  async getSignedUploadUrl(
    bucket: string,
    path: string,
  ): Promise<{ signedUrl: string; token: string; path: string }> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .createSignedUploadUrl(path)

    if (error) throw new Error(`Supabase signed URL error: ${error.message}`)
    return { signedUrl: data.signedUrl, token: data.token, path: data.path }
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.client.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  async createSignedDownloadUrl(
    bucket: string,
    path: string,
    expiresIn = 60,
  ): Promise<string> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)

    if (error)
      throw new Error(`Supabase signed download URL error: ${error.message}`)
    return data.signedUrl
  }

  extractPathFromUrl(url: string, bucket: string): string | null {
    try {
      const marker = `/storage/v1/object/public/${bucket}/`
      const idx = url.indexOf(marker)
      return idx !== -1 ? url.slice(idx + marker.length) : null
    } catch {
      return null
    }
  }
}
