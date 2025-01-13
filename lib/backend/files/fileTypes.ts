type VideoTypes = 'audio/mp3' | 'video/mp4' | 'video/mpeg'
type ImageTypes = 'image/avif' | 'image/gif' | 'image/jpeg' | 'image/png' | 'image/svg+xml' | 'image/webp'
type SuportedFileTypes =
  | 'audio/m4a'
  | 'audio/mp4'
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
  'audio/m4a',
  'audio/mp4',
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

export const allSupportedFileTypes = supportedFileTypes.join()
export const supportedImageTypes = imageTypes.join()
export const supportedOcrImageTypes = imageTypes.filter((m) => m !== 'image/svg+xml').join()

export interface ImageSize {
  height: number
  width: number
}
