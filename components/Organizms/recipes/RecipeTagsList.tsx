'use client'
import { Box, Chip, Typography } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import Clickable from 'components/Atoms/Containers/Clickable'
import { RecipeTag } from 'lib/models/cms/contentful/recipe'
import { useRouter } from 'next/navigation'

const RecipeTagsList = ({ tags }: { tags: RecipeTag[] }) => {
  const router = useRouter()
  const handleTagClick = (tag: RecipeTag) => {
    router.push(`/general-interest/recipeTags/tag/${tag.id}`)
  }
  return (
    <>
      <Box display={'flex'} gap={2} flexDirection={'column'}>
        {tags.length > 0 && <Typography variant={'body2'} color={'primary'}>{`tags`}</Typography>}
        {tags.map((tag) => (
          <Box key={tag.id}>
            <PrimaryButton
              text={tag.name.length > 50 ? `${tag.name.substring(0, 35)}...` : tag.name}
              onClick={() => {
                handleTagClick(tag)
              }}
            />
            {/* <Clickable
              onClicked={() => {
                handleTagClick(tag)
              }}
            >
              <Chip variant='outlined' color='primary' label={tag.name.length > 50 ? `${tag.name.substring(0, 35)}...` : tag.name} />
            </Clickable> */}
          </Box>
        ))}
      </Box>
    </>
  )
}

export default RecipeTagsList
