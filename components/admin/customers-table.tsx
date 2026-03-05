'use client'

import { Customer } from '@/lib/mock-data'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface CustomersTableProps {
  customers: Customer[]
}

export function CustomersTable({ customers }: CustomersTableProps) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="text-left px-6 py-4 font-semibold">Name</th>
              <th className="text-left px-6 py-4 font-semibold">Email</th>
              <th className="text-left px-6 py-4 font-semibold">Phone</th>
              <th className="text-left px-6 py-4 font-semibold">Orders</th>
              <th className="text-left px-6 py-4 font-semibold">Total Spent</th>
              <th className="text-left px-6 py-4 font-semibold">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 font-medium">
                  <Link href={`/admin/customers/${customer.id}`} className="hover:text-blue-600">
                    {customer.fullName}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{customer.email}</td>
                <td className="px-6 py-4 text-sm">{customer.phone}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                    {customer.totalOrders}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">KES {customer.totalSpent.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
