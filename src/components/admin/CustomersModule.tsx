import { useState } from 'react'
import { useAdminCustomers } from '@/hooks/useMiniyo'

export function CustomersModule() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<any>(null)
  const { data: customers, isLoading, refetch } = useAdminCustomers(search || undefined) as any

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input
          type="search"
          placeholder="Search customers…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01696f]/30"
        />
        <button onClick={() => refetch()} className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">↻</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : !customers?.length ? (
          <div className="p-12 text-center text-gray-400">
            <div className="text-4xl mb-3">👥</div>
            <p>No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Name', 'Email', 'Phone', 'Type', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(customers as any[]).map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="px-4 py-3 text-gray-600">{c.email || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{c.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        c.type === 'registered' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>{c.type}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(c)}
                        className="text-[#01696f] hover:underline text-xs font-medium"
                      >View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">{selected.name}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Email:</span> {selected.email || '—'}</p>
              <p><span className="text-gray-500">Phone:</span> {selected.phone || '—'}</p>
              <p><span className="text-gray-500">Type:</span> {selected.type}</p>
              <p><span className="text-gray-500">Joined:</span> {new Date(selected.createdAt).toLocaleString()}</p>
              {selected.addresses && (
                <div>
                  <span className="text-gray-500">Addresses:</span>
                  <pre className="text-xs bg-gray-50 rounded p-2 mt-1 whitespace-pre-wrap">
                    {JSON.stringify(selected.addresses, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
