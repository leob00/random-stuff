import { Box, Card, CardContent, Stack } from '@mui/material'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import React from 'react'
import { Paths } from './siteMap'

const GroupedHomeMenu = ({ pathCategories }: { pathCategories: Paths[] }) => {
  return (
    <Box>
      {pathCategories.map((category) => (
        <Box key={category.category} pb={2}>
          <Card>
            <CardContent>
              <CenteredTitle title={category.category} variant='h4' />
              <Box display={'flex'} justifyContent={'center'}>
                <Box display={'flex'} gap={1}>
                  {category.paths.map((path) => (
                    <Box key={path.route}>
                      <NavigationButton route={path.route} text={path.name} variant={'h5'} />
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      ))}
    </Box>
  )
}

export default GroupedHomeMenu
