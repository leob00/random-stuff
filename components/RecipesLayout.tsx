import { Typography, Link, Box, Autocomplete, TextField, AutocompleteChangeReason, AutocompleteChangeDetails, Stack, Button, Container } from '@mui/material'
import React from 'react'
import NLink from 'next/link'
import { Option } from 'lib/AutoCompleteOptions'
import router from 'next/router'
import Image from 'next/image'
import { Recipe, RecipeCollection } from 'lib/models/cms/contentful/recipe'
import ReactMarkdown from 'react-markdown'
import { orderBy } from 'lodash'
import RemoteImage from './Atoms/RemoteImage'
import { ModelTrainingTwoTone } from '@mui/icons-material'

const RecipesLayout = ({ recipeCollection, baseUrl, featured }: { recipeCollection: RecipeCollection; baseUrl: string; featured?: Recipe }) => {
  let options: Array<Option> = []
  orderBy(recipeCollection.items, ['title'], ['asc']).forEach((a) => {
    options.push({ label: a.title, id: a.sys.id })
  })

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
      <Box sx={{ my: 2 }}>
        <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
          <Typography variant='h6'>Featured Recipes</Typography>
        </Stack>
        {recipeCollection.topFeatured &&
          recipeCollection.topFeatured.map((item, ix) => (
            <Box sx={{ my: 2 }} key={item.title}>
              <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
                <Typography variant='body1'>
                  <NLink href={`${baseUrl}${item.sys.id}`} passHref>
                    <Button size='small'>{item.title}</Button>
                  </NLink>
                </Typography>
              </Stack>
              <Box sx={{ my: 2 }}>
                <Typography variant='body1' sx={{ paddingBottom: 2, textAlign: 'center' }}>
                  {item.summary}
                </Typography>
              </Box>
              <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
                {item.heroImage && (
                  <>
                    <NLink href={`${baseUrl}${item.sys.id}`} passHref>
                      <Link>
                        <Box sx={{ borderRadius: '.9rem', backgroundColor: 'transparent', padding: 0.2 }}>
                          {/* <Image alt={featured.title} style={{ borderRadius: '.8rem' }} src={featured.heroImage.url} placeholder='blur' height={featured.heroImage.height / 2} width={featured.heroImage.width / 2} blurDataURL={featured.heroImage.url} /> */}
                          <RemoteImage url={item.heroImage.url} title={item.title} />
                        </Box>
                      </Link>
                    </NLink>
                  </>
                )}
              </Stack>
            </Box>
          ))}
      </Box>
    </Box>
  )
}

export default RecipesLayout
