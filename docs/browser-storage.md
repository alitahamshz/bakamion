# ذخیره اطلاعات در مرورگر

برای نگه‌داری تغییرات رکوردها از `localStorage` مرورگر استفاده شده است. دلیلش این است که API پروژه فقط اطلاعات اولیه را برمی‌گرداند و endpoint مشخصی برای ایجاد، ویرایش یا حذف رکورد ندارد.

## روند کار

در اولین اجرا ، اطلاعات از API دریافت و با کلید زیر در مرورگر ذخیره می‌شود:

```text
app-records
```

بعد از آن، با ایجاد، ویرایش یا حذف هر رکورد، لیست جدید بلافاصله در `localStorage` ذخیره می‌شود. به همین خاطر بعد از رفرش صفحه، تغییرات باقی می‌مانند.

## نکته‌ها

- اطلاعات فقط در همان مرورگر و همان دستگاه نگه‌داری می‌شوند.
- پاک کردن داده‌های سایت یا Local Storage مرورگر، این تغییرات را حذف می‌کند.
- برای برگرداندن اطلاعات اولیه API، کلید `app-records` را از Local Storage پاک و صفحه را رفرش کنید.
- اگر API در دسترس نباشد اما اطلاعات قبلاً ذخیره شده باشند، برنامه از داده‌های مرورگر استفاده می‌کند.

## کدهای مربوط به ذخیره‌سازی

لاجیک خواندن و نوشتن اطلاعات در فایل `src/features/records/storage.ts` قرار دارد :

```ts
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
```

- `readStoredRecords`:
  اطلاعات ذخیره‌شده را می‌خواند. اگر داده خراب باشد، آن را پاک می‌کند تا برنامه با خطا روبه‌رو نشود.
- `storeRecords`:
  آرایه رکوردها را به متن JSON تبدیل و در Local Storage ذخیره می‌کند.

استفاده از این توابع در `src/features/records/hooks/useRecords.ts` انجام می‌شود. هنگام دریافت اولیه اطلاعات، این بخش داده API را در صورت نبود cache ذخیره می‌کند:

```ts
setRecords(cached ?? result.data)
if (!cached) storeRecords(result.data)
```

تابع `persist` بعد از ایجاد ویرایش یا حذف رکورد اجرا می‌شود تا state و Local Storage با هم به‌روز شوند:

```ts
const persist = (next: RecordItem[]) => {
  setRecords(next)
  storeRecords(next)
}
```
