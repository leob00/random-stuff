import { Box, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import { SiteCategories, siteMap } from 'components/Organizms/navigation/siteMap'
import { sleep } from 'lib/util/timers'
import { Suspense } from 'react'
import SiteCategory from './SiteCategory'

const getResult = async () => {
  await sleep(3000)
  return siteMap()
}

async function SiteCageories() {
  const items = await getResult()
  return (
    <>
      <>
        {items.map((item) => (
          <Box key={item.category}>
            {/* <SiteCategory category={item.category} /> */}
            {/* <CenterStack>
              <Typography variant='h5'>{item.category}</Typography>
            </CenterStack> */}
            <Suspense fallback={<Box>loading...</Box>}>
              <SiteCategory category={item.category} />
            </Suspense>
          </Box>
        ))}
      </>
    </>
  )
}
export default SiteCageories
