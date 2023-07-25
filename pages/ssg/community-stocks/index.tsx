import type { GetStaticProps, NextPage } from 'next'
import ResponsiveContainer from 'components/Atoms/Boxes/ResponsiveContainer'
import CenteredHeader from 'components/Atoms/Boxes/CenteredHeader'
import { StockQuote } from 'lib/backend/api/models/zModels'
import { CategoryType, getRandomStuff } from 'lib/backend/api/aws/apiGateway'
import { orderBy } from 'lodash'
import CommunityStocksLayout from 'components/Organizms/stocks/CommunityStocksLayout'
import BackButton from 'components/Atoms/Buttons/BackButton'
import router from 'next/router'
import TabButtonList, { TabInfo } from 'components/Atoms/Buttons/TabButtonList'
import React from 'react'
import RecentlySearchedLayout from 'components/Organizms/stocks/RecentlySearchedLayout'

interface PageProps {
  allCommunityStocks: StockQuote[]
}

export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  const communityKey: CategoryType = 'community-stocks'

  const cData = (await getRandomStuff(communityKey)) as StockQuote[]
  const communityResult = orderBy(cData, ['Company'], 'asc')

  return {
    props: {
      allCommunityStocks: communityResult,
    },
  }
}
const Page: NextPage<PageProps> = ({ allCommunityStocks }) => {
  const [selectedTab, setSelectedTab] = React.useState('Recently Searched')

  const tabs: TabInfo[] = [
    // {
    //   selected: true,
    //   title: 'All',
    // },
    {
      selected: true,
      title: 'Recently Searched',
    },
  ]
  const handleSelectTab = (title: string) => {
    setSelectedTab(title)
  }
  return (
    <ResponsiveContainer>
      <BackButton onClicked={() => router.push('/csr/stocks')} />
      <CenteredHeader title='Community Stocks' />
      <TabButtonList tabs={tabs} onSelected={handleSelectTab} />
      {/* {selectedTab === 'All' && <CommunityStocksLayout data={allCommunityStocks} />} */}
      {selectedTab === 'Recently Searched' && <RecentlySearchedLayout />}
    </ResponsiveContainer>
  )
}

export default Page
