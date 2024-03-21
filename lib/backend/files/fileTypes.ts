type VideoTypes = 'audio/mp3' | 'video/mp4' | 'video/mpeg'
type ImageTypes = 'image/avif' | 'image/gif' | 'image/jpeg' | 'image/png' | 'image/svg+xml' | 'image/webp'
type SuportedFileTypes =
  | 'audio/mp3'
  | 'application/pdf'
  | 'application/msword'
  | 'application/vnd.ms-powerpoint'
  | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/zip'
  | 'image/avif'
  | 'image/gif'
  | 'image/jpeg'
  | 'image/png'
  | 'image/svg+xml'
  | 'image/webp'
  | 'video/mp4'
  | 'video/mpeg'

const imageTypes: ImageTypes[] = ['image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']

const supportedFileTypes: SuportedFileTypes[] = [
  'audio/mp3',
  'application/pdf',
  'application/msword',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
  'image/avif',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/webp',
  'video/mp4',
  'video/mpeg',
]

type NonPreviewTypes =
  | 'audio/mp3'
  | 'application/pdf'
  | 'application/msword'
  | 'application/vnd.ms-powerpoint'
  | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/zip'

//type OcrImageTypes = keyof Omit<keyof ImageTypes, 'image/svg+xml'>

//const ocrable: OcrImageTypes[] = ['image/png']

export const allSupportedFileTypes = supportedFileTypes.join()
export const supportedImageTypes = imageTypes.join()
export const supportedOcrImageTypes = imageTypes.filter((m) => m !== 'image/svg+xml').join()
