'use client'
import { Box, Typography } from '@mui/material'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer'
import { MARKS, BLOCKS } from '@contentful/rich-text-types'
import RecipeTagsList from './RecipeTagsList'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import RecipeImage from './RecipeImage'
import Clickable from 'components/Atoms/Containers/Clickable'

const RecipeLayout = ({ article }: { article: Recipe }) => {
  const tags = article.recipeTagsCollection.items ?? []
  const handleImageClicked = (item: Recipe) => {}

  const options: Options = {
    renderMark: {
      [MARKS.BOLD]: (text) => (
        <Typography component='span' fontWeight='bold'>
          {text}
        </Typography>
      ),
      [MARKS.ITALIC]: (text) => <Typography component='span'>{text}</Typography>,
      [MARKS.UNDERLINE]: (text) => (
        <Typography component='span' sx={{ textDecoration: 'underline' }}>
          {text}
        </Typography>
      ),
      [MARKS.CODE]: (text) => (
        <Box component='code' sx={{ backgroundColor: '#f4f4f4', padding: '2px 4px', borderRadius: '4px' }}>
          {text}
        </Box>
      ),
    },
    renderNode: {
      // Map Paragraphs to MUI Typography
      [BLOCKS.PARAGRAPH]: (node, children) => <Typography variant='body1'>{children}</Typography>,
      // Map Headings to MUI Typography
      [BLOCKS.HEADING_1]: (node, children) => (
        <Typography variant='h1' component='h1' gutterBottom>
          {children}
        </Typography>
      ),
      [BLOCKS.HEADING_2]: (node, children) => (
        <Typography variant='h2' component='h2' gutterBottom>
          {children}
        </Typography>
      ),
      [BLOCKS.HEADING_3]: (node, children) => <Typography variant='h4'>{children}</Typography>,
      [BLOCKS.HEADING_4]: (node, children) => <Typography variant='h4'>{children}</Typography>,
      [BLOCKS.HEADING_5]: (node, children) => <Typography variant='h4'>{children}</Typography>,
      [BLOCKS.HEADING_6]: (node, children) => <Typography variant='h4'>{children}</Typography>,
      [BLOCKS.LIST_ITEM]: (node, children) => (
        <Typography py={1} variant='h2'>
          {children}
        </Typography>
      ),

      // Map Hyperlinks to MUI Link
      // [INLINES.HYPERLINK]: (node, children) => (
      //   <Link href={node.data.uri} target='_blank' rel='noopener noreferrer'>
      //     {children}
      //   </Link>
      // ),
      // Example: Embedding an image or entry (optional)
      [BLOCKS.EMBEDDED_ASSET]: (node) => <Box component='img' src={node.data.target.fields.file.url} alt='Contentful Image' />,
    },
  }

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
                  <RecipeImage recipe={article} width={220} height={220} />
                </Box>
              </Box>
              <Box py={2}>
                <RecipeTagsList tags={tags} />
              </Box>
            </Box>
          </Box>

          <Box my={-3}>{documentToReactComponents(article.richBody.json, options)}</Box>
        </Box>
      </Box>
    </>
  )
}

export default RecipeLayout
