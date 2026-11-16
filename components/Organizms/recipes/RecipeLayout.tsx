'use client'
import { Box, Link, ListItem, ListItemText, Typography } from '@mui/material'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer'
import { MARKS, BLOCKS, INLINES } from '@contentful/rich-text-types'
import RecipeTagsList from './RecipeTagsList'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import RecipeImage from './RecipeImage'
import List from '@mui/material/List'
import { useViewPortSize } from 'hooks/ui/useViewportSize'
import { ImageSize } from 'lib/backend/files/fileTypes'

const RecipeLayout = ({ article }: { article: Recipe }) => {
  const tags = article.recipeTagsCollection.items ?? []

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
        <Box component='code' sx={{ padding: '2px 4px', borderRadius: '4px' }}>
          {text}
        </Box>
      ),
    },
    renderNode: {
      // Map Paragraphs to MUI Typography
      [BLOCKS.PARAGRAPH]: (node, children) => (
        <Typography color='info' variant='body1'>
          {children}
        </Typography>
      ),
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

      [BLOCKS.OL_LIST]: (node, children) => (
        <List>
          <ListItemText color='info'>{children}</ListItemText>
        </List>
      ),
      [BLOCKS.UL_LIST]: (node, children) => (
        <List>
          <ListItemText color='info'>{children}</ListItemText>
        </List>
      ),

      [BLOCKS.LIST_ITEM]: (node, children) => (
        <ListItem color='info' sx={{ display: 'list-item', paddingLeft: 2, marginBottom: 1 }}>
          {children}
        </ListItem>
      ),

      //Map Hyperlinks to MUI Link
      [INLINES.HYPERLINK]: (node, children) => (
        <Link href={node.data.uri} target='_blank' rel='noopener noreferrer'>
          {children}
        </Link>
      ),
      // Example: Embedding an image or entry (optional)
      [BLOCKS.EMBEDDED_ASSET]: (node) => <Box component='img' src={node.data.target.fields.file.url} alt='Contentful Image' />,
    },
  }
  const { viewPortSize } = useViewPortSize()
  let imageSize: ImageSize = {
    height: 220,
    width: 220,
  }
  switch (viewPortSize) {
    case 'lg':
    case 'xl':
      imageSize.height = 320
      imageSize.width = 320
      break
    case 'md':
      imageSize.height = 280
      imageSize.width = 280
  }

  return (
    <>
      <PageHeader text={article.title} />
      {article.summary && (
        <Box pb={6}>
          <Typography color='primary' textAlign={{ xs: 'left', sm: 'center' }} variant='h6'>
            {article.summary}
          </Typography>
        </Box>
      )}

      <Box>
        <Box display={'flex'} flexDirection={{ xs: 'column', sm: 'row' }} gap={{ xs: 2, md: 3, lg: 6 }}>
          <Box width={imageSize.width}>
            <Box>
              <Box>
                <Box display={'flex'}>
                  <RecipeImage recipe={article} width={imageSize.width} height={imageSize.height} />
                </Box>
              </Box>
              <Box py={2}>
                <RecipeTagsList tags={tags} />
              </Box>
            </Box>
          </Box>

          <Box my={-1}>{documentToReactComponents(article.richBody.json, options)}</Box>
        </Box>
      </Box>
    </>
  )
}

export default RecipeLayout
