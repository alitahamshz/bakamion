import { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'
import { readStoredRecords, storeRecords } from '../storage'
import type { FilterDefinition, RecordInput, RecordItem, RecordsResponse } from '../types'

export function useRecords() {
  const [records, setRecords] = useState<RecordItem[]>([])
  const [filters, setFilters] = useState<FilterDefinition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [formRecord, setFormRecord] = useState<RecordItem | null | undefined>(undefined)
  const [deleteRecord, setDeleteRecord] = useState<RecordItem | null>(null)
  const [notice, setNotice] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    const cached = readStoredRecords()
    try {
      const result = await api.get<RecordsResponse>('/task-front', { timeout: 10_000 })
      setFilters(result.filters)
      setRecords(cached ?? result.data)
      if (!cached) storeRecords(result.data)
    } catch {
      if (cached) setRecords(cached)
      else setError('دریافت اطلاعات اولیه انجام نشد. اتصال اینترنت را بررسی و دوباره تلاش کنید.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [query, status, pageSize])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 2800)
    return () => window.clearTimeout(timer)
  }, [notice])

  const filtered = useMemo(
    () =>
      records.filter((record) => {
        const term = query.trim().toLocaleLowerCase('fa')
        return (
          (!status || record.status.key === status) &&
          (!term || `${record.title} ${record.description}`.toLocaleLowerCase('fa').includes(term))
        )
      }),
    [records, query, status],
  )

  const totalPages = Math.max(1, pageSize === -1 ? 1 : Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const visible =
    pageSize === -1 ? filtered : filtered.slice((safePage - 1) * pageSize, safePage * pageSize)
  const statuses = filters.find((filter) => filter.key === 'status')?.options ?? []

  const persist = (next: RecordItem[]) => {
    setRecords(next)
    storeRecords(next)
  }

  const save = (input: RecordInput) => {
    if (formRecord)
      persist(
        records.map((record) =>
          record.id === formRecord.id
            ? { ...record, ...input, updated_at: new Date().toISOString() }
            : record,
        ),
      )
    else {
      const id = Math.max(0, ...records.map((record) => record.id)) + 1
      persist([
        {
          ...input,
          id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        ...records,
      ])
    }
    setFormRecord(undefined)
    setNotice(formRecord ? 'تغییرات ذخیره شد.' : 'رکورد جدید ایجاد شد.')
  }

  const confirmDelete = () => {
    if (!deleteRecord) return
    persist(records.filter((record) => record.id !== deleteRecord.id))
    if (pageSize !== -1 && page > 1 && (page - 1) * pageSize >= filtered.length - 1)
      setPage(page - 1)
    setDeleteRecord(null)
    setNotice('رکورد با موفقیت حذف شد.')
  }

  const resetFilters = () => {
    setQuery('')
    setStatus('')
  }

  return {
    records,
    filters,
    loading,
    error,
    notice,
    query,
    status,
    pageSize,
    formRecord,
    deleteRecord,
    filtered,
    visible,
    statuses,
    safePage,
    totalPages,
    load,
    save,
    confirmDelete,
    resetFilters,
    setQuery,
    setStatus,
    setPage,
    setPageSize,
    setFormRecord,
    setDeleteRecord,
  }
}
