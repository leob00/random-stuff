import { Button } from '@mui/material'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import PageHeader from 'components/Atoms/Containers/PageHeader'
import StockMarketPageContextMenu from 'components/Molecules/Menus/StockMarketPageContextMenu'
import Seo from 'components/Organizms/Seo'
import StockDetailsLayout from 'components/Organizms/stocks/StockDetailsLayout'
import { PageState, decryptPageState, encryptPageState } from 'hooks/ui/page-state/pageStateUtil'
import { useUserController } from 'hooks/userController'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Page = () => {
  const router = useRouter()
  const [loadingProfile, setLoadingProfile] = useState(true)
  const { authProfile, setProfile, fetchProfilePassive } = useUserController()

  const state = useSearchParams()?.get('state')
  let pageState: PageState | null = null
  if (state) {
    pageState = decryptPageState(state)
  }

  const id = router.query.slug as string | undefined

  const handleBacklClick = (item: PageState) => {
    const encState = encryptPageState(item)
    router.push(`${item.route}?state=${encState}`)
  }

  useEffect(() => {
    const fn = async () => {
      if (!authProfile) {
        const p = await fetchProfilePassive()
        setProfile(p)
      }
      setLoadingProfile(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authProfile])

  return (
    <>
      <Seo pageTitle={`Stock Details: ${id}`} />
      <ResponsiveContainer>
        <PageHeader text={`${id}`}>
          <StockMarketPageContextMenu />
        </PageHeader>
        {pageState ? (
          <Button
            variant='text'
            onClick={() => {
              handleBacklClick(pageState)
            }}
            color='primary'
          >
            &#8592; back
          </Button>
        ) : (
          <></>
        )}

        {id && !loadingProfile && <StockDetailsLayout symbol={id} disableCollapse />}
      </ResponsiveContainer>
    </>
  )
}

export default Page
