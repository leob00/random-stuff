import { Box, Typography } from '@mui/material'
import { Paths } from 'components/Organizms/navigation/siteMap'
import SiteLink from './SiteLink'

function SiteCategory({ category }: { category: Paths }) {
  return (
    <>
      <Box display={'flex'} justifyContent={'center'} pb={2}>
        <Typography variant='h5'>{category.category}</Typography>
      </Box>
      <Box display={'flex'} gap={2} flexWrap={'wrap'} justifyContent={'center'} pb={2}>
        {category.paths.map((path) => (
          <SiteLink key={path.route} href={path.route} text={path.name} />
        ))}
      </Box>
    </>
  )
}
export default SiteCategory
