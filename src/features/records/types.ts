export type Status = { key: string; value: string }

export type RecordItem = {
  id: number
  title: string
  description: string
  status: Status
  image: { url: string; alt: string }
  created_at: string
  updated_at: string
}

export type FilterDefinition = {
  key: 'status' | 'search'
  label: string
  type: 'select' | 'text'
  multiple: boolean
  options: Status[]
}

export type RecordsResponse = { data: RecordItem[]; filters: FilterDefinition[] }

export type RecordInput = Omit<RecordItem, 'id' | 'created_at' | 'updated_at'>
