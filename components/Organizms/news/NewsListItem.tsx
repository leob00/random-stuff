import { Box, Stack, Typography } from '@mui/material'
import NewsImage from './NewsImage'
import NewsHeadline from './NewsHeadline'
import { NewsItem } from 'lib/backend/api/qln/qlnApi'
import NewsDescription from './NewsDescription'
import dayjs from 'dayjs'
import CenterStack from 'components/Atoms/CenterStack'
import { UserController } from 'hooks/userController'
import SaveToNotesButton from 'components/Molecules/Buttons/SaveToNotesButton'
import { getUtcNow } from 'lib/util/dateUtil'
import { UserNote, UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import SavedNoteButtonLink from 'components/Molecules/Buttons/SavedNoteButtonLink'
import { AmplifyUser } from 'lib/backend/auth/userUtil'
import NewsListItemMobile from './NewsListItemMobile'

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
  const handleSaved = async (note: UserNote) => {}
  return (
    <Box minHeight={100}>
      {!isSmallDevice ? (
        <Box>
          <Box display={'flex'} justifyContent={'flex-start'}>
            <NewsImage item={item} />
            <Box py={1}>
              <NewsHeadline item={item} />
            </Box>
          </Box>
          <NewsDescription item={item} />
        </Box>
      ) : (
        <NewsListItemMobile item={item} />
      )}
      {showPublishDate && item.PublishDate && (
        <>
          <CenterStack sx={{ pt: 1 }}>
            <Typography variant='caption'>{`published: ${dayjs(item.PublishDate).fromNow()}`}</Typography>
          </CenterStack>
        </>
      )}
      {userProfile && !hideSaveButton && (
        <Box>
          <Box display={'flex'} justifyContent={'flex-end'} py={2} pr={2}>
            {!item.Saved ? (
              <SaveToNotesButton
                username={userProfile.username}
                note={{
                  title: item.Headline!,
                  body: `<div><p></p><div style='padding: 20px display: flex; justify-content: center; text-align:center;'><a href='${item.Link}' target='_blank'>view article<a/></div></div>`,
                  dateCreated: getUtcNow().format(),
                  dateModified: getUtcNow().format(),
                  expirationDate: getUtcNow().add(3, 'day').format(),
                }}
                onSaved={handleSaved}
              />
            ) : (
              <SavedNoteButtonLink noteRoute={null} />
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default NewsListItem
