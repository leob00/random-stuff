import { Box } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import ListHeader from 'components/Molecules/Lists/ListHeader'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import { searchRecords } from 'lib/backend/csr/nextApiWrapper'
import React from 'react'

const UsersAdmin = ({ userProfile }: { userProfile: UserProfile }) => {
  const key = `user-profile-${userProfile.id}`

  const dataFn = async () => {
    const resp = await searchRecords('userProfile')
    const result = resp.map((m) => JSON.parse(m.data) as UserProfile)
    return result
  }

  const { isLoading, data } = useSwrHelper(key, dataFn)

  return (
    <Box py={2}>
      {isLoading && <BackdropLoader />}
      {data && (
        <Box>
          {data.map((item) => (
            <Box key={item.id} py={1}>
              <ListHeader text={item.username} item={item} onClicked={() => {}} />
            </Box>
          ))}
          {/* <JsonView obj={data} /> */}
        </Box>
      )}
    </Box>
  )
}

export default UsersAdmin
