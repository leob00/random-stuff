import { motion } from 'framer-motion'
import { ReactNode } from 'react'

const FadeIn = ({ duration = 1, children }: { duration?: number; children: ReactNode | JSX.Element[] }) => {
  return (
    <motion.div
      animate={{
        opacity: [0.1, 0.2, 0.3, 0.4, 0.5, 0.8, 1],
        scale: [0.5, 1],
      }}
      transition={{ duration: duration }}
      initial={{
        opacity: 0,
        rotate: '0deg',
      }}
    >
      {children}
    </motion.div>
  )
}

export default FadeIn