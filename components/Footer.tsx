import * as React from 'react'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
//import msrbLogo from '../assets/images/msrbLogo.png';
//import { Link } from 'gatsby';
//import { navigate } from 'gatsby';
import useRouter from 'next/router'
import Link from 'next/link'
import Image from 'next/image'

const isLoggedIn = () => false

const Footer = () => {
  const router = useRouter
  return (
    <>
      <Box
        sx={{
          bgcolor: '#eeeeee',
          borderTop: 1,
          borderTopColor: '#bcbcbc',
          borderTopWidth: 2,
        }}>
        <Box sx={{}}>
          <Stack></Stack>
        </Box>
      </Box>
    </>
  )
}

export default Footer
