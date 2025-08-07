import Link from "next/link"
import { Button } from "../ui"

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <div className="mb-4 animate-pulse text-6xl" aria-hidden="true">
        {icon}
      </div>
      <h3 className="font-itera-heading mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="font-itera-body mx-auto mb-6 max-w-md text-[#A0A0A0]">{description}</p>
      {action && (
        <Link href={action.href}>
          <Button variant="outline">{action.label}</Button>
        </Link>
      )}
    </div>
  )
}
