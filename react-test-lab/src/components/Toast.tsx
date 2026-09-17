import { Button } from './Button'

export type ToastTone = 'success' | 'error' | 'info'

export type ToastItem = {
  id: string
  message: string
  tone: ToastTone
}

type ToastViewportProps = {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div className="toast-viewport" aria-live="polite" aria-relevant="additions" data-testid="toast-viewport">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.tone}`}
          role="status"
          data-testid={`toast-${toast.tone}`}
        >
          <span>{toast.message}</span>
          <Button
            variant="ghost"
            aria-label="Dismiss notification"
            onClick={() => onDismiss(toast.id)}
            data-testid="toast-dismiss"
          >
            ×
          </Button>
        </div>
      ))}
    </div>
  )
}
