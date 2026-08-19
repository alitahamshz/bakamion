const persianLocale = 'fa-IR'

export function formatRelativeDate(value: string, now = Date.now()) {
  const diff = now - new Date(value).getTime()
  const minutes = Math.max(0, Math.round(diff / 60_000))

  if (minutes < 1) return 'همین حالا'
  if (minutes < 60) return `${minutes} دقیقه پیش`

  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} ساعت پیش`

  return `${Math.round(hours / 24)} روز پیش`
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString(persianLocale)
}
