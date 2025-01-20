import { useEffect, useRef } from 'react'

const AudioPlayer = ({ source }: { source: string }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  //   useEffect(() => {
  //     let callback: unknown
  //     let click: unknown
  //     if (audioRef.current) {
  //       const progress = function () {
  //         audioRef.current!.removeEventListener('canplaythrough', progress, false)
  //         if (callback) {
  //           callback = true
  //         }
  //       }
  //       audioRef.current.addEventListener('canplaythrough', progress, false)
  //       audioRef.current.addEventListener('canplaythrough', progress, false)
  //       try {
  //         audioRef.current.play()
  //       } catch (e) {
  //         callback = function () {
  //           callback = false
  //           audioRef.current!.play()
  //         }
  //       }
  //     audioRef.current!.addEventListener('touchstart', )

  //     }
  //   }, [0])

  return (
    <audio controls>
      <source src={source} type='audio/mpeg3' />
      <source src={source} type='audio/ogg' />
      Your browser does not support the audio element.
    </audio>
  )
}

export default AudioPlayer
