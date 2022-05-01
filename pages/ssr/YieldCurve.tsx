import React from 'react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import type { YieldCurveData } from 'lib/model'
import { getYieldCurveData } from 'lib/repo'
import YieldCurveLayout from 'components/YieldCurveLayout'

export const getServerSideProps: GetServerSideProps = async (context) => {
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
