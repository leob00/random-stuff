import React from 'react'
import CenterStack from '../CenterStack'

const CircleLoader = () => {
  return (
    <CenterStack sx={{ py: 1 }}>
      <img src={'/images/loaders/blue-ring-expanded.svg'} alt='loader' />
      <img src={'/images/loaders/blue-ring-expanded-delayed.svg'} alt='loader' />
      <img src={'/images/loaders/blue-ring-expanded.svg'} alt='loader' />
    </CenterStack>
  )
}

export default CircleLoader
