import React from 'react'
import CenterStack from '../CenterStack'
import HorizontalDivider from '../Dividers/HorizontalDivider'
import NavigationButton from './NavigationButton'

const CenteredNavigationButton = ({ text, route, showDivider = true }: { text: string; route: string; showDivider?: boolean }) => {
  return (
    <>
      <CenterStack sx={{ py: 2 }}>
        <NavigationButton route={route} text={text} variant='body1' />
      </CenterStack>
      {showDivider && <HorizontalDivider />}
    </>
  )
}

export default CenteredNavigationButton
