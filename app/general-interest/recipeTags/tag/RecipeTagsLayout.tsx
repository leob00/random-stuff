'use client'
import { Box } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import RecipeSmallTeaser from 'components/Organizms/recipes/RecipeSmallTeaser'
import RecipesSearch from 'components/Organizms/recipes/RecipesSearch'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import { DropdownItem } from 'lib/models/dropdown'
import { useRouter } from 'next/navigation'
import { RecipeTagPageModel } from './[slug]/page'

const RecipeTagsLayout = ({ data }: { data: RecipeTagPageModel }) => {
  const router = useRouter()

  return (
    <>
      <Box>
        <Box pb={4}>
          <CenterStack>
            {/* <StaticAutoComplete onSelected={handleSelected} options={allTags} placeholder={`search by ${allTags.length} categories`} /> */}
            <RecipesSearch autoComplete={data.autoComplete} />
          </CenterStack>
        </Box>
      </Box>
      <Box display={'flex'} gap={1} flexWrap={'wrap'} justifyContent={'center'}>
        {data.filtered.map((item) => (
          <Box key={item.sys.id}>
            <Box pb={2}>
              <RecipeSmallTeaser id={data.tag} item={item} imageHeight={160} imageWidth={140} />
            </Box>
          </Box>
        ))}
      </Box>
    </>
  )
}

export default RecipeTagsLayout
