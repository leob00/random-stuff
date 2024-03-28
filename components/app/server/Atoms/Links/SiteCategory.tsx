import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import { SiteCategories, siteMap } from 'components/Organizms/navigation/siteMap'
import { sleep } from 'lib/util/timers'
import { Suspense } from 'react'

const getResult = async (category: SiteCategories) => {
  await sleep(1000)

  return siteMap().find((m) => m.category === category)!
}

async function SiteCategory({ category }: { category: SiteCategories }) {
  const item = await getResult(category)
  return (
    <>
      <>
        <Box key={item.category}>
          {/* <SiteCategory category={item.category} /> */}
          <CenterStack>
            <Typography variant='h5'>{item.category}</Typography>
          </CenterStack>
        </Box>
      </>
    </>
  )
}
export default SiteCategory
