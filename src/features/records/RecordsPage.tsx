import { AlertCircle, FilePlus2, Inbox, LoaderCircle, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteDialog } from './components/DeleteDialog'
import { Pagination } from './components/Pagination'
import { RecordFilters } from './components/RecordFilters'
import { RecordFormDialog } from './components/RecordFormDialog'
import { RecordTable } from './components/RecordTable'
import { useRecords } from './hooks/useRecords'
import '@/styles/app.css'

export function RecordsPage() {
  const {
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
  } = useRecords()

  return (
    <main className="app-shell mx-auto max-w-[1240px] px-6 py-12" dir="rtl">
      <header className="page-header mb-7 flex items-end justify-between gap-5">
        <div>
          <h1 className="text-[30px] tracking-[-0.5px]">لیست رکوردها</h1>
        </div>
        <Button onClick={() => setFormRecord(null)}>
          <FilePlus2 size={18} />
          ایجاد رکورد جدید
        </Button>
      </header>
      {notice && (
        <div className="notice" role="status">
          {notice}
        </div>
      )}
      {loading ? (
        <section className="grid min-h-[310px] place-content-center justify-items-center gap-3 text-center text-slate-500">
          <LoaderCircle className="animate-spin" size={28} />
          <p>در حال دریافت اطلاعات...</p>
        </section>
      ) : error ? (
        <section className="grid min-h-[310px] place-content-center justify-items-center gap-3 text-center text-slate-500">
          <AlertCircle size={30} />
          <h2 className="text-lg text-slate-700">دریافت اطلاعات ناموفق بود</h2>
          <p>{error}</p>
          <Button variant="outline" onClick={() => void load()}>
            <RotateCw size={16} />
            تلاش دوباره
          </Button>
        </section>
      ) : (
        <>
          <RecordFilters
            filters={filters}
            query={query}
            status={status}
            onQueryChange={setQuery}
            onStatusChange={setStatus}
            onReset={resetFilters}
          />
          {filtered.length ? (
            <>
              <RecordTable records={visible} onEdit={setFormRecord} onDelete={setDeleteRecord} />
              <Pagination
                page={safePage}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
              />
            </>
          ) : (
            <section className="grid min-h-[310px] place-content-center justify-items-center gap-3 text-center text-slate-500">
              <Inbox size={34} />
              <h2 className="text-lg text-slate-700">
                {records.length ? 'رکوردی مطابق فیلترهای انتخاب شده پیدا نشد' : 'هنوز رکوردی وجود ندارد'}
              </h2>
              <p>{records.length ? '' : 'اولین رکورد راایجاد کنید.'}</p>
              {Boolean(query || status) && (
                <Button variant="outline" onClick={resetFilters}>
                  پاک‌کردن فیلترها
                </Button>
              )}
            </section>
          )}
        </>
      )}
      {formRecord !== undefined && (
        <RecordFormDialog
          record={formRecord}
          statuses={statuses}
          onClose={() => setFormRecord(undefined)}
          onSubmit={save}
        />
      )}
      {deleteRecord && (
        <DeleteDialog
          record={deleteRecord}
          onClose={() => setDeleteRecord(null)}
          onConfirm={confirmDelete}
        />
      )}
    </main>
  )
}
