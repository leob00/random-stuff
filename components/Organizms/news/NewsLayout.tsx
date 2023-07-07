import { Box, Stack } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import DropDownList from 'components/Atoms/Inputs/DropdownList'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import WarmupBox from 'components/Atoms/WarmupBox'
import { useUserController } from 'hooks/userController'
import { NewsItem, NewsTypeIds, newsTypes } from 'lib/backend/api/qln/qlnApi'
import { orderBy } from 'lodash'
import React from 'react'
import { get } from 'lib/backend/api/fetchFunctions'
import NewsList from './NewsList'
import { getUserNoteTitles, putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import LargeGridSkeleton from 'components/Atoms/Skeletons/LargeGridSkeleton'
import useSWR, { Fetcher, mutate } from 'swr'

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
      console.log('error in news api: ', err)
    }
    console.log(`retrieved ${sorted.length} ${id} results`)
    return sorted
  }

  const { data, isLoading, isValidating, error } = useSWR(['/api/news', selectedSource], ([url, id]) => fetchWithId(url, id))

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
    //mutate('/api/news', selectedSource)
  }

  return (
    <>
      <Box py={2}>
        <CenterStack>
          <Stack display='flex' flexDirection='row' gap={2}>
            <DropDownList options={newsTypes} selectedOption={selectedSource} onOptionSelected={handleNewsSourceSelected} label='source' />
          </Stack>
        </CenterStack>
      </Box>
      <Box>
        {isLoading ? (
          <>
            <WarmupBox />
            <LargeGridSkeleton />
          </>
        ) : (
          <Box sx={{ maxHeight: 580, overflowY: 'auto' }} py={2}>
            {error && <ErrorMessage text='There is an error that occurred. We have been made aware of it. Please try again in a few minutes.' />}
            {data && <NewsList newsItems={data} />}
          </Box>
        )}
      </Box>
    </>
  )
}

export default NewsLayout
