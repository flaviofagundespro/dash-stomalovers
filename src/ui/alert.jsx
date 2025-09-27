import React from 'react'

export function Alert({ children, className = '', variant = 'default', ...props }) {
  const baseClasses = 'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground'
  
  const variants = {
    default: 'bg-background text-foreground',
    destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive'
  }
  
  const variantClass = variants[variant] || variants.default
  
  return (
    <div 
      className={`${baseClasses} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function AlertDescription({ children, className = '', ...props }) {
  return (
    <div 
      className={`text-sm [&_p]:leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
