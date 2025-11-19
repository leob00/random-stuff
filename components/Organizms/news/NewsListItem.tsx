import { Box, Typography } from '@mui/material'
import { NewsItem } from 'lib/backend/api/qln/qlnApi'
import dayjs from 'dayjs'
import SaveToNotesButton from 'components/Molecules/Buttons/SaveToNotesButton'
import { getUtcNow } from 'lib/util/dateUtil'
import { UserNote, UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import SavedNoteButtonLink from 'components/Molecules/Buttons/SavedNoteButtonLink'
import NewsListItemMobile from './NewsListItemMobile'
import NewListItemDesktop from './NewListItemDesktop'

const NewsListItem = ({
  userProfile,
  item,
  showPublishDate,
  hideSaveButton,
  isSmallDevice,
}: {
  userProfile: UserProfile | null
  item: NewsItem
  showPublishDate?: boolean
  hideSaveButton: boolean
  isSmallDevice: boolean
}) => {
  const noteToSave: UserNote = {
    title: item.Headline!,
    body: `<div><div>source: ${item.sourceDescription ?? ''}</div><div style=''><a href='${item.Link}' target='_blank'>view article<a/></div></div>`,
    dateCreated: getUtcNow().format(),
    dateModified: getUtcNow().format(),
    expirationDate: getUtcNow().add(3, 'day').format(),
  }

  return (
    <Box minHeight={100}>
      <Box>{!isSmallDevice ? <NewListItemDesktop item={item} /> : <NewsListItemMobile item={item} />}</Box>
      {showPublishDate && item.PublishDate && (
        <Box py={2} px={2}>
          <Typography variant='caption'>{`published: ${dayjs(item.PublishDate).fromNow()}`}</Typography>
        </Box>
      )}
      {userProfile && !hideSaveButton && (
        <Box>
          <Box display={'flex'} justifyContent={'flex-end'} py={2} pr={2}>
            {!item.Saved ? <SaveToNotesButton username={userProfile.username} note={noteToSave} /> : <SavedNoteButtonLink noteRoute={null} />}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default NewsListItem
