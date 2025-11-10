import { Box } from '@mui/material'
import JsonView from 'components/Atoms/Boxes/JsonView'
import { EconDataModel } from 'components/Organizms/econ/EconDataLayout'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import TreasuriesTable from './TreasuriesTable'

const ids = [
  13, // 3 year
  5, // 10 year
  12, // 30
]

const getData = async () => {
  const config = apiConnection().qln
  const url = `${config.url}/EconReports`
  const resp = await get(url)
  const dbResult = resp as EconDataModel
  const result = dbResult.Body.Items.filter((m) => ids.includes(m.InternalId))

  return result
}

export default async function TreasuriesView() {
  const data = await getData()
  return (
    <Box>
      {data && (
        <Box>
          <TreasuriesTable data={data} />
        </Box>
      )}
    </Box>
  )
}
