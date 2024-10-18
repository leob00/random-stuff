import { Box, Stack } from '@mui/material'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import { useUserController } from 'hooks/userController'
import { NewsItem, NewsTypeIds, newsTypes, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import { orderBy } from 'lodash'
import NewsList from './NewsList'
import { getUserNoteTitles, putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import CircleLoader from 'components/Atoms/Loaders/CircleLoader'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import { useState } from 'react'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'

const NewsLayout = ({
  componentLoader = false,
  allowSelectType = true,
  revalidateOnFocus = false,
}: {
  componentLoader?: boolean
  allowSelectType?: boolean
  revalidateOnFocus?: boolean
}) => {
  const { userProfile } = useProfileValidator()
  const { setProfile, fetchProfilePassive } = useUserController()
  const defaultSource: NewsTypeIds = (userProfile?.settings?.news?.lastNewsType as NewsTypeIds) ?? 'GoogleTopStories'
  const [selectedSource, setSelectedSource] = useState<NewsTypeIds>(defaultSource)
  const [error, setError] = useState<string | null>(null)

  const mutateKey = `news-${selectedSource}`

  const dataFn = async () => {
    setError(null)
    const endPoint = `/NewsBySource?type=${selectedSource}`
    const response = await serverGetFetch(endPoint)
    const result = response.Body as NewsItem[]
    const sorted = orderBy(result, ['PublishDate'], ['desc'])
    try {
      if (userProfile) {
        const noteTitles = await getUserNoteTitles(userProfile.username)
        noteTitles.forEach((note) => {
          sorted.forEach((newsItem) => {
            if (newsItem.Headline === note.title) {
              newsItem.Saved = true
            }
          })
        })
      }
    } catch (err) {
      setError('Oops! Encountered an error. Please try again.')
      console.error(err)
    }

    return sorted.map((m) => {
      return { ...m, sourceDescription: newsTypes.find((t) => t.value === m.Source)?.text }
    })
  }

  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: revalidateOnFocus })
  const scroller = useScrollTop(0)

  const saveProfileNewsType = async (newstype: NewsTypeIds) => {
    const profile = await fetchProfilePassive()
    if (profile && profile.settings) {
      if (!profile.settings.news) {
        profile.settings.news = {
          lastNewsType: selectedSource,
        }
      }
      profile.settings.news.lastNewsType = newstype
      setProfile(profile)
      putUserProfile(profile)
    }
  }
  const handleNewsSourceSelected = async (id: string) => {
    const source = id as NewsTypeIds
    setSelectedSource(source)
    scroller.scroll()
    saveProfileNewsType(source)
  }

  return (
    <>
      {allowSelectType && (
        <Box py={2}>
          <Stack display='flex' flexDirection='row' justifyContent={'center'} px={2}>
            <StaticAutoComplete
              options={newsTypes}
              placeholder='select source'
              selectedItem={newsTypes.find((m) => m.value === selectedSource)}
              onSelected={(item) => {
                handleNewsSourceSelected(item.value)
              }}
              disableClearable
              fullWidth
            />
          </Stack>
        </Box>
      )}
      <Stack>
        {isLoading && <>{componentLoader ? <CircleLoader /> : <BackdropLoader />}</>}
        <>
          {error && <ErrorMessage text='There is an error that occurred. We have been made aware of it. Please try again in a few minutes.' />}
          <ScrollableBox maxHeight={505} scroller={scroller}>
            {data && <NewsList newsItems={data} />}
          </ScrollableBox>
        </>
      </Stack>
    </>
  )
}

export default NewsLayout
