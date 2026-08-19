# ساختار پروژه

معماری feature-based مورد استفاده قرار گرفته است. یعنی هر بخش از سیستم با دیتا و UI خودش در یک پوشه جمع میشود، اضافه کردن فیچر جدید یا دست زدن به یکی، بقیه بخش ها را کمتر دستخوش تغییر قرار میدهد .

```
src/
  App.tsx
  main.tsx
  styles/
    index.css
    app.css
  features/
    records/
      RecordsPage.tsx
      index.ts
      types.ts
      storage.ts
      hooks/
        useRecords.ts
      components/
        RecordTable.tsx
        RecordFilters.tsx
        RecordFormDialog.tsx
        DeleteDialog.tsx
        Pagination.tsx
  components/
    AppDialog.tsx
    DataTable.tsx
    ui/
      button.tsx
      dialog.tsx
      input.tsx
      label.tsx
      select.tsx
  lib/
    api.ts
    date.ts
    utils.ts
```
