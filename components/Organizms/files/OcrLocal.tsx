import { Box, LinearProgress, TextField, Typography } from '@mui/material'
import FileUploadButton from 'components/Atoms/Buttons/FileUploadButton'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import CenterStack from 'components/Atoms/CenterStack'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import React from 'react'
import { createWorker } from 'tesseract.js'

const OcrLocal = () => {
  const textRef = React.useRef<HTMLInputElement>(null)
  const [text, setText] = React.useState<string | null>(null)
  const [selectedFile, setSelectedFile] = React.useState<File | undefined>(undefined)
  const [progress, setProgress] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)

  const handleSelectFile = async (file: File) => {
    setSelectedFile(file)
  }

  const handleExtractText = async () => {
    setText(null)
    setProgress(0)
    setIsLoading(true)
    try {
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          setProgress(m.progress * 100)
        },
        errorHandler: (m) => {
          console.log(m)
          setIsLoading(false)
        },
      })
      const file = selectedFile!

      const ext = file.name.substring(file.name.lastIndexOf('.') + 1)
      const result = await worker.recognize(URL.createObjectURL(file))
      setText(result.data.text)
      await worker.terminate()
      setIsLoading(false)
      setProgress(0)
      setShowSuccess(true)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Box>
      {isLoading && <BackdropLoader />}
      <CenterStack>
        <Typography>Select an image file to process.</Typography>
      </CenterStack>
      <FileUploadButton file={selectedFile} onFileSelected={handleSelectFile} />
      {selectedFile && (
        <Box>
          <CenterStack sx={{ py: 2 }}>
            <Box>
              <img src={URL.createObjectURL(selectedFile)} alt='preview image' />
            </Box>
          </CenterStack>
          <CenterStack sx={{ py: 2 }}>
            <SuccessButton text='extract text' onClick={handleExtractText} />
          </CenterStack>
        </Box>
      )}
      <Box minHeight={50}>{progress > 0 && <LinearProgress variant='determinate' value={progress} color='info' />}</Box>
      <TextField label='' placeholder='text...' multiline rows={10} sx={{ width: '100%' }} value={text ?? ''} inputProps={{}} />
      <SnackbarSuccess show={showSuccess} text={'text extracted!'} onClose={() => setShowSuccess(false)} />
    </Box>
  )
}

export default OcrLocal
