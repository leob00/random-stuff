import {
  Link,
  Box,
  Autocomplete,
  TextField,
  AutocompleteChangeReason,
  AutocompleteChangeDetails,
  Stack,
  Typography,
  Card,
  CardHeader,
  CardContent,
} from '@mui/material'
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
import CenteredHeader from './Atoms/Boxes/CenteredHeader'

const RecipesLayout = ({ autoComplete, baseUrl, featured }: { autoComplete: DropdownItem[]; baseUrl: string; featured: Recipe[] }) => {
  const handleSelected = (item: DropdownItem) => {
    router.push(`${baseUrl}${item.value}`)
  }

  return (
    <Box>
      <Stack direction='row' justifyContent='center' sx={{ my: 2 }}>
        <StaticAutoComplete options={autoComplete} placeholder={`search ${autoComplete.length} recipes`} onSelected={handleSelected} />
      </Stack>
      <Box sx={{ my: 2 }}>
        <CenterStack sx={{ pb: 4 }}>
          <Typography variant='h4'>{'Featured Recipes'}</Typography>
        </CenterStack>
        {featured.map((item, ix) => (
          <Box key={item.title} py={2}>
            <Card elevation={2}>
              <CardHeader
                title={
                  <CenterStack>
                    <InternalLink text={item.title} route={`${baseUrl}${item.sys.id}`} large />
                  </CenterStack>
                }
              />
              <CardContent>
                {item.summary && item.summary.length > 0 && (
                  <CenterStack sx={{ pb: 2 }}>
                    <Typography>{item.summary}</Typography>
                  </CenterStack>
                )}
                <Stack direction='row' justifyContent='center' sx={{ marginBottom: 1 }}>
                  {item.heroImage && (
                    <Card elevation={4} sx={{ borderRadius: '16px' }}>
                      <NLink href={`${baseUrl}${item.sys.id}`} passHref legacyBehavior as={`${baseUrl}${item.sys.id}`}>
                        <Link href={`${baseUrl}${item.sys.id}`}>
                          <Box>
                            <RemoteImage url={item.heroImage.url} title={item.title} />
                          </Box>
                        </Link>
                      </NLink>
                    </Card>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default RecipesLayout
