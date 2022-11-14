import { Typography, Link, Box, Autocomplete, TextField, AutocompleteChangeReason, AutocompleteChangeDetails, Stack, Button, Divider } from '@mui/material'
import React from 'react'
import NLink from 'next/link'
import { Option } from 'lib/AutoCompleteOptions'
import router from 'next/router'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import RemoteImage from './Atoms/RemoteImage'
import InternalLinkButton from './Atoms/Buttons/InternalLinkButton'
import CenteredParagraph from './Atoms/Containers/CenteredParagraph'
import CenterStack from './Atoms/CenterStack'
import CenteredTitle from './Atoms/Containers/CenteredTitle'

const RecipesLayout = ({ autoComplete, baseUrl, featured }: { autoComplete: Option[]; baseUrl: string; featured: Recipe[] }) => {
  const handleSelect = (
    event: React.SyntheticEvent<Element, Event>,
    value: Option | null,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<Option> | undefined,
  ) => {
    let sel = value as Option
    router.push(`${baseUrl}${sel.id}`)
  }

  return (
    <Box>
      <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
        <Autocomplete
          size='small'
          onChange={handleSelect}
          disablePortal
          options={autoComplete}
          sx={{ width: 360 }}
          renderInput={(params) => <TextField {...params} placeholder={`search ${autoComplete.length} recipes`} />}
        />
      </Stack>
      <Box sx={{ my: 2 }}>
        <CenteredParagraph text='Top 10 Featured Recipes' />
        {featured.length > 0 &&
          featured.map((item, ix) => (
            <Box sx={{ paddingBottom: 2 }} key={item.title}>
              <CenterStack>
                <InternalLinkButton text={item.title} route={`${baseUrl}${item.sys.id}`} />
              </CenterStack>
              {item.summary && item.summary.length > 0 && <CenteredParagraph text={item.summary} />}
              <Stack direction='row' justifyContent='center' sx={{ marginBottom: 1 }}>
                {item.heroImage && (
                  <>
                    <NLink href={`${baseUrl}${item.sys.id}`} passHref legacyBehavior as={`${baseUrl}${item.sys.id}`}>
                      <Link href={`${baseUrl}${item.sys.id}`}>
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
