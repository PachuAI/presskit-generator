import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "../../lib/utils"

const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-[#2D2D2D] bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#8D6E63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#2D2D2D] dark:bg-[#1A1A1A] dark:ring-offset-[#0F0F0F] dark:placeholder:text-[#A0A0A0] dark:focus-visible:ring-[#FF6B35]",
  {
    variants: {
      variant: {
        default: "",
        destructive: "border-red-500 focus-visible:ring-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, variant, type, ...props }, ref) => {
  return <input type={type} className={cn(inputVariants({ variant, className }))} ref={ref} {...props} />
})
Input.displayName = "Input"

export { Input, inputVariants }
