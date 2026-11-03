import { Box, Typography } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import ComponentLoader from 'components/Atoms/Loaders/ComponentLoader'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { Company, serverGetFetch } from 'lib/backend/api/qln/qlnApi'

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
    const apiData = (await (await serverGetFetch(`/CompanyDetails?symbols=${[quote.Symbol]}`)).Body) as Company[]
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
  const { data, isLoading } = useSwrHelper(mutateKey, dataFn, { revalidateOnFocus: false })

  return (
    <Box pb={2} pt={2} minHeight={400}>
      {isLoading && <ComponentLoader />}

      <Box py={2} display={'flex'} gap={2} flexDirection={'column'}>
        {data?.awsUrl && (
          <Box py={2} sx={{ borderRadius: '8px' }} width={320} px={2}>
            <img src={`${data.awsUrl}`} alt='company logo' width={275} />
          </Box>
        )}
        {data?.company?.Description && (
          <FadeIn>
            <Typography color='primary'>{data?.company?.Description}</Typography>
          </FadeIn>
        )}
        {data?.company?.Sector && (
          <FadeIn>
            <Box display={'flex'} gap={2}>
              <Typography color='primary'>Sector:</Typography>
              <Typography color='primary'>{data.company.Sector}</Typography>
            </Box>
          </FadeIn>
        )}
        {data?.company?.Industry && (
          <FadeIn>
            <Box display={'flex'} gap={2}>
              <Typography color='primary'>Industry:</Typography>
              <Typography color='primary'>{data.company.Industry}</Typography>
            </Box>
          </FadeIn>
        )}
        {data?.company?.Ceo && (
          <FadeIn>
            <Box display={'flex'} gap={2}>
              <Typography color='primary'>CEO:</Typography>
              <Typography color='primary'>{data.company.Ceo}</Typography>
            </Box>
          </FadeIn>
        )}
      </Box>
    </Box>
  )
}

export default CompanyProfile
