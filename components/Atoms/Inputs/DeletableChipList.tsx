import { Chip, Stack } from '@mui/material'

const DeletableChipList = ({ values, onDelete }: { values: string[]; onDelete: (item: string) => void }) => {
  return (
    <>
      <Stack direction='row' spacing={1}>
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
      </Stack>
    </>
  )
}

export default DeletableChipList
