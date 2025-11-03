import { UserType } from '@aws-sdk/client-cognito-identity-provider'
import { Box } from '@mui/material'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { getUsers } from 'lib/backend/csr/nextApiWrapper'
import { useState } from 'react'
import UserAdminDetail from './UserAdminDetail'

const UsersAdmin = ({ userProfile }: { userProfile: UserProfile }) => {
  const key = `user-profile-${userProfile.id}`
  const [selectedItem, setSelectedItem] = useState<UserProfile | null>(null)

  const dataFn = async () => {
    const userPoolResp = (await getUsers()) as UserType[]
    const result: UserProfile[] = userPoolResp.map((m) => {
      return {
        id: m.Username ?? '',
        username: m.Attributes![m.Attributes!.length - 1].Value ?? '',
        emailVerified: m.Attributes![m.Attributes!.length - 2].Value === 'true',
      }
    })
    return result
  }

  const { isLoading, data } = useSwrHelper(key, dataFn, { revalidateOnFocus: false, revalidateOnMount: true })

  const handleLoadUser = async (item: UserProfile) => {
    if (selectedItem && selectedItem.username === item.username) {
      setSelectedItem(null)
    } else {
      setSelectedItem(item)
    }
  }

  return (
    <Box py={2}>
      {isLoading && <BackdropLoader />}
      {data && (
        <Box>
          {data.map((item) => (
            <Box key={item.id ?? ''} py={1}>
              <ListHeader
                text={item.username ?? ''}
                item={item}
                onClicked={() => {
                  handleLoadUser(item)
                }}
              />
              {selectedItem && selectedItem.username === item.username && <UserAdminDetail userProfile={selectedItem} />}
              <HorizontalDivider />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default UsersAdmin
