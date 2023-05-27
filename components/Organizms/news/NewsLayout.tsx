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

const NewsLayout = () => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [newsItems, setNewsItems] = React.useState<NewsItem[]>([])
  const [showError, setShowError] = React.useState(false)
  const userController = useUserController()
  const defaultSource: NewsTypeIds = (userController.authProfile?.settings?.news?.lastNewsType as NewsTypeIds) ?? 'GoogleTopStories'
  const [selectedSource, setSelectedSource] = React.useState<NewsTypeIds>(defaultSource)

  const loadData = async (id: NewsTypeIds) => {
    try {
      const result = (await get(`/api/news?id=${id}`)) as NewsItem[]
      const sorted = orderBy(result, ['PublishDate'], ['desc'])
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
      setNewsItems(sorted)
    } catch (err) {
      console.log('error in news api: ', err)
      setShowError(true)
    }
    setIsLoading(false)
  }

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
    setIsLoading(true)
    const source = id as NewsTypeIds
    setSelectedSource(source)
    saveProfileNewsType(source)
    //await loadData(id as NewsTypeIds)
  }

  React.useEffect(() => {
    const fn = async () => {
      const profile = await userController.fetchProfilePassive()
      await loadData(selectedSource)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSource])
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
            {showError && <ErrorMessage text='There is an error that occurred. We have been made aware of it. Please try again in a few minutes.' />}
            <NewsList newsItems={newsItems} />
          </Box>
        )}
      </Box>
    </>
  )
}

export default NewsLayout
