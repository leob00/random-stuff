import React from 'react'
import type { NextPage } from 'next'
import { GetStaticPaths, GetStaticProps } from 'next'
import type { YieldCurveData } from 'lib/model'
import { getYieldCurveData } from 'lib/yieldCurveRepo'
import YieldCurveLayout from 'components/YieldCurveLayout'

export const getStaticProps: GetStaticProps = async (context) => {
  var data = await getYieldCurveData()
  return {
    props: {
      data,
    },
  }
}

const YieldCurve: NextPage<{ data: YieldCurveData }> = ({ data }) => {
  return <YieldCurveLayout data={data} />
}

export default YieldCurve
