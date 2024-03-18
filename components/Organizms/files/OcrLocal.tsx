import { Box, LinearProgress, TextField } from '@mui/material'
import FileUploadButton from 'components/Atoms/Buttons/FileUploadButton'
import PrimaryButton from 'components/Atoms/Buttons/PrimaryButton'
import SuccessButton from 'components/Atoms/Buttons/SuccessButton'
import CenterStack from 'components/Atoms/CenterStack'
import React from 'react'
import { createWorker } from 'tesseract.js'

const OcrLocal = () => {
  const textRef = React.useRef<HTMLInputElement>(null)
  const [text, setText] = React.useState<string | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<File | undefined>(undefined)
  const [progress, setProgress] = React.useState(0)

  const handleSelectFile = async (file: File) => {
    setSelectedFile(file)
  }

  const handleExtractText = async () => {
    setText(null)
    setProgress(0)
    setIsGenerating(true)
    try {
      const worker = await createWorker('eng', undefined, {
        logger: (m) => {
          setProgress(m.progress * 100)
        },
      })
      const result = await worker.recognize(URL.createObjectURL(selectedFile!))
      setText(result.data.text)
    } catch (err) {
      console.error(err)
      setIsGenerating(false)
    }
    setIsGenerating(false)
  }

  return (
    <Box>
      <FileUploadButton file={selectedFile} onFileSelected={handleSelectFile} />

      {selectedFile && (
        <Box>
          <CenterStack sx={{ py: 2 }}>
            <img width={250} src={URL.createObjectURL(selectedFile)} alt='preview image' />
          </CenterStack>
          <CenterStack sx={{ py: 2 }}>
            <SuccessButton text='extract text' onClick={handleExtractText} />
          </CenterStack>
        </Box>
      )}
      <Box minHeight={50}>
        <LinearProgress variant='determinate' value={progress} color='info' />
      </Box>
      <TextField
        label=''
        placeholder='text...'
        multiline
        rows={10}
        sx={{ width: '100%' }}
        value={text ?? ''}
        //onChange={handleNoteChange}
        inputProps={{}}
      />
    </Box>
  )
}

export default OcrLocal
