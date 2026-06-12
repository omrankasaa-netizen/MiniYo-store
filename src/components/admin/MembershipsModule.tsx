import { useAdminCustomers } from '@/hooks/useMiniyo'

export function MembershipsModule() {
  const { data: customers, isLoading } = useAdminCustomers() as any
  const registered = (customers ?? []).filter((c: any) => c.type === 'registered')

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="text-2xl mb-1">👥</div>
          <div className="text-3xl font-bold tabular-nums">{isLoading ? '—' : registered.length}</div>
          <div className="text-sm text-gray-500">Registered Members</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="text-2xl mb-1">🛒</div>
          <div className="text-3xl font-bold tabular-nums">{isLoading ? '—' : (customers ?? []).length - registered.length}</div>
          <div className="text-sm text-gray-500">Guest Customers</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="text-2xl mb-1">📊</div>
          <div className="text-3xl font-bold tabular-nums">{isLoading ? '—' : (customers ?? []).length}</div>
          <div className="text-sm text-gray-500">Total Customers</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Registered Members</h2>
        </div>
        {isLoading ? (
          <div className="p-6 space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : !registered.length ? (
          <div className="p-10 text-center text-gray-400"><div className="text-3xl mb-2">👤</div><p>No registered members yet</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Name', 'Email', 'Phone', 'Joined'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {registered.map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="px-4 py-3 text-gray-600">{c.email || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{c.phone || '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
