import { Box, TextField, Typography } from '@mui/material'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { getPresignedUrl } from 'lib/backend/csr/nextApiWrapper'
import React from 'react'

const Ocr = () => {
  const textRef = React.useRef<HTMLInputElement>(null)
  const [text, setText] = React.useState<string | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)

  const dataFn = async () => {
    let url = await getPresignedUrl('rs-files', 'leo_bel@hotmail.com/test/written-text.jpg')
    return url
  }
  const { isLoading, data } = useSwrHelper('ocr', dataFn)

  const isWaiting = isLoading || isGenerating

  const handleClick = async () => {
    setIsGenerating(true)
    const fileResp = await fetch(`/api/ocr?url=${encodeURIComponent(data!)}`)
    const result = (await fileResp.json()) as Tesseract.Page
    setText(result.text)
    setIsGenerating(false)
  }
  return (
    <Box>
      {isWaiting && <BackdropLoader />}
      <Box py={2}>{data && <TextField InputProps={{}} inputRef={textRef} defaultValue={data} />}</Box>
      <Box minHeight={200}>{text && <Typography>{text}</Typography>}</Box>
      <PrimaryButton text='submit' onClick={handleClick} />
    </Box>
  )
}

export default Ocr
