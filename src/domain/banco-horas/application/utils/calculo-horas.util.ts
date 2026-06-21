export class CalculoHorasUtil {
  static calcularHorasDoRegistro(
    horaInicio: string | null,
    horaFim: string | null,
    intervaloMinutos: number,
    horasCorrigidas?: number | null,
  ): number {
    if (!horaInicio || !horaFim) return horasCorrigidas || 0

    const [hi, mi] = horaInicio.split(':').map(Number)
    const [hf, mf] = horaFim.split(':').map(Number)

    const minutosTrabalhados = hf * 60 + mf - (hi * 60 + mi)
    const horas = (minutosTrabalhados - intervaloMinutos) / 60

    return Number((horas + (horasCorrigidas || 0)).toFixed(2))
  }

  static formatarHorasDecimal(horas: number): string {
    const horasInteiras = Math.floor(Math.abs(horas))
    const minutos = Math.round((Math.abs(horas) - horasInteiras) * 60)
    const sinal = horas < 0 ? '-' : ''
    return `${sinal}${horasInteiras}h${String(minutos).padStart(2, '0')}m`
  }

  static converterStringParaMinutos(hora: string): number {
    const [h, m] = hora.split(':').map(Number)
    return h * 60 + m
  }

  static converterMinutosParaString(minutos: number): string {
    const h = Math.floor(minutos / 60)
    const m = minutos % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }
}
