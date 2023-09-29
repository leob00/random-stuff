import React from 'react'
import styled from 'styled-components'
import CenterStack from '../CenterStack'
import RemoteImageFlat from '../RemoteImageFlat'

const StyledSpinner = styled.div`
  animation: rotation ${(props) => props.className || '0s'}s alternate infinite;
  @keyframes rotation {
    from {
      transform: rotateY(0deg);
    }
    to {
      transform: rotateY(360deg);
    }
  }
`

const ImageYRotator = ({
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

export default ImageYRotator
