/**
 * Torna um conjunto de chaves K opcionais em T, mantendo as demais obrigatórias.
 * Útil em métodos `create` de entidades para campos com default (ex.: createdAt).
 */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
