import { Typography, Link, Box, Autocomplete, TextField, AutocompleteChangeReason, AutocompleteChangeDetails, Stack, Button, Container } from '@mui/material'
import React from 'react'
import NLink from 'next/link'
import { Option } from 'lib/AutoCompleteOptions'
import router from 'next/router'
import Image from 'next/image'
import { Recipe, RecipeCollection } from 'lib/models/cms/contentful/recipe'
import ReactMarkdown from 'react-markdown'
import { orderBy } from 'lodash'

const RecipesLayout = ({ recipeCollection, baseUrl, featured }: { recipeCollection: RecipeCollection; baseUrl: string; featured?: Recipe }) => {
  let options: Array<Option> = []
  orderBy(recipeCollection.items, ['title'], ['asc']).forEach((a) => {
    options.push({ label: a.title, id: a.sys.id })
  })

  function getWindowDimensions() {
    const hasWindow = typeof window !== 'undefined'
    if (hasWindow) {
      const { innerWidth: width, innerHeight: height } = window
      return {
        width,
        height,
      }
    }
    return {
      width: 500,
      height: 500,
    }
  }
  /* let dimension = getWindowDimensions()
  console.log(`window width: ${dimension.width} image width: ${featuredArticle?.fileMeta?.width}`)
  let imageWidth = 500
  let imageHeight = 500
  if (featuredArticle && featuredArticle.fileMeta) {
    let w = featuredArticle.fileMeta.width
    let h = featuredArticle.fileMeta.height
    if (dimension.width < w) {
      imageWidth = w / 3
      imageHeight = h / 3
    }
  } */

  const handleSelect = (event: React.SyntheticEvent<Element, Event>, value: Option | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<Option> | undefined) => {
    let sel = value as Option
    //console.log(sel.id)
    router.push(`${baseUrl}${sel.id}`)
  }

  return (
    <Box>
      <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
        <Autocomplete size='small' onChange={handleSelect} disablePortal options={options} sx={{ width: 360 }} renderInput={(params) => <TextField {...params} placeholder={`search over ${options.length} recipes`} />} />
      </Stack>
      {featured && (
        <Box sx={{ my: 2 }}>
          <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
            <Typography variant='h6'>Featured Recipe</Typography>
          </Stack>
          <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
            <Typography variant='body1'>
              <NLink href={`${baseUrl}${featured.sys.id}`} passHref>
                <Button size='small'>{featured.title}</Button>
              </NLink>
            </Typography>
          </Stack>
          <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
            {featured.heroImage && (
              <>
                <NLink href={`${baseUrl}${featured.sys.id}`} passHref>
                  <Link>
                    <Box sx={{ borderRadius: '.9rem', backgroundColor: 'transparent', padding: 0.2 }}>
                      <Image alt={featured.title} style={{ borderRadius: '.8rem' }} src={featured.heroImage.url} placeholder='blur' height={featured.heroImage.height / 2} width={featured.heroImage.width / 2} blurDataURL={featured.heroImage.url} />
                    </Box>
                  </Link>
                </NLink>
              </>
            )}
          </Stack>
          <Container sx={{ textAlign: 'center', my: 2 }}>
            <Typography variant='body1' sx={{ paddingBottom: 2, paddingLeft: 20, paddingRight: 20 }}>
              {featured.summary}
            </Typography>
          </Container>
        </Box>
      )}
    </Box>
  )
}

export default RecipesLayout
