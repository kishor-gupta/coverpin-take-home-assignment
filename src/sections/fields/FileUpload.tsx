import type { UploadedFile } from '../../types/order'

const MAX_BYTES = 1.5 * 1024 * 1024

interface FileUploadProps {
  id: string
  label: string
  value: UploadedFile | null
  onChange: (value: UploadedFile | null) => void
  error?: string
  helpText?: string
  disabled?: boolean
}

function readFile(file: File): Promise<UploadedFile> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_BYTES) {
      reject(new Error('File must be 1.5 MB or smaller.'))
      return
    }
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read that file.'))
    reader.onload = () => {
      resolve({
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: String(reader.result ?? ''),
      })
    }
    reader.readAsDataURL(file)
  })
}

export function FileUpload({
  id,
  label,
  value,
  onChange,
  error,
  helpText,
  disabled,
}: FileUploadProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-stone-800">
        {label}
      </label>
      <input
        id={id}
        type="file"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (!file) {
            onChange(null)
            return
          }
          void readFile(file)
            .then(onChange)
            .catch((caught: unknown) => {
              onChange(null)
              window.alert(caught instanceof Error ? caught.message : 'Upload failed')
            })
        }}
        aria-invalid={Boolean(error)}
        className="w-full rounded-md border border-dashed border-stone-300 bg-white px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-stone-900 file:px-2 file:py-1 file:text-xs file:text-white disabled:bg-stone-100"
      />
      {value ? (
        <p className="text-xs text-stone-600">
          Attached: {value.name} ({Math.max(1, Math.round(value.size / 1024))} KB)
        </p>
      ) : null}
      {helpText ? <p className="text-xs text-stone-500">{helpText}</p> : null}
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  )
}
