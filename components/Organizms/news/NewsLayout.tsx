import { Box, Stack } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import { useUserController } from 'hooks/userController'
import { NewsItem, NewsTypeIds, newsTypes } from 'lib/backend/api/qln/qlnApi'
import { orderBy } from 'lodash'
import React from 'react'
import { get } from 'lib/backend/api/fetchFunctions'
import NewsList from './NewsList'
import { getUserNoteTitles, putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import useSWR from 'swr'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'

const NewsLayout = () => {
  const userController = useUserController()
  const defaultSource: NewsTypeIds = (userController.authProfile?.settings?.news?.lastNewsType as NewsTypeIds) ?? 'GoogleTopStories'
  const [selectedSource, setSelectedSource] = React.useState<NewsTypeIds>(defaultSource)

  const fetchWithId = async (url: string, id: string) => {
    const result = (await get(`${url}?id=${id}`)) as NewsItem[]
    const sorted = orderBy(result, ['PublishDate'], ['desc'])
    try {
      if (userController.authProfile) {
        const noteTitles = await getUserNoteTitles(userController.authProfile.username)
        noteTitles.forEach((note) => {
          sorted.forEach((newsItem) => {
            if (newsItem.Headline === note.title) {
              newsItem.Saved = true
            }
          })
        })
      }
    } catch (err) {
      console.error(err)
    }
    return sorted
  }

  const { data, isLoading, error } = useSWR(['/api/news', selectedSource], ([url, id]) => fetchWithId(url, id), { revalidateOnFocus: false })

  const saveProfileNewsType = async (newstype: NewsTypeIds) => {
    const profile = await userController.fetchProfilePassive()
    if (profile && profile.settings) {
      if (!profile.settings.news) {
        profile.settings.news = {
          lastNewsType: selectedSource,
        }
      }
      profile.settings.news.lastNewsType = newstype
      userController.setProfile(profile)
      putUserProfile(profile)
    }
  }
  const handleNewsSourceSelected = async (id: string) => {
    const source = id as NewsTypeIds
    setSelectedSource(source)
    saveProfileNewsType(source)
  }

  return (
    <>
      <Box py={2}>
        <CenterStack>
          <Stack display='flex' flexDirection='row' gap={2}>
            <StaticAutoComplete
              options={newsTypes}
              placeholder='select source'
              selectedItem={newsTypes.find((m) => m.value === selectedSource)}
              onSelected={(item) => {
                handleNewsSourceSelected(item.value)
              }}
              disableClearable
            />
          </Stack>
        </CenterStack>
      </Box>
      <Box>
        {isLoading ? (
          <BackdropLoader />
        ) : (
          <>
            {error && <ErrorMessage text='There is an error that occurred. We have been made aware of it. Please try again in a few minutes.' />}
            <ScrollableBox>{data && <NewsList newsItems={data} />}</ScrollableBox>
          </>
        )}
      </Box>
    </>
  )
}

export default NewsLayout
