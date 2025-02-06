import { Box } from '@mui/material'
import dayjs from 'dayjs'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { getEconDataReport } from 'lib/backend/api/qln/qlnApi'
import { WidgetSize } from 'components/Organizms/dashboard/dashboardModel'
import EconChart from './EconChart'
import { useRouter } from 'next/router'

const EconWidget = ({ itemId, symbol, width, height, size }: { itemId: number; symbol: string; width: number; height: number; size?: WidgetSize }) => {
  const startYear = dayjs().subtract(1, 'year').year()
  const endYear = dayjs().year()
  const key = `economic-data-${itemId}-${startYear}-${endYear}`
  const dataFn = async () => {
    const data = await getEconDataReport(itemId, startYear, endYear)
    data.criteria = {
      id: String(data.InternalId),
      endYear: Number(endYear),
      startYear: Number(startYear),
    }

    return data
  }

  const shouldReverseColor = reverseColor(itemId)
  const { data } = useSwrHelper(key, dataFn, { revalidateOnFocus: false })
  return (
    <Box py={2} minHeight={height}>
      {data && (
        <Box>
          <EconChart data={data} symbol={symbol} width={width} days={90} reverseColor={shouldReverseColor} />
        </Box>
      )}
    </Box>
  )
}

export function reverseColor(itemId: number) {
  const positiveIsGood = [11, 14, 15, 41]
  const reverseColor = !positiveIsGood.includes(itemId)
  return reverseColor
}

export default EconWidget
