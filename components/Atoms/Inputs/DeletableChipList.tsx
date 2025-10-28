import { Box, Chip, Stack } from '@mui/material'

const DeletableChipList = ({ values, onDelete }: { values: string[]; onDelete: (item: string) => void }) => {
  return (
    <Box display={'flex'} gap={1} flexWrap='wrap'>
      {values.map((item) => (
        <Chip
          key={item}
          label={item}
          variant='outlined'
          onDelete={() => {
            onDelete(item)
          }}
        />
      ))}
    </Box>
  )
}

export default DeletableChipList
