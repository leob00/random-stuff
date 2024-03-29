import { Link, Box, Autocomplete, TextField, AutocompleteChangeReason, AutocompleteChangeDetails, Stack } from '@mui/material'
import React from 'react'
import NLink from 'next/link'
import { Option } from 'lib/AutoCompleteOptions'
import router from 'next/router'
import { Recipe } from 'lib/models/cms/contentful/recipe'
import RemoteImage from './Atoms/RemoteImage'
import CenteredParagraph from './Atoms/Text/CenteredParagraph'
import CenterStack from './Atoms/CenterStack'
import InternalLink from './Atoms/Buttons/InternalLink'
import CenteredTitle from './Atoms/Text/CenteredTitle'
import StaticAutoComplete from './Atoms/Inputs/StaticAutoComplete'
import { DropdownItem } from 'lib/models/dropdown'

const RecipesLayout = ({ autoComplete, baseUrl, featured }: { autoComplete: DropdownItem[]; baseUrl: string; featured: Recipe[] }) => {
  // const handleSelect = (
  //   event: React.SyntheticEvent<Element, Event>,
  //   value: Option | null,
  //   reason: AutocompleteChangeReason,
  //   details?: AutocompleteChangeDetails<Option> | undefined,
  // ) => {
  //   const selectedItem = { ...value }

  //   if (selectedItem.id) {
  //     router.push(`${baseUrl}${selectedItem.id}`)
  //   } else {
  //     console.error('error generating single recipe: ', selectedItem)
  //   }
  // }

  const handleSelected = (item: DropdownItem) => {
    router.push(`${baseUrl}${item.value}`)
  }

  return (
    <Box>
      <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
        {/* <Autocomplete
          size='small'
          onChange={handleSelect}
          disablePortal
          options={autoComplete}
          sx={{ width: 360 }}
          renderInput={(params) => <TextField {...params} placeholder={`search ${autoComplete.length} recipes`} />}
        /> */}
        <StaticAutoComplete options={autoComplete} placeholder={`search ${autoComplete.length} recipes`} onSelected={handleSelected} />
      </Stack>
      <Box sx={{ my: 2 }}>
        <CenteredTitle title={'Featured Recipes'} />
        {featured.length > 0 &&
          featured.map((item, ix) => (
            <Box sx={{ paddingBottom: 2 }} key={item.title}>
              <CenterStack>
                <InternalLink text={item.title} route={`${baseUrl}${item.sys.id}`} large />
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
