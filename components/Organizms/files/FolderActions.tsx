import ConfirmDeleteDialog from 'components/Atoms/Dialogs/ConfirmDeleteDialog'
import FormDialog from 'components/Atoms/Dialogs/FormDialog'
import AddFolderForm from 'components/Molecules/Forms/Files/AddFolderForm'
import ContextMenu, { ContextMenuItem } from 'components/Molecules/Menus/ContextMenu'
import ContextMenuAdd from 'components/Molecules/Menus/ContextMenuAdd'
import ContextMenuDelete from 'components/Molecules/Menus/ContextMenuDelete'
import { UserController } from 'hooks/userController'
import { S3Object } from 'lib/backend/api/aws/apiGateway'
import { DropdownItem } from 'lib/models/dropdown'
import React from 'react'

const FolderActions = ({
  folders,
  selectedFolder,
  items,
  onFolderAdded,
  onFolderDeleted,
}: {
  folders: DropdownItem[]
  selectedFolder: DropdownItem
  items: S3Object[]
  onFolderAdded: (name: string) => void
  onFolderDeleted: (item: DropdownItem) => void
}) => {
  const [showAddFolderForm, setShowAddFolderForm] = React.useState(false)
  const [deleteItem, setDeleteItem] = React.useState<DropdownItem | null>(null)

  const handleAddItem = (name: string) => {
    setShowAddFolderForm(false)
    setDeleteItem(null)
    onFolderAdded(name)
  }

  const handleDeleteItem = () => {
    if (deleteItem) {
      setDeleteItem(null)
      onFolderDeleted(deleteItem)
    }
  }

  const menu: ContextMenuItem[] = [
    {
      fn: () => {
        setShowAddFolderForm(!showAddFolderForm)
      },
      item: <ContextMenuAdd text='add folder' />,
    },
  ]
  if (items.length === 0 && folders.length > 0) {
    menu.push({
      fn: () => {
        setDeleteItem(selectedFolder)
      },
      item: <ContextMenuDelete text='delete folder' />,
    })
  }
  return (
    <>
      <ContextMenu items={menu} />
      <FormDialog title={'folder'} show={showAddFolderForm} onCancel={() => setShowAddFolderForm(false)}>
        <AddFolderForm folders={folders} onCancel={() => setShowAddFolderForm(false)} onSubmitted={handleAddItem} />
      </FormDialog>
      {deleteItem && (
        <ConfirmDeleteDialog
          show={true}
          text={`Are you sure you want to delete ${deleteItem.text}?`}
          onConfirm={handleDeleteItem}
          onCancel={() => setDeleteItem(null)}
        />
      )}
    </>
  )
}

export default FolderActions
