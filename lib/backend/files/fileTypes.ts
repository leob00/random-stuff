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

export const allSuppoertedFileTypes = supportedFileTypes.join()
