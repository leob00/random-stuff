import { Delete } from '@mui/icons-material'
import { Box, Stack, Button, Divider } from '@mui/material'
import LinkButton from 'components/Atoms/Buttons/LinkButton'
import CenterStack from 'components/Atoms/CenterStack'
import { UserNote } from 'lib/models/randomStuffModels'
import React from 'react'

const NoteList = ({ data, onClicked }: { data: UserNote[]; onClicked: (item: UserNote) => void }) => {
  const handleNoteTitleClick = (item: UserNote) => {
    onClicked(item)
  }
  return (
    <CenterStack sx={{ py: 2 }}>
      <Box sx={{ width: '80%' }}>
        {data.map((item, i) => (
          <Box key={i}>
            <Stack direction='row' flexGrow={1} gap={2} py={3} pl={2}>
              <LinkButton
                onClick={() => {
                  handleNoteTitleClick(item)
                }}
              >
                {item.title}
              </LinkButton>
              <Stack flexDirection='row' flexGrow={1} justifyContent='flex-end'>
                <Button size='small'>
                  <Delete color='error' />
                </Button>
              </Stack>
            </Stack>
            <Divider />
          </Box>
        ))}
      </Box>
    </CenterStack>
  )
}

export default NoteList
