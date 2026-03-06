import { ProtectedAdmin } from '@/components/protected-admin'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedAdmin>{children}</ProtectedAdmin>
}
