'use client'
import { Box, Stack, Typography } from '@mui/material'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { DropdownItem } from 'lib/models/dropdown'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import RecipeTagsList from './RecipeTagsList'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import RecipeImage from './RecipeImage'
import Clickable from 'components/Atoms/Containers/Clickable'
import BorderedBox from 'components/Atoms/Boxes/BorderedBox'
import ScrollableBoxHorizontal from 'components/Atoms/Containers/ScrollableBoxHorizontal'

const RecipeLayout = ({ article, autoComplete, selectedOption }: { article: Recipe; autoComplete?: DropdownItem[]; selectedOption?: DropdownItem }) => {
  const tags = article.recipeTagsCollection.items ?? []
  const handleImageClicked = (item: Recipe) => {}

  return (
    <>
      <PageHeader text={article.title} />

      {article.summary && (
        <Box pb={4}>
          <Typography>{article.summary}</Typography>
        </Box>
      )}

      <Box>
        <Box display={'flex'} flexDirection={{ xs: 'column', sm: 'row' }} gap={{ xs: 2, md: 4, lg: 12 }}>
          <Box width={{ md: 400 }}>
            <Box>
              <Box>
                <Box display={'flex'}>
                  <Clickable
                    onClicked={() => {
                      handleImageClicked(article)
                    }}
                  >
                    <RecipeImage recipe={article} width={220} height={220} />
                  </Clickable>
                </Box>
              </Box>
              <Box py={2}>
                <RecipeTagsList tags={tags} />
              </Box>
            </Box>
          </Box>

          <Box my={-3}>{documentToReactComponents(article.richBody.json)}</Box>
        </Box>
      </Box>
    </>
  )
}

export default RecipeLayout
