import { Box } from '@mui/material'
import JsonView from 'components/Atoms/Boxes/JsonView'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import JsonPreview from 'components/Molecules/Forms/Files/JsonPreview'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { getDynamoItemData, getUsers, searchDynamoItemsDataByCategory } from 'lib/backend/csr/nextApiWrapper'
import { useState } from 'react'

const UsersAdmin = ({ userProfile }: { userProfile: UserProfile }) => {
  const key = `user-profile-${userProfile.id}`
  const [selectedItem, setSelectedItem] = useState<UserProfile | null>(null)

  const dataFn = async () => {
    const resp = await searchDynamoItemsDataByCategory<UserProfile>('userProfile')
    const users = await getUsers()
    console.log('users', users)
    return resp
  }

  const { isLoading, data } = useSwrHelper(key, dataFn)

  const handleLoadUser = async (item: UserProfile) => {
    if (selectedItem && selectedItem.id === item.id) {
      setSelectedItem(null)
      return
    }
    const result = await getDynamoItemData<UserProfile>(item.id)

    setSelectedItem(result)
  }

  return (
    <Box py={2}>
      {isLoading && <BackdropLoader />}
      {data && (
        <Box>
          {data.map((item) => (
            <Box key={item.id} py={1}>
              <ListHeader
                text={item.username}
                item={item}
                onClicked={() => {
                  handleLoadUser(item)
                }}
              />
              {selectedItem && <JsonView obj={selectedItem} />}
              <HorizontalDivider />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

export default UsersAdmin
