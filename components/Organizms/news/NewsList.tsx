import { Box, Link, Stack, Typography } from '@mui/material'
import HtmlView from 'components/Atoms/Boxes/HtmlView'
import CenterStack from 'components/Atoms/CenterStack'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import SavedNoteButtonLink from 'components/Molecules/Buttons/SavedNoteButtonLink'
import SaveToNotesButton from 'components/Molecules/Buttons/SaveToNotesButton'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useUserController } from 'hooks/userController'
import { constructUserNoteTitlesKey } from 'lib/backend/api/aws/util'
import { NewsItem, NewsTypeIds } from 'lib/backend/api/qln/qlnApi'
import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import { UserNote } from 'lib/models/randomStuffModels'
import { getUtcNow } from 'lib/util/dateUtil'
import React from 'react'
import { mutate } from 'swr'
import NewsDescription from './NewsDescription'
dayjs.extend(relativeTime)

const NewsList = ({
  newsItems,
  hideSaveButton = false,
  showPublishDate = false,
}: {
  newsItems: NewsItem[]
  hideSaveButton?: boolean
  showPublishDate?: boolean
}) => {
  const userController = useUserController()
  const handleSaved = async (note: UserNote) => {}
  const RenderHeadline = (item: NewsItem) => {
    if (!item.Headline) {
      return <></>
    }
    return (
      <Box textAlign={'center'} px={2}>
        <Link href={item.Link} target='_blank' sx={{ fontWeight: 700, textDecoration: 'none' }}>
          <Typography variant={'h4'} dangerouslySetInnerHTML={{ __html: `${item.Headline.replace('Pluralistic: ', '')}` }}></Typography>
        </Link>
      </Box>
    )
  }

  const getThumbnailSize = (source?: string) => {
    if (!source) {
      return 300
    }
    const s = source as NewsTypeIds
    switch (s) {
      case 'CBSWorld':
        return 80
      case 'SkyNews':
        return 120
      default:
        return 300
    }
  }

  return (
    <>
      {newsItems.length > 0 ? (
        newsItems.map((item, i) => (
          <Box key={`${item.Headline}${item.PublishDate}`} pb={2}>
            <Box minHeight={100}>
              {RenderHeadline(item)}
              <NewsDescription item={item} />
              {item.TeaserImageUrl !== undefined && item.TeaserImageUrl.length > 0 && !item.Description!.includes('img') && (
                <Stack>
                  <Box pt={1} maxWidth={350} display={'flex'} sx={{ margin: 'auto' }} px={2} justifyContent={'center'} textAlign={'center'}>
                    <img src={item.TeaserImageUrl} title='' width={getThumbnailSize(item.Source)} style={{ borderRadius: '16px' }} alt={item.TeaserImageUrl} />
                  </Box>
                </Stack>
              )}
              {showPublishDate && item.PublishDate && (
                <>
                  <CenterStack sx={{ pt: 1 }}>
                    <Typography variant='caption'>{`published: ${dayjs(item.PublishDate).fromNow()}`}</Typography>
                  </CenterStack>
                </>
              )}
              {userController.ticket && !hideSaveButton && (
                <Box>
                  <Stack py={2}>
                    {!item.Saved ? (
                      <SaveToNotesButton
                        username={userController.ticket.email}
                        note={{
                          title: item.Headline!,
                          body: `${item.Description} <p style='text-align:center;'><a href='${item.Link}' target='_blank'>link<a/></p>`,
                          dateCreated: getUtcNow().format(),
                          dateModified: getUtcNow().format(),
                          expirationDate: getUtcNow().add(3, 'day').format(),
                        }}
                        onSaved={handleSaved}
                      />
                    ) : (
                      <SavedNoteButtonLink />
                    )}
                  </Stack>
                </Box>
              )}
            </Box>
            <HorizontalDivider />
          </Box>
        ))
      ) : (
        <NoDataFound message={'Unable to find any articles at this time. Please try again later.'} />
      )}
    </>
  )
}

export default NewsList
