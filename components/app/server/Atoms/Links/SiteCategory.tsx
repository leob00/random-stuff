import { Box, Typography } from '@mui/material'
import { SiteCategories, siteMap } from 'components/Organizms/navigation/siteMap'
import { sleep } from 'lib/util/timers'
import SiteLink from './SiteLink'

const getResult = async (category: SiteCategories) => {
  await sleep(1000)

  return siteMap().find((m) => m.category === category)!
}

async function SiteCategory({ category }: { category: SiteCategories }) {
  const item = await getResult(category)
  return (
    <>
      <Box display={'flex'} justifyContent={'center'} pb={2}>
        <Typography variant='h5'>{item.category}</Typography>
      </Box>
      <Box display={'flex'} gap={2} flexWrap={'wrap'} justifyContent={'center'} pb={2}>
        {item.paths.map((path) => (
          <SiteLink key={path.route} href={path.route} text={path.name} />
        ))}
      </Box>
    </>
  )
}
export default SiteCategory
