import { usePathname } from "next/navigation"

export function useActiveRoute() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    return pathname === href
  }

  const isActivePrefix = (prefix: string) => {
    return pathname.startsWith(prefix)
  }

  return {
    pathname,
    isActive,
    isActivePrefix,
  }
}
