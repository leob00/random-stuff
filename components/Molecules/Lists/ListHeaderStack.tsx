import { Box, Stack, styled, Typography, useTheme } from '@mui/material'
import ContextMenu, { ContextMenuItem } from '../Menus/ContextMenu'
import { CasinoWhite, CasinoWhiteTransparent, DarkModeBlueTransparent, SoftWhite, White } from 'components/themes/mainTheme'

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
      background-color: ${theme.palette.primary.dark};
      border-radius: 7px;
      padding: 0px;
    }
    & .MuiTypography-root {
      color: ${theme.palette.mode === 'dark' ? CasinoWhite : CasinoWhite};
    }
  `

  const Header = () => {
    return (
      <Stack direction={'row'} flexGrow={1}>
        <Box
          px={2}
          py={1}
          width={'100%'}
          sx={{ cursor: !disabled ? 'pointer' : 'unset' }}
          onClick={(e) => {
            onClicked?.(item)
          }}
        >
          <Typography
            textAlign={'left'}
            variant='h6'
            fontWeight={'bold'}
            color='info'
            sx={{ textDecoration: `${underline ? 'underline' : 'unset'}` }}
            dangerouslySetInnerHTML={{ __html: text }}
          ></Typography>
        </Box>
        <Box>{showContextMenu && <ContextMenu items={contextMenu} />}</Box>
      </Stack>
    )
  }

  return selected ? <StyledBox>{Header()}</StyledBox> : <>{Header()}</>
}

export default ListHeaderStack
