import { useId } from 'react'
import { Button } from './Button'

type FileUploadProps = {
  value?: string
  onChange: (dataUrl: string | undefined) => void
  error?: string
}

export function FileUpload({ value, onChange, error }: FileUploadProps) {
  const inputId = useId()

  return (
    <div className="field" data-testid="file-upload">
      <label htmlFor={inputId}>Thumbnail</label>
      <div className="upload-box">
        <input
          id={inputId}
          type="file"
          accept="image/*"
          data-testid="file-input"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) {
              onChange(undefined)
              return
            }
            if (!file.type.startsWith('image/')) {
              onChange(undefined)
              return
            }
            const reader = new FileReader()
            reader.onload = () => onChange(String(reader.result))
            reader.readAsDataURL(file)
          }}
        />
        <p className="field-hint">PNG or JPG. Preview appears below.</p>
        {value ? (
          <div>
            <img
              src={value}
              alt="Thumbnail preview"
              className="upload-preview"
              data-testid="file-preview"
            />
            <div className="btn-row" style={{ marginTop: '0.75rem' }}>
              <Button
                variant="ghost"
                onClick={() => onChange(undefined)}
                data-testid="file-clear"
              >
                Clear
              </Button>
            </div>
          </div>
        ) : null}
      </div>
      {error ? (
        <span className="field-error" role="alert" data-testid="file-error">
          {error}
        </span>
      ) : null}
    </div>
  )
}
