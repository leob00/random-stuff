'use client'
import { useEffect, useState } from 'react'

type Indicator = { id: string; name: string; value?: string }

export default function EconomicIndicatorsPage() {
  const [data, setData] = useState<Indicator[] | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/remoteFiles.json')
        const json = await res.json()
        const keys = Object.keys(json || {})
        const indicators = keys.slice(0, 12).map((k, i) => ({ id: String(i + 1), name: k, value: String((json as any)[k]) }))
        if (mounted) setData(indicators)
      } catch (err) {
        console.error('Failed to load indicators', err)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div style={{ padding: 20, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <h1>Economic Indicators (CSR)</h1>
      <p>This page is client-side rendered and fetches sample data.</p>
      {!data ? (
        <p>Loading indicators…</p>
      ) : (
        <ul>
          {data.map((ind) => (
            <li key={ind.id}>
              <strong>{ind.name}</strong>: {ind.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
