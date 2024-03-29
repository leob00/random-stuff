import { Box } from '@mui/material'
import { siteMap } from 'components/Organizms/navigation/siteMap'
import SiteCategory from './SiteCategory'
import React from 'react'
import { sleep } from 'lib/util/timers'

const getResult = async () => {
  await sleep(3000)
  return siteMap()
}

async function SiteCageories() {
  const items = await getResult()
  return (
    <>
      {items.map((item) => (
        <React.Fragment key={item.category}>
          <Box>
            <SiteCategory category={item} />
          </Box>
        </React.Fragment>
      ))}
    </>
  )
}
export default SiteCageories
