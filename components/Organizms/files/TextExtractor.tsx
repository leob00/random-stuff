import { Box, LinearProgress, TextField, Typography } from '@mui/material'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import CenterStack from 'components/Atoms/CenterStack'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import CopyableText from 'components/Atoms/Text/CopyableText'
import { useState } from 'react'

const TextExtractor = ({ url }: { url: string }) => {
  const [text, setText] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const handleExtractText = async () => {
    setText(null)
    setProgress(0)
    setIsLoading(true)
    try {
      const fileResp = await fetch(`/api/ocr?url=${encodeURIComponent(url)}`)
      //const result = (await fileResp.json()) as Tesseract.Page
      const result = (await fileResp.json()) as string
      setText(result)
      setIsLoading(false)
      setProgress(0)
    } catch (err) {
      console.log(err)
      setIsLoading(false)
      setProgress(0)
    }
  }
  return (
    <Box>
      {isLoading && <BackdropLoader />}
      {progress > 0 && (
        <>
          <LinearProgress variant='determinate' value={progress} color='info' />
        </>
      )}
      <CenterStack sx={{ py: 2 }}>
        <SuccessButton text='extract text' onClick={handleExtractText} />
      </CenterStack>
      {text && text.length > 0 && (
        <Box>
          <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
            <Typography variant='body2'>copy:</Typography>
            <CopyableText label='' value={text} showValue={false} />
          </Box>
          <TextField label='' placeholder='text...' multiline rows={10} sx={{ width: '100%' }} value={text ?? ''} />
        </Box>
      )}
    </Box>
  )
}

export default TextExtractor
