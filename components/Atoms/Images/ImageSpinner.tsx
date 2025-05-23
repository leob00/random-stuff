import styled from '@emotion/styled'
import CenterStack from '../CenterStack'
import RemoteImageFlat from '../RemoteImageFlat'

const StyledSpinner = styled.div`
  animation: rotation ${(props) => props.className || '0s'}s linear infinite;
  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`

const ImageSpinner = ({
  imageUrl,
  speed,
  width,
  height,
  clickable,
  onClicked,
}: {
  imageUrl: string
  speed?: number
  width?: number
  height?: number
  clickable?: boolean
  onClicked?: () => void
}) => {
  const handleClick = () => {
    onClicked?.()
  }
  return (
    <>
      <CenterStack sx={{ cursor: clickable ? 'pointer' : 'default' }}>
        <StyledSpinner className={`${speed}`}>
          <RemoteImageFlat title='roulette' url={imageUrl} width={width} height={height} onClicked={handleClick} />
        </StyledSpinner>
      </CenterStack>
    </>
  )
}

export default ImageSpinner
