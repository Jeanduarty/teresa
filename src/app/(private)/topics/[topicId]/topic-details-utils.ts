export function formatTopicDate(dateString: string | null): string {
  if (!dateString) {
    return 'Nao registrado'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateString))
}
