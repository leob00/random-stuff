import { Box, Typography } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { get } from 'lib/backend/api/fetchFunctions'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { Company, getCompanyProfile } from 'lib/backend/api/qln/qlnApi'
import React from 'react'

const CompanyProfile = ({ quote }: { quote: StockQuote }) => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [data, setData] = React.useState<Company | null>(null)
  const [logo, setLogo] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fn = async () => {
      const apiData = await getCompanyProfile([quote.Symbol])
      if (apiData.length > 0) {
        const logoUrl = encodeURIComponent(`http://qln-cdn.s3-website-us-east-1.amazonaws.com/companyLogos/${quote.Symbol}.png`)
        const logoResponse = await fetch(`/api/downloadImage?url=${logoUrl}`)
        const logoData = await logoResponse.json()
        //console.log(logoData)
        setLogo(logoData)
        setData(apiData[0])
      }
      setIsLoading(false)
    }
    fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Box pb={2} pt={2} minHeight={400}>
      {isLoading ? (
        <BackdropLoader />
      ) : (
        <>
          <Box py={2} display={'flex'} gap={2} flexDirection={'column'}>
            {logo && (
              <Box py={2}>
                <img src={`data:image/png;base64, ${logo}`} alt='company logo' />
              </Box>
            )}
            <Typography>{data?.Description}</Typography>
            {data?.Sector && (
              <Box display={'flex'} gap={2}>
                <Typography>Sector:</Typography>
                <Typography>{data.Sector}</Typography>
              </Box>
            )}
            {data?.Industry && (
              <Box display={'flex'} gap={2}>
                <Typography>Industry:</Typography>
                <Typography>{data.Industry}</Typography>
              </Box>
            )}
            {data?.Ceo && (
              <Box display={'flex'} gap={2}>
                <Typography>CEO:</Typography>
                <Typography>{data.Ceo}</Typography>
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  )
}

export default CompanyProfile
