import Seo from 'components/Organizms/Seo'
import StockEarningsSearchDisplay from 'components/Organizms/stocks/earnings/StockEarningsSearchDisplay'
import { GetStaticProps, NextPage } from 'next'

interface PageProps {
  title: string
}
export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  return {
    props: {
      title: 'Stock Earnings Search',
    },
  }
}

const Page: NextPage<PageProps> = ({ title }) => {
  return (
    <>
      <Seo pageTitle={title} />
      <StockEarningsSearchDisplay />
    </>
  )
}

export default Page
