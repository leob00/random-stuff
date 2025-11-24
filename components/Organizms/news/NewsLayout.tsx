import { Box, Stack } from '@mui/material'
import ErrorMessage from 'components/Atoms/Text/ErrorMessage'
import { useUserController } from 'hooks/userController'
import { NewsItem, NewsTypeIds, newsTypes, serverGetFetch } from 'lib/backend/api/qln/qlnApi'
import { orderBy } from 'lodash'
import NewsList from './NewsList'
import { getUserNoteTitles, putUserProfile } from 'lib/backend/csr/nextApiWrapper'
import StaticAutoComplete from 'components/Atoms/Inputs/StaticAutoComplete'
import ScrollableBox from 'components/Atoms/Containers/ScrollableBox'
import { useScrollTop } from 'components/Atoms/Boxes/useScrollTop'
import { useState } from 'react'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { useLocalStore } from 'lib/backend/store/useLocalStore'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'

const NewsLayout = ({
  userProfile,
  componentLoader = false,
  allowSelectType = true,
  revalidateOnFocus = false,
  suspendLoader = false,
}: {
  componentLoader?: boolean
  allowSelectType?: boolean
  revalidateOnFocus?: boolean
  suspendLoader?: boolean
  userProfile: UserProfile | null
}) => {
  const { setProfile } = useUserController()
  const { newsSettings, setNewsSettings } = useLocalStore()
  const defaultSource: NewsTypeIds = userProfile?.settings?.news?.lastNewsType ?? newsSettings.newsSource

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
      if (response.Errors.length > 0) {
        setError(response.Errors[0].Message)
      }
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
    if (userProfile && userProfile.settings) {
      if (!userProfile.settings.news) {
        userProfile.settings.news = {
          lastNewsType: selectedSource,
        }
      }

      userProfile.settings.news = { ...userProfile.settings.news, lastNewsType: newstype }
      setProfile(userProfile)
      putUserProfile(userProfile)
      setNewsSettings({ ...newsSettings, newsSource: newstype })
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
        <>
          {isLoading && !suspendLoader && <>{componentLoader ? <ComponentLoader /> : <ComponentLoader />}</>}
          {error && (
            <>
              {/* <AlertWithHeader severity='error' header={error} text={'We have been made aware of it. Please try again later.'} /> */}
              <ErrorMessage text={`${error} We have been made aware of it. Please try again later.`} />
            </>
          )}
          <ScrollableBox maxHeight={505} scroller={scroller}>
            {data && <NewsList newsItems={data} userProfile={userProfile} />}
          </ScrollableBox>
        </>
      </Stack>
    </>
  )
}

export default NewsLayout
