import { Box } from '@mui/material'
import CenteredParagraph from 'components/Atoms/Text/CenteredParagraph'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import { LambdaBody } from 'lib/backend/api/aws/models/apiGatewayModels'
import { getUserSSR } from 'lib/backend/server-side/serverSideAuth'
import { GetServerSideProps, NextPage } from 'next'
import React from 'react'
import { useRouter } from 'next/navigation'
import BackButton from 'components/Atoms/Buttons/BackButton'
import HorizontalDivider from 'components/Atoms/Dividers/HorizontalDivider'
import { AmplifyUser } from 'lib/backend/auth/userUtil'
import { searchRandomStuffBySecIndex } from 'lib/backend/api/aws/apiGateway'

interface PageProps {
  user: AmplifyUser
  data?: LambdaBody[]
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const amplifyUser = await getUserSSR(context)
  let result: LambdaBody[] | undefined = undefined
  if (amplifyUser) {
    result = await searchRandomStuffBySecIndex('random')
  }
  return {
    props: {
      user: amplifyUser,
      data: result,
    },
  }
}

const Page: NextPage<PageProps> = ({ user, data }) => {
  const router = useRouter()
  return user ? (
    <Box>
      <BackButton />
      <CenteredTitle title='Tasks' />
      <HorizontalDivider />
      <Box>
        <CenteredParagraph text={'coming soon'} />
      </Box>
    </Box>
  ) : (
    <PleaseLogin />
  )
}

export default Page
