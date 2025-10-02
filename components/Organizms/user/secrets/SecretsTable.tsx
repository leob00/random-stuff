import { Box, IconButton } from '@mui/material'
import CenterStack from 'components/Atoms/CenterStack'
import SearchWithinList from 'components/Atoms/Inputs/SearchWithinList'
import { useState } from 'react'
import { UserSecret } from 'lib/backend/api/models/zModels'
import { UserProfile } from 'lib/backend/api/aws/models/apiGatewayModels'
import EditSecret from './EditSecret'
import Close from '@mui/icons-material/Close'
import { useClientPager } from 'hooks/useClientPager'
import Pager from 'components/Atoms/Pager'
import NoDataFound from 'components/Atoms/Text/NoDataFound'
import SecretListItem from './SecretListItem'
import { decryptUserSecret } from 'lib/backend/csr/nextApiWrapper'

const SecretsTable = ({
  encKey,
  authProfile,
  filteredSecrets,
  filter,
  handleFilterChanged,
  handleItemDeleted,
  handleItemSaved,
}: {
  encKey: string
  authProfile: UserProfile
  filteredSecrets: UserSecret[]
  filter: string
  handleFilterChanged: (text: string) => void
  handleItemDeleted: () => void
  handleItemSaved: () => void
}) => {
  const [editItem, setEditItem] = useState<UserSecret | null>(null)
  const handleEdit = async (item: UserSecret) => {
    const dec = await decryptUserSecret(item)
    setEditItem(dec)
  }

  const handleCancelEdit = () => {
    setEditItem(null)
  }

  const handleDeleted = () => {
    setEditItem(null)
    handleItemDeleted()
  }
  const handlSaved = () => {
    setEditItem(null)
    handleItemSaved()
  }
  const handlePaged = (pageNum: number) => {
    setPage(pageNum)
  }

  const pageSize = 5
  const { getPagedItems, setPage, pagerModel } = useClientPager(filteredSecrets, pageSize)
  const pagedItems = getPagedItems(filteredSecrets)

  return (
    <>
      {!editItem && (
        <>
          <Box py={2}>
            <CenterStack>
              <SearchWithinList onChanged={handleFilterChanged} defaultValue={filter} />
            </CenterStack>
          </Box>
          <>
            <Box minHeight={264}>
              {pagedItems.map((item) => (
                <Box key={item.id}>
                  <SecretListItem
                    encKey={encKey}
                    data={item}
                    onEdit={() => {
                      handleEdit(item)
                    }}
                  />
                </Box>
              ))}
              {pagedItems.length === 0 && <NoDataFound message='No data found that matched your criteria.' />}
            </Box>
            <Pager
              pageCount={pagerModel.totalNumberOfPages}
              itemCount={pagedItems.length}
              itemsPerPage={pageSize}
              onPaged={(pageNum: number) => handlePaged(pageNum)}
              defaultPageIndex={pagerModel.page}
              totalItemCount={pagerModel.totalNumberOfItems}
              showHorizontalDivider={false}
            />
          </>
        </>
      )}
      {editItem && (
        <>
          <Box>
            <Box py={2}>
              <Box textAlign={'right'}>
                <IconButton color='primary' onClick={() => setEditItem(null)}>
                  <Close fontSize='small' />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <EditSecret
            encKey={encKey}
            onCancel={handleCancelEdit}
            userSecret={editItem}
            onDeleted={handleDeleted}
            username={authProfile.username}
            onSaved={handlSaved}
            isDecrypted
          />
        </>
      )}
    </>
  )
}

export default SecretsTable
