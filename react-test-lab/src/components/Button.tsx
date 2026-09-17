import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'danger' | 'ghost' | 'default'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}

const variantClass: Record<Variant, string> = {
  primary: 'btn btn-primary',
  danger: 'btn btn-danger',
  ghost: 'btn btn-ghost',
  default: 'btn',
}

export function Button({
  variant = 'default',
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={`${variantClass[variant]} ${className}`.trim()} {...rest}>
      {children}
    </button>
  )
}
