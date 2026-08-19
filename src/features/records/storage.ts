import type { RecordItem } from './types'

const recordsKey = 'app-records'

export function readStoredRecords(): RecordItem[] | null {
  const value = localStorage.getItem(recordsKey)
  if (!value) return null
  try {
    return JSON.parse(value) as RecordItem[]
  } catch {
    localStorage.removeItem(recordsKey)
    return null
  }
}

export function storeRecords(records: RecordItem[]) {
  localStorage.setItem(recordsKey, JSON.stringify(records))
}
