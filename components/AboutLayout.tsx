import React from 'react'
import type { YieldCurveData } from 'lib/model'
import Layout from './Layout'
import { Container } from '@mui/material'

const AboutLayout = ({ data }: { data: YieldCurveData }) => {
  return (
    <Layout>
      <Container>about</Container>
    </Layout>
  )
}

export default AboutLayout
