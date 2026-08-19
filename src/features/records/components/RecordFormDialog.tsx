import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AppDialog } from '@/components/AppDialog'
import { Button } from '@/components/ui/button'
import { controlClassName, Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { RecordInput, RecordItem, Status } from '../types'

const schema = z
  .object({
    title: z.string().trim().min(1, 'عنوان الزامی است.'),
    description: z.string().trim().max(255, 'توضیحات نمی‌تواند بیشتر از ۲۵۵ کاراکتر باشد.'),
    statusKey: z.string().min(1, 'انتخاب وضعیت الزامی است.'),
    imageUrl: z.string(),
    imageAlt: z.string(),
  })
  .superRefine((values, context) => {
    if (!values.imageUrl.trim()) return
    try {
      new URL(values.imageUrl)
    } catch {
      context.addIssue({ code: 'custom', path: ['imageUrl'], message: 'آدرس تصویر معتبر نیست.' })
    }
    if (!values.imageAlt.trim()) {
      context.addIssue({
        code: 'custom',
        path: ['imageAlt'],
        message: 'متن جایگزین تصویر الزامی است.',
      })
    }
  })

type Values = z.infer<typeof schema>
type Props = {
  record: RecordItem | null
  statuses: Status[]
  onClose: () => void
  onSubmit: (input: RecordInput) => void
}

const fieldClass = 'field grid gap-1.5 text-[13px] text-slate-600'
const errorClass = 'text-xs not-italic text-danger'

export function RecordFormDialog({ record, statuses, onClose, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', statusKey: '', imageUrl: '', imageAlt: '' },
  })
  useEffect(
    () =>
      reset({
        title: record?.title ?? '',
        description: record?.description ?? '',
        statusKey: record?.status.key ?? '',
        imageUrl: record?.image.url ?? '',
        imageAlt: record?.image.alt ?? '',
      }),
    [record, reset],
  )
  const submit = (values: Values) => {
    const status = statuses.find((item) => item.key === values.statusKey) ?? {
      key: values.statusKey,
      value: values.statusKey,
    }
    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      status,
      image: { url: values.imageUrl.trim(), alt: values.imageAlt.trim() },
    })
  }
  return (
    <AppDialog
      title={record ? 'ویرایش رکورد' : 'ایجاد رکورد جدید'}
      description="اطلاعات موردنیاز را وارد کنید."
      onClose={onClose}
    >
      <form className="grid gap-[15px]" onSubmit={handleSubmit(submit)} noValidate>
        <div className={fieldClass}>
          <Label htmlFor="title">عنوان *</Label>
          <Input id="title" {...register('title')} />
          {errors.title && <em className={errorClass}>{errors.title.message}</em>}
        </div>
        <div className={fieldClass}>
          <Label htmlFor="description">توضیحات (حداکثر ۲۵۵ کاراکتر)</Label>
          <textarea
            id="description"
            rows={5}
            maxLength={255}
            className={controlClassName}
            {...register('description')}
          />
          {errors.description && <em className={errorClass}>{errors.description.message}</em>}
        </div>
        <div className={fieldClass}>
          <Label htmlFor="status">وضعیت *</Label>
          <select id="status" className={controlClassName} {...register('statusKey')}>
            <option value="" disabled>
              وضعیت را انتخاب کنید
            </option>
            {statuses.map((status) => (
              <option key={status.key} value={status.key}>
                {status.value}
              </option>
            ))}
          </select>
          {errors.statusKey && <em className={errorClass}>{errors.statusKey.message}</em>}
        </div>
        <div className={fieldClass}>
          <Label htmlFor="imageUrl">آدرس تصویر</Label>
          <Input id="imageUrl" dir="ltr" {...register('imageUrl')} />
          {errors.imageUrl && <em className={errorClass}>{errors.imageUrl.message}</em>}
        </div>
        <div className={fieldClass}>
          <Label htmlFor="imageAlt">متن جایگزین تصویر</Label>
          <Input id="imageAlt" {...register('imageAlt')} />
          {errors.imageAlt && <em className={errorClass}>{errors.imageAlt.message}</em>}
        </div>
        <footer className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            انصراف
          </Button>
          <Button type="submit">{record ? 'ذخیره تغییرات' : 'ایجاد رکورد'}</Button>
        </footer>
      </form>
    </AppDialog>
  )
}
