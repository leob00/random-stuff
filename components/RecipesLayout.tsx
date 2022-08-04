import { Typography, Link, Box, Autocomplete, TextField, AutocompleteChangeReason, AutocompleteChangeDetails, Stack, Button, Divider } from '@mui/material'
import React from 'react'
import NLink from 'next/link'
import { Option } from 'lib/AutoCompleteOptions'
import router from 'next/router'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import RemoteImage from './Atoms/RemoteImage'
import InternalLinkButton from './Atoms/Buttons/InternalLinkButton'

const RecipesLayout = ({ autoComplete, baseUrl, featured }: { autoComplete: Option[]; baseUrl: string; featured: Recipe[] }) => {
  //let options: Array<Option> = []

  /* orderBy(recipeCollection.items, ['title'], ['asc']).forEach((a) => {
    options.push({ label: a.title, id: a.sys.id })
  }) */

  const handleSelect = (event: React.SyntheticEvent<Element, Event>, value: Option | null, reason: AutocompleteChangeReason, details?: AutocompleteChangeDetails<Option> | undefined) => {
    let sel = value as Option
    //console.log(sel.id)
    router.push(`${baseUrl}${sel.id}`)
  }

  return (
    <Box>
      <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
        <Autocomplete size='small' onChange={handleSelect} disablePortal options={autoComplete} sx={{ width: 360 }} renderInput={(params) => <TextField {...params} placeholder={`search ${autoComplete.length} recipes`} />} />
      </Stack>
      <Box sx={{ my: 2 }}>
        {featured.length > 0 &&
          featured.map((item, ix) => (
            <Box sx={{ marginTop: 2, paddingBottom: 8 }} key={item.title}>
              <Stack direction='row' justifyContent='center'>
                <InternalLinkButton text={item.title} route={`${baseUrl}${item.sys.id}`} />
              </Stack>
              {item.summary && item.summary.length > 0 && (
                <Box sx={{ my: 1 }}>
                  <Typography variant='body1' sx={{ paddingBottom: 1, textAlign: 'center' }}>
                    {item.summary}
                  </Typography>
                </Box>
              )}
              <Stack direction='row' justifyContent='center' sx={{ marginBottom: 1 }}>
                {item.heroImage && (
                  <>
                    <NLink href={`${baseUrl}${item.sys.id}`} passHref>
                      <Link>
                        <Box sx={{ borderRadius: '.9rem', backgroundColor: 'transparent', padding: 0.2 }}>
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
