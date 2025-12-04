import { Box } from '@mui/material'
import { EconDataModel } from 'components/Organizms/econ/EconDataLayout'
import { apiConnection } from 'lib/backend/api/config'
import { get } from 'lib/backend/api/fetchFunctions'
import TreasuriesDisplay from './TreasuriesDisplay'
import { EconomicDataItem } from 'lib/backend/api/qln/qlnModels'

const ids = [
  48, // 1Year
  13, // 3 year
  47, // 5 year
  5, // 10 year
  12, // 30
]

const getData = async () => {
  const config = apiConnection().qln
  const url = `${config.url}/EconReports`
  const resp = await get(url)
  const dbResult = resp as EconDataModel
  const econData = dbResult.Body.Items
  const result: EconomicDataItem[] = []
  ids.forEach((id) => {
    const item = econData.find((m) => m.InternalId === id)
    if (item) {
      result.push({ ...item })
    }
  })
  result[0].Title = '1-year'
  result[1].Title = '3-year'
  result[2].Title = '5-year'
  result[3].Title = '10-year'
  result[4].Title = '30-year'

  //const result = dbResult.Body.Items.filter((m) => ids.includes(m.InternalId))

  return result
}

export default async function TreasuriesView() {
  const data = await getData()
  return (
    <Box>
      {data && (
        <Box>
          <TreasuriesDisplay data={data} />
        </Box>
      )}
    </Box>
  )
}
