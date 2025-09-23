import { Box, Stack, styled, Typography, useTheme } from '@mui/material'
import ContextMenu, { ContextMenuItem } from '../Menus/ContextMenu'
import { DarkModeBlueTransparent } from 'components/themes/mainTheme'

const ListHeaderStack = ({
  text,
  item,
  disabled,
  onClicked,
  contextMenu,
  showContextMenu,
  underline,
  selected,
}: {
  text: string
  item: any
  disabled?: boolean
  onClicked?: (item: unknown) => void
  contextMenu: ContextMenuItem[]
  showContextMenu?: boolean
  underline?: boolean
  selected?: boolean
}) => {
  const theme = useTheme()
  const StyledBox = styled(Stack)`
    & .MuiStack-root {
      background-color: ${DarkModeBlueTransparent};
      border-radius: 8px;
      padding: 1px;
    }
    & .MuiTypography-root {
      color: ${theme.palette.info.contrastText};
    }
  `
  return selected ? (
    <StyledBox>
      <Stack direction={'row'} flexGrow={1}>
        <Box
          px={2}
          width={'100%'}
          sx={{ cursor: !disabled ? 'pointer' : 'unset' }}
          onClick={(e) => {
            onClicked?.(item)
          }}
        >
          <Typography
            textAlign={'left'}
            variant='h6'
            color='primary'
            sx={{ textDecoration: `${underline ? 'underline' : 'unset'}` }}
            dangerouslySetInnerHTML={{ __html: text }}
          ></Typography>
        </Box>
        <Box>{showContextMenu && <ContextMenu items={contextMenu} />}</Box>
      </Stack>
    </StyledBox>
  ) : (
    <>
      <Stack direction={'row'} flexGrow={1}>
        <Box
          px={2}
          width={'100%'}
          sx={{ cursor: !disabled ? 'pointer' : 'unset' }}
          onClick={(e) => {
            onClicked?.(item)
          }}
        >
          <Typography
            textAlign={'left'}
            variant='h6'
            color='primary'
            sx={{ textDecoration: `${underline ? 'underline' : 'unset'}` }}
            dangerouslySetInnerHTML={{ __html: text }}
          ></Typography>
        </Box>
        <Box>{showContextMenu && <ContextMenu items={contextMenu} />}</Box>
      </Stack>
    </>
  )
}

export default ListHeaderStack
