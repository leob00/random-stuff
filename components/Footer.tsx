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
          <Stack>
            {/* <Stack direction='row' spacing='2' justifyContent='space-between' alignItems='flex-start'>
              
            </Stack> */}
            {/* <div>
              <Typography variant='body2' color='text.secondary'>
                © 2022 <a href='https://www.msrb.org'>Municipal Securities Rulemaking Board</a> (MSRB)
                <br />
                <br />
                EMMA is a service of the Municipal Securities Rulemaking Board, which protects investors, state and local governments, and the public interest. Portions of EMMA data provided by ICE
                Data Pricing &amp; Reference Data, LLC., CUSIP Global Services &amp; American Bankers Association.
                <br />
                <br />
                Ratings data are provided by the following and are reprinted with permission, and copyright notices for the respective owners are as follows: Copyright © 2022, Fitch, Inc. All rights
                reserved. Copyright © 2022, Kroll Bond Rating Agency, Inc., and/or its licensors and affiliates (together, &quot;KBRA&quot;). All rights reserved. Copyright © 2022, Moody&apos;s Corporation, Moody&apos;s
                Investors Service, Inc., Moody&apos;s Analytics, Inc. and/or their licensors and affiliates (collectively, &quot;MOODY&apos;S&quot;). All rights reserved. Copyright © 2022, Standard and Poor&apos;s Financial
                Services LLC. All rights reserved.
                <br />
                <br />
                <br />
              </Typography>
            </div> */}
          </Stack>
        </Box>
      </Box>
    </>
  )
}

export default Footer
