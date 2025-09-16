import { Box, LinearProgress, TextField, Typography } from '@mui/material'
import FileUploadButton from 'components/Atoms/Buttons/FileUploadButton'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import CenterStack from 'components/Atoms/CenterStack'
import SnackbarSuccess from 'components/Atoms/Dialogs/SnackbarSuccess'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { supportedOcrImageTypes } from 'lib/backend/files/fileTypes'
import { createWorker } from 'tesseract.js'
import ImagePreview from 'components/Atoms/Images/ImagePreview'
import ReadOnlyField from 'components/Atoms/Text/ReadOnlyField'
import { getFileSizeText, getImageSize } from 'lib/util/numberUtil'
import CopyableText from 'components/Atoms/Text/CopyableText'
import { useState } from 'react'

const OcrLocal = () => {
  const [text, setText] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSelectFile = async (file: File) => {
    setSelectedFile(file)
    console.log(file)
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
          console.error(m)
          setIsLoading(false)
          setShowSuccess(true)
        },
      })
      const result = await worker.recognize(URL.createObjectURL(selectedFile!))
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
        <Typography pb={2} variant='body2'>
          Select an image to process.
        </Typography>
      </CenterStack>
      <FileUploadButton file={selectedFile} onFileSelected={handleSelectFile} accept={supportedOcrImageTypes} />
      {selectedFile && (
        <Box>
          <ImagePreview url={URL.createObjectURL(selectedFile)} imageSize={getImageSize(selectedFile.size)} hideTextExtract />
          <CenterStack>
            <ReadOnlyField label='size' val={getFileSizeText(selectedFile.size)} />
          </CenterStack>
          <CenterStack sx={{ py: 2 }}>
            <SuccessButton text='extract text' onClick={handleExtractText} />
          </CenterStack>
        </Box>
      )}

      <Box minHeight={50}>
        {progress > 0 && (
          <>
            <LinearProgress variant='determinate' value={progress} color='info' />
          </>
        )}
      </Box>
      {text && text.length > 0 && (
        <Box>
          <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
            <Typography variant='body2'>copy:</Typography>
            <CopyableText label='' value={text} showValue={false} />
          </Box>
          <TextField label='' placeholder='text...' multiline rows={10} sx={{ width: '100%' }} value={text ?? ''} />
        </Box>
      )}

      <SnackbarSuccess show={showSuccess} text={'text extracted!'} onClose={() => setShowSuccess(false)} />
    </Box>
  )
}

export default OcrLocal
