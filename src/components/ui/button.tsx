import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-[#0F0F0F] dark:focus-visible:ring-[#FF6B35]",
  {
    variants: {
      variant: {
        default: "bg-[#FF6B35] text-white hover:bg-[#FF5722] dark:bg-[#FF6B35] dark:text-white dark:hover:bg-[#FF5722]",
        destructive:
          "bg-[#F44336] text-white hover:bg-[#D32F2F] dark:bg-[#F44336] dark:text-white dark:hover:bg-[#D32F2F]",
        outline:
          "border border-[#2D2D2D] bg-transparent hover:bg-[#2D2D2D] hover:text-white text-[#FF6B35] dark:border-[#2D2D2D] dark:bg-transparent dark:hover:bg-[#2D2D2D] dark:hover:text-white",
        secondary:
          "bg-[#2D2D2D] text-white hover:bg-[#1A1A1A] dark:bg-[#2D2D2D] dark:text-white dark:hover:bg-[#1A1A1A]",
        ghost: "hover:bg-[#2D2D2D] hover:text-white text-[#FF6B35] dark:hover:bg-[#2D2D2D] dark:hover:text-white",
        link: "text-[#FF6B35] underline-offset-4 hover:underline dark:text-[#FF6B35]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
