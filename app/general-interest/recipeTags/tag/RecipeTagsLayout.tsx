'use client'
import { Box } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import RecipeSmallTeaser from 'components/Organizms/recipes/RecipeSmallTeaser'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import { DropdownItem } from 'lib/models/dropdown'
import { useRouter } from 'next/navigation'

const RecipeTagsLayout = ({
  tag,
  allTags,
  filteredRecipes,
  allRecipes,
}: {
  tag: string
  allTags: DropdownItem[]
  filteredRecipes: Recipe[]
  allRecipes?: DropdownItem[]
}) => {
  const router = useRouter()
  const handleSelected = (item: DropdownItem) => {
    if (item.value.includes('tag:')) {
      const split = item.value.split(':')
      router.push(`/general-interest/recipeTags/tag/${split[1]}`)
    } else {
      router.push(`/general-interest/recipes/${item.value}`)
    }
  }
  return (
    <>
      <Box>
        <Box pb={4}>
          <CenterStack>
            <StaticAutoComplete onSelected={handleSelected} options={allTags} placeholder={`search by ${allTags.length} categories`} />
          </CenterStack>
        </Box>
      </Box>
      <Box display={'flex'} gap={1} flexWrap={'wrap'} justifyContent={'center'}>
        {filteredRecipes.map((item) => (
          <Box key={item.sys.id}>
            <Box pb={2}>
              <RecipeSmallTeaser id={tag} item={item} imageHeight={160} imageWidth={140} />
            </Box>
          </Box>
        ))}
      </Box>
    </>
  )
}

export default RecipeTagsLayout
