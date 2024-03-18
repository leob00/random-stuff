import { Box, TextField, Typography } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { getTextFromImage } from 'lib/backend/api/aws/apiGateway/apiGateway'
import { getPresignedUrl, getS3File, ocrImage } from 'lib/backend/csr/nextApiWrapper'
import React from 'react'
import { blob } from 'stream/consumers'

const Ocr = () => {
  const textRef = React.useRef<HTMLInputElement>(null)
  const [text, setText] = React.useState('')
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [imgageBase64, setImageBase64] = React.useState<string | null>(null)

  const dataFn = async () => {
    //const file = await getS3File('rs-files', 'leo_bel@hotmail.com/test', 'written-text.jpg')
    let url = await getPresignedUrl('rs-files', 'leo_bel@hotmail.com/test/written-text.jpg')

    return url
  }
  const { isLoading, data } = useSwrHelper('ocr', dataFn)

  const isWaiting = isLoading || isGenerating

  const handleClick = async () => {
    //console.log(`submitting: ${data}`)
    setIsGenerating(true)
    const fileResp = await fetch(`/api/ocr?url=${encodeURIComponent(data!)}`)
    const result = (await fileResp.json()) as Tesseract.Page
    setText(result.text)
    //console.log(result)
    //setImageBase64(fileBase64)
    setIsGenerating(false)
  }
  // console.log('data: ', data)
  return (
    <Box>
      {isWaiting && <BackdropLoader />}
      <Box py={2}>{data && <TextField InputProps={{}} inputRef={textRef} defaultValue={data} />}</Box>
      {/* {imageBlob && <img src={imageBlob} />} */}

      <Box minHeight={200}>{text && <Typography>{text}</Typography>}</Box>
      <PrimaryButton text='submit' onClick={handleClick} />
    </Box>
  )
}

export default Ocr
