import { TableSkeleton } from '@/components/skeleton-loader'

export default function ProductsLoading() {
  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <div className="h-8 bg-muted rounded w-1/4 animate-pulse mb-2" />
        <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
      </div>
      <TableSkeleton />
    </div>
  )
}
