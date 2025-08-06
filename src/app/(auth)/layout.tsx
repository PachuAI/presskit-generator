export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#1A1A1A] dark:bg-[#0F0F0F]">
      {children}
    </div>
  )
}