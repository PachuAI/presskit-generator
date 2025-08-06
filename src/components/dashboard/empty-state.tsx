import Link from 'next/link'
import { Button } from '../ui'

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
    <div className="text-center py-12">
      <div className="text-6xl mb-4 animate-pulse" aria-hidden="true">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2 font-itera-heading">
        {title}
      </h3>
      <p className="text-[#A0A0A0] font-itera-body mb-6 max-w-md mx-auto">
        {description}
      </p>
      {action && (
        <Link href={action.href}>
          <Button variant="outline">
            {action.label}
          </Button>
        </Link>
      )}
    </div>
  )
}