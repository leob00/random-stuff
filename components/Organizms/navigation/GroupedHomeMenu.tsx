import { Box, Card, CardContent, Stack } from '@mui/material'
import NavigationButton from 'components/Atoms/Buttons/NavigationButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import React from 'react'
import { Paths } from './siteMap'

const GroupedHomeMenu = ({ pathCategories }: { pathCategories: Paths[] }) => {
  return (
    <>
      {pathCategories.map((category) => (
        <Box key={category.category} pb={2}>
          <Card>
            <CardContent>
              <CenteredTitle title={category.category} variant='h4' />
              <Box display={'flex'} justifyContent={'center'}>
                <Box display={'flex'} alignItems={'flex-start'} gap={1}>
                  {category.paths.map((path) => (
                    <Stack key={path.route}>
                      <NavigationButton route={path.route} text={path.name} variant={'h5'} />
                    </Stack>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      ))}
    </>
  )
}

export default GroupedHomeMenu
