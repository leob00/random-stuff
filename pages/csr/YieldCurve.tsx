import React from 'react'
import type { NextPage } from 'next'
import type { YieldCurveData } from 'lib/model'
import YieldCurveLayout from 'components/YieldCurveLayout'

const YieldCurve: NextPage = () => {
  const [data, setData] = React.useState<YieldCurveData>({ rows: [] })

  React.useEffect(() => {
    const fn = async () => {
      const result = await fetch('/api/yieldCurve', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      setData(await result.json())
    }
    fn()
  }, [])

  return <YieldCurveLayout data={data} />
}

export default YieldCurve
