import React from 'react'
import NewsLayout from 'components/Organizms/news/NewsLayout'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import Seo from 'components/Organizms/Seo'
import { useUserController } from 'hooks/userController'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import FormExample from 'components/Organizms/admin/FormExample'
import MutliControlForm from 'components/Molecules/Forms/ReactHookForm/MultiControlForm'

const Page = () => {
  const ticket = useUserController().ticket
  return (
    <>
      <Seo pageTitle={`Sandbox`} />
      <ResponsiveContainer>
        <PageHeader text='Sandbox' backButtonRoute={`${ticket ? '/protected/csr/dashboard' : '/'}`} />
        <CenteredHeader title='Form with dynamically created controls' />
        <FormExample />
        <CenteredHeader title='Form with control array' />
        <MutliControlForm />
      </ResponsiveContainer>
    </>
  )
}

export default Page
