export class Formatter {
  static cpf(cpf: string): string {
    const cleanedCpf = cpf.replace(/\D/g, '')

    return cleanedCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
}
