import React from 'react'
import HorizontalDivider from '../Dividers/HorizontalDivider'
import BoxSkeleton from './BoxSkeleton'

const LargeGridSkeleton = () => {
  return (
    <>
      <BoxSkeleton height={100} />
      <HorizontalDivider />
      <BoxSkeleton height={100} />
      <HorizontalDivider />
      <BoxSkeleton height={100} />
      <HorizontalDivider />
      <BoxSkeleton height={100} />
    </>
  )
}

export default LargeGridSkeleton
