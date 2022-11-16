import { Box, Container, Link, Stack, Typography } from '@mui/material'
import SecondaryButton from 'components/Atoms/Buttons/SecondaryButton'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import DropDownList from 'components/Atoms/Inputs/DropdownList'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import WarmupBox from 'components/Atoms/WarmupBox'
import SavedNoteButtonLink from 'components/Molecules/Buttons/SavedNoteButtonLink'
import SaveToNotesButton from 'components/Molecules/Buttons/SaveToNotesButton'
import NonSSRWrapper from 'components/Organizms/NonSSRWrapper'
import { CasinoPinkTransparent, CasinoRedTransparent } from 'components/themes/mainTheme'
import { useUserController } from 'hooks/userController'
import { constructUserNotePrimaryKey } from 'lib/backend/api/aws/util'
import { NewsItem, NewsTypeIds, newsTypes } from 'lib/backend/api/qln/qlnApi'
import { axiosGet } from 'lib/backend/api/qln/useAxios'
import { UserNote } from 'lib/models/randomStuffModels'
import { getUtcNow } from 'lib/util/dateUtil'
import { cloneDeep, findLast, orderBy } from 'lodash'
import React from 'react'

const NewsLayout = () => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [newsItems, setNewsItems] = React.useState<NewsItem[]>([])
  const [showError, setShowError] = React.useState(false)
  const userController = useUserController()

  const loadData = async (id: NewsTypeIds) => {
    try {
      const result = (await axiosGet(`/api/news?id=${id}`)) as NewsItem[]
      const sorted = orderBy(result, ['PublishDate'], ['desc'])
      if (userController.authProfile) {
        userController.authProfile.noteTitles.forEach((note) => {
          sorted.forEach((newsItem) => {
            if (newsItem.Headline === note.title) {
              newsItem.Saved = true
            }
          })
        })
      }
      setNewsItems(sorted)
    } catch (err) {
      console.log('error in news api.')
      setShowError(true)
    }
    setIsLoading(false)
  }
  const handleNewsSourceSelected = async (id: string) => {
    setIsLoading(true)
    await loadData(id as NewsTypeIds)
  }
  const handleSaved = async (note: UserNote) => {}

  React.useEffect(() => {
    const fn = async () => {
      await loadData('GoogleTopStories')
    }
    fn()
  }, [])
  return (
    <Container>
      <NonSSRWrapper>
        <Box py={2}>
          <CenterStack>
            <Stack display='flex' flexDirection='row' gap={2}>
              <DropDownList options={newsTypes} selectedOption={'GoogleTopStories'} onOptionSelected={handleNewsSourceSelected} label='source' />
            </Stack>
          </CenterStack>
        </Box>
        <Box py={2}>
          {isLoading ? (
            <WarmupBox />
          ) : (
            <Box sx={{ maxHeight: 580, overflowY: 'auto' }}>
              {showError && <ErrorMessage text='There is an error that occurred. We have been made aware of it. Please try again in a few minutes.' />}
              {newsItems.map((item, i) => (
                <Box key={i} pb={2}>
                  <Typography>
                    <Link href={item.Link} target='_blank' color='primary' sx={{ fontWeight: 700 }}>
                      {item.Headline}
                    </Link>
                  </Typography>
                  {item.Description && item.Source && item.Source !== 'HackerNews' && (
                    <Typography variant='body1' color='primary' dangerouslySetInnerHTML={{ __html: item.Description }}></Typography>
                  )}
                  {item.TeaserImageUrl && item.TeaserImageUrl.length > 0 && (
                    <Box pt={1}>
                      <img src={item.TeaserImageUrl} title='' width={200} style={{ borderRadius: '16px' }} alt={item.TeaserImageUrl} />
                    </Box>
                  )}
                  {userController.username && (
                    <Box width={'75%'}>
                      <Stack pl={6} py={2} direction='row-reverse'>
                        {!item.Saved ? (
                          <SaveToNotesButton
                            username={userController.username}
                            note={{
                              title: item.Headline!,
                              body: item.Description ?? '',
                              dateCreated: getUtcNow().format(),
                              dateModified: getUtcNow().format(),
                              id: constructUserNotePrimaryKey(userController.username),
                              expirationDate: getUtcNow().add(3, 'day').format(),
                            }}
                            onSaved={handleSaved}
                          />
                        ) : (
                          <SavedNoteButtonLink />
                        )}
                      </Stack>
                      <HorizontalDivider />
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </NonSSRWrapper>
    </Container>
  )
}

export default NewsLayout
