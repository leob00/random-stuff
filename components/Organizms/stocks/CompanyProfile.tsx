import { Box, Typography } from '@mui/material'
import FadeIn from 'components/Atoms/Animations/FadeIn'
import BackdropLoader from 'components/Atoms/Loaders/BackdropLoader'
import { useSwrHelper } from 'hooks/useSwrHelper'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { Company, getCompanyProfile, serverGetFetch } from 'lib/backend/api/qln/qlnApi'

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
      {isLoading && <BackdropLoader />}

      <Box py={2} display={'flex'} gap={2} flexDirection={'column'}>
        {data?.awsUrl && (
          <Box py={2} sx={{ borderRadius: '8px', backgroundColor: 'whitesmoke' }} width={320} px={2}>
            <img src={`${data.awsUrl}`} alt='company logo' width={275} />
          </Box>
        )}
        <Box>
          {data?.company?.Description && (
            <FadeIn>
              <Typography>{data?.company?.Description}</Typography>
            </FadeIn>
          )}
          {data?.company?.Sector && (
            <FadeIn>
              <Box display={'flex'} gap={2}>
                <Typography>Sector:</Typography>
                <Typography>{data.company.Sector}</Typography>
              </Box>
            </FadeIn>
          )}
          {data?.company?.Industry && (
            <FadeIn>
              <Box display={'flex'} gap={2}>
                <Typography>Industry:</Typography>
                <Typography>{data.company.Industry}</Typography>
              </Box>
            </FadeIn>
          )}
          {data?.company?.Ceo && (
            <FadeIn>
              <Box display={'flex'} gap={2}>
                <Typography>CEO:</Typography>
                <Typography>{data.company.Ceo}</Typography>
              </Box>
            </FadeIn>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default CompanyProfile
