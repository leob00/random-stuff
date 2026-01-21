'use client'
import { Box, Typography } from '@mui/material'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { DropdownItem } from 'lib/models/dropdown'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import RecipeTagsList from './RecipeTagsList'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import RecipeImage from './RecipeImage'
import Clickable from 'components/Atoms/Containers/Clickable'

const RecipeLayout = ({ article, autoComplete, selectedOption }: { article: Recipe; autoComplete?: DropdownItem[]; selectedOption?: DropdownItem }) => {
  const tags = article.recipeTagsCollection.items ?? []
  const handleImageClicked = (item: Recipe) => {}

  return (
    <>
      <PageHeader text={article.title} />

      {article.summary && (
        <Box py={2}>
          <FadeIn>
            <Typography textAlign={'center'}>{article.summary}</Typography>
          </FadeIn>
        </Box>
      )}

      <Box display={'flex'}>
        <Clickable
          onClicked={() => {
            handleImageClicked(article)
          }}
        >
          <RecipeImage recipe={article} width={220} height={220} />
        </Clickable>
      </Box>
      <Box py={2}>
        <RecipeTagsList tags={tags} />
      </Box>
      <Box px={2}>{documentToReactComponents(article.richBody.json)}</Box>
    </>
  )
}

export default RecipeLayout
