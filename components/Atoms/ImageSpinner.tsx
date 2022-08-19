import React from 'react'
import styled from 'styled-components'
import CenterStack from './CenterStack'
import RemoteImageFlat from './RemoteImageFlat'

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

const ImageSpinner = ({ imageUrl, speed, width, height }: { imageUrl: string; speed?: number; width?: number; height?: number }) => {
  return (
    <>
      <CenterStack>
        <StyledSpinner className={`${speed}`}>
          <RemoteImageFlat title='roulette' url={imageUrl} width={width} height={height} />
        </StyledSpinner>
      </CenterStack>
    </>
  )
}

export default ImageSpinner
