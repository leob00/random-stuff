import { Box, Chip, Typography } from '@mui/material'
import Clickable from 'components/Atoms/Containers/Clickable'
import { RecipeTag } from 'lib/models/cms/contentful/recipe'
import { useRouter } from 'next/navigation'

const RecipeTagsList = ({ tags }: { tags: RecipeTag[] }) => {
  const router = useRouter()
  const handleTagClick = (tag: RecipeTag) => {
    router.push(`/ssg/recipes/tag/${tag.id}`)
  }
  return (
    <>
      <Box display={'flex'} gap={2} flexWrap={'wrap'} alignItems={'center'}>
        {tags.length > 0 && <Typography variant={'body2'} color={'primary'}>{`categories:`}</Typography>}

        {tags.map((tag) => (
          <Box key={tag.id}>
            <Clickable
              onClicked={() => {
                handleTagClick(tag)
              }}
            >
              <Chip variant='outlined' label={tag.name.length > 50 ? `${tag.name.substring(0, 35)}...` : tag.name} />
            </Clickable>
          </Box>
        ))}
      </Box>
    </>
  )
}

export default RecipeTagsList
