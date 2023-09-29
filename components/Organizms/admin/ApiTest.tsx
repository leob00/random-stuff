import { Box } from '@mui/material'
import JsonView from 'components/Atoms/Boxes/JsonView'
import CenterStack from 'components/Atoms/CenterStack'
import DropdownList from 'components/Atoms/Inputs/DropdownList'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import CenteredTitle from 'components/Atoms/Text/CenteredTitle'
import WarmupBox from 'components/Atoms/WarmupBox'
import { post, get } from 'lib/backend/api/fetchFunctions'
import { SignedRequest } from 'lib/backend/csr/nextApiWrapper'
import { myEncrypt } from 'lib/backend/encryption/useEncryptor'
import { DropdownItem } from 'lib/models/dropdown'
import React from 'react'

const apiOptions: DropdownItem[] = [
  {
    text: 'status',
    value: '/api/edgeStatus',
  },
  {
    text: 'dogs',
    value: '/api/edgeRandomAnimals?id=dogs',
  },
  {
    text: 'cats',
    value: '/api/edgeRandomAnimals?id=cats',
  },
  {
    text: 'news',
    value: '/api/news?id=LifeHacker',
  },
  {
    text: 'recipes',
    value: '/api/recipes',
  },
  {
    text: 'user stock lists',
    value: '/api/searchRandomStuff',
  },
]

const ApiTest = () => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [jsonResult, setJsonResult] = React.useState('')

  const handleApiSelected = async (url: string) => {
    setIsLoading(true)
    let req = url
    if (req.includes('searchRandomStuff')) {
      const enc = myEncrypt(String(process.env.NEXT_PUBLIC_API_TOKEN), `user-stock_list`)
      const body: SignedRequest = {
        data: enc,
      }
      const result = await post(req, body)
      setJsonResult(JSON.stringify(result, null, 2))
      setIsLoading(false)
      return
    }
    const result = await get(req)
    setJsonResult(JSON.stringify(result, null, 2))
    setIsLoading(false)
  }
  React.useEffect(() => {
    const fn = async () => {
      await handleApiSelected('/api/edgeStatus')
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Box>
      <CenteredTitle title={`Test Api's`} />
      <CenterStack sx={{ pt: 2 }}>
        <DropdownList options={apiOptions} selectedOption={'/api/edgeStatus'} onOptionSelected={handleApiSelected} />
      </CenterStack>
      {isLoading && <BackdropLoader />}
      <CenterStack sx={{ py: 4 }}>
        <JsonView obj={jsonResult} />
      </CenterStack>
    </Box>
  )
}

export default ApiTest
