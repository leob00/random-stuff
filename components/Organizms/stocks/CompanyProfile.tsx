import { Box, Typography } from '@mui/material'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { Company, getCompanyProfile } from 'lib/backend/api/qln/qlnApi'
import React from 'react'

interface Model {
  company: Company | null
  awsUrl: string | null
}

const CompanyProfile = ({ quote }: { quote: StockQuote }) => {
  const mutateKey = `companyLogos-${quote.Symbol}`

  const dataFn = async () => {
    const result: Model = {
      company: null,
      awsUrl: null,
    }
    const apiData = await getCompanyProfile([quote.Symbol])
    if (apiData.length > 0) {
      const company = apiData[0]
      if (company.IconRelativePath && !company.LogoRelativePath) {
        result.awsUrl = `https://debqyqoq9od6o.cloudfront.net/companyImages/${company.IconRelativePath}`
      }
      if (company.LogoRelativePath) {
        result.awsUrl = `https://debqyqoq9od6o.cloudfront.net/companyImages/${company.LogoRelativePath}`
      }

      result.company = company
    }
    return result
  }
  const { data, isLoading } = useSwrHelper(mutateKey, dataFn)

  return (
    <Box pb={2} pt={2} minHeight={400}>
      {isLoading ? (
        <BackdropLoader />
      ) : (
        <>
          <Box py={2} display={'flex'} gap={2} flexDirection={'column'}>
            {data?.awsUrl && (
              <Box py={2} sx={{ borderRadius: '8px' }} width={320} px={2}>
                <img src={`${data.awsUrl}`} alt='company logo' width={275} />
              </Box>
            )}
            {data?.company?.Description && <Typography>{data?.company?.Description}</Typography>}
            {data?.company?.Sector && (
              <Box display={'flex'} gap={2}>
                <Typography>Sector:</Typography>
                <Typography>{data.company.Sector}</Typography>
              </Box>
            )}
            {data?.company?.Industry && (
              <Box display={'flex'} gap={2}>
                <Typography>Industry:</Typography>
                <Typography>{data.company.Industry}</Typography>
              </Box>
            )}
            {data?.company?.Ceo && (
              <Box display={'flex'} gap={2}>
                <Typography>CEO:</Typography>
                <Typography>{data.company.Ceo}</Typography>
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  )
}

export default CompanyProfile
