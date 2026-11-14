import { Box, Typography } from '@mui/material'
import SiteLink from 'components/app/server/Atoms/Links/SiteLink'
import { RecipeTag } from 'lib/models/cms/contentful/recipe'

const RecipeTagsList = ({ tags }: { tags: RecipeTag[] }) => {
  return (
    <>
      {tags.length > 0 && (
        <Box pb={1}>
          <Typography variant='caption'>related links:</Typography>
        </Box>
      )}
      <Box display={'flex'} gap={2} flexDirection={'column'}>
        {tags.map((tag) => (
          <Box key={tag.id}>
            <SiteLink
              variant='body1'
              text={tag.name.length > 50 ? `${tag.name.substring(0, 35).toLowerCase()}...` : tag.name.toLowerCase()}
              href={`/general-interest/recipeTags/tag/${tag.id}`}
            />
          </Box>
        ))}
      </Box>
    </>
  )
}

export default RecipeTagsList
