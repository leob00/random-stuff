import { motion } from 'framer-motion'
import React from 'react'
import { ReactNode } from 'react'

const FadeOut = ({ duration = 0.9, children }: { duration?: number; children: ReactNode | React.JSX.Element[] }) => {
  return (
    <motion.div
      animate={{
        opacity: [1, 0.8, 0.5, 0.3, 0.2, 0.1, 0],
        scale: [1, 0.5],
      }}
      transition={{ duration: duration }}
      initial={{
        opacity: 1,
        scale: 1,
        rotate: '0deg',
      }}
    >
      {children}
    </motion.div>
  )
}

export default FadeOut
