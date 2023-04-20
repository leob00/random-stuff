import { Box, Link, Stack, Typography } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import DropDownList from 'components/Atoms/Inputs/DropdownList'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import WarmupBox from 'components/Atoms/WarmupBox'
import SavedNoteButtonLink from 'components/Molecules/Buttons/SavedNoteButtonLink'
import SaveToNotesButton from 'components/Molecules/Buttons/SaveToNotesButton'
import NonSSRWrapper from 'components/Organizms/NonSSRWrapper'
import { useUserController } from 'hooks/userController'
import { NewsItem, NewsTypeIds, newsTypes } from 'lib/backend/api/qln/qlnApi'
import { UserNote } from 'lib/models/randomStuffModels'
import { getUtcNow } from 'lib/util/dateUtil'
import { orderBy } from 'lodash'
import React from 'react'
import HtmlView from 'components/Atoms/Boxes/HtmlView'
import { get } from 'lib/backend/api/fetchFunctions'
import { DarkBlue } from 'components/themes/mainTheme'
import NewsList from './NewsList'

const NewsLayout = () => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [newsItems, setNewsItems] = React.useState<NewsItem[]>([])
  const [showError, setShowError] = React.useState(false)
  const [selectedSource, setSelectedSource] = React.useState<NewsTypeIds>('GoogleTopStories')
  const userController = useUserController()

  const loadData = async (id: NewsTypeIds) => {
    try {
      const result = (await get(`/api/news?id=${id}`)) as NewsItem[]
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
      console.log('error in news api: ', err)
      setShowError(true)
    }
    setIsLoading(false)
  }
  const handleNewsSourceSelected = async (id: string) => {
    setIsLoading(true)
    const source = id as NewsTypeIds
    setSelectedSource(source)
    //await loadData(id as NewsTypeIds)
  }

  React.useEffect(() => {
    const fn = async () => {
      await loadData(selectedSource)
      userController.fetchProfilePassive()
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
      <Box py={2}>
        {isLoading ? (
          <WarmupBox />
        ) : (
          <Box sx={{ maxHeight: 580, overflowY: 'auto' }}>
            {showError && <ErrorMessage text='There is an error that occurred. We have been made aware of it. Please try again in a few minutes.' />}
            <NewsList newsItems={newsItems} />
          </Box>
        )}
      </Box>
    </>
  )
}

export default NewsLayout
