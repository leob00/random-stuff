'use client'
import { Box } from '@mui/material'
import { SecretsUiModel } from './SecretsPage'
import { useProfileValidator } from 'hooks/auth/useProfileValidator'
import PleaseLogin from 'components/Molecules/PleaseLogin'
import SecretsTable from 'components/Organizms/user/secrets/SecretsTable'
import { useEffect, useState } from 'react'
import { UserSecret } from 'lib/backend/api/models/zModels'
import { usePolling } from 'hooks/usePolling'
import { getUtcNow } from 'lib/util/dateUtil'
import dayjs from 'dayjs'
import { usePathname, useRouter } from 'next/navigation'
import { getUserSecrets } from 'lib/backend/csr/nextApiWrapper'

const SecretsDisplay = ({ data }: { data: SecretsUiModel }) => {
  const { userProfile, isValidating: isValidatingProfile } = useProfileValidator()
  const [filter, setFilter] = useState('')
  const [allResults, setAllResults] = useState(data.results)
  const router = useRouter()
  const pathName = usePathname()

  const results = applyFilter(allResults, filter)
  const handleFilterChanged = (text: string) => {
    setFilter(text)
  }

  const { pollCounter, stop } = usePolling(60000)

  const handleRevalidate = async () => {
    const newResults = await getUserSecrets()
    setAllResults(newResults)
  }

  useEffect(() => {
    if (userProfile) {
      const utcNow = getUtcNow()

      const expDate = dayjs(userProfile.pin!.lastEnterDate).add(10, 'minutes')
      if (expDate.isBefore(utcNow)) {
        stop()
        router.push(`/account/profile/pin/validate?target=${encodeURIComponent(pathName ?? '')}`)
      }
    }
  }, [pollCounter])

  return (
    <Box py={2}>
      {!userProfile && !isValidatingProfile && <PleaseLogin />}
      {userProfile && (
        <>
          <SecretsTable
            authProfile={userProfile}
            filter={filter}
            filteredSecrets={results}
            handleItemSaved={handleRevalidate}
            handleItemDeleted={handleRevalidate}
            handleFilterChanged={handleFilterChanged}
          />
        </>
      )}
    </Box>
  )
}

const applyFilter = (list: UserSecret[], filter: string) => {
  return list.filter((o) => o.title.toLowerCase().includes(filter.toLowerCase()))
}

export default SecretsDisplay
