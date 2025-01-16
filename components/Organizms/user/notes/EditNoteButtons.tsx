import { Box } from '@mui/material'
import PassiveButton from 'components/Atoms/Buttons/PassiveButton'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import CenterStack from 'components/Atoms/CenterStack'
import React from 'react'

const EditNoteButtons = ({ isEditingText, handleSave, handleCancel }: { isEditingText: boolean; handleSave: () => void; handleCancel: () => void }) => {
  return (
    <Box>
      <CenterStack sx={{ py: 2, gap: 2 }}>
        <SuccessButton onClick={handleSave} text={isEditingText ? 'preview' : 'save'} sx={{ ml: 3 }} size='small' />
        <PassiveButton text={'close'} onClick={handleCancel} size='small' />
      </CenterStack>
    </Box>
  )
}

export default EditNoteButtons
