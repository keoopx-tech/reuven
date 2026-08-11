import { type InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, hint, className, id, ...rest }, ref) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-navy">
            {label}
            {rest.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full px-3.5 py-3 rounded-xl border font-poppins text-base bg-bg text-gray-900',
            'transition-all duration-150 placeholder:text-gray-400',
            'focus:outline-none focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/10',
            error ? 'border-red-400' : 'border-gray-200',
            className
          )}
          {...rest}
        />
        {hint && !error && <span className="text-xs text-gray-500">{hint}</span>}
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    )
  }
)
Input.displayName = 'Input'
