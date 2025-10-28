'use client'
import { Button, Typography, TypographyProps } from '@mui/material'
import { useRouter } from 'next/navigation'
import BackdropLoader from '../Loaders/BackdropLoader'
import { useState } from 'react'
import { useRouteTracker } from 'components/Organizms/session/useRouteTracker'
import { Navigation } from 'components/Organizms/session/useSessionSettings'
import { PathNames } from 'components/Organizms/navigation/siteMap'
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'
import BarChartIcon from '@mui/icons-material/BarChart'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SearchIcon from '@mui/icons-material/Search'
import FlagIcon from '@mui/icons-material/Flag'
import NoteIcon from '@mui/icons-material/Note'
import DashboardIcon from '@mui/icons-material/Dashboard'
import KeyIcon from '@mui/icons-material/Key'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin'
import OilBarrelIcon from '@mui/icons-material/OilBarrel'
import EventIcon from '@mui/icons-material/Event'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill'
import AssessmentIcon from '@mui/icons-material/Assessment'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh'

type PagePros = {
  disabled?: boolean
} & Navigation &
  TypographyProps

const NavigationButton = ({ ...props }: PagePros) => {
  const renderIcon = (item: PathNames) => {
    switch (item) {
      case 'community stocks':
        return <BarChartIcon />
      case 'my stocks':
        return <StackedLineChartIcon />
      case 'earnings calendar':
        return <RequestQuoteIcon />
      case 'stock sentiment':
        return <SentimentVerySatisfiedIcon />
      case 'earnings report':
        return <ShowChartIcon />
      case 'stock alerts':
        return <NotificationsIcon />
      case 'advanced search':
        return <SearchIcon />
      case 'goals':
        return <FlagIcon />
      case 'notes':
        return <NoteIcon />
      case 'dashboard':
        return <DashboardIcon />
      case 'secrets':
        return <KeyIcon />
      case 'chat with AI':
        return <AutoAwesomeIcon />
      case 'crypto':
        return <CurrencyBitcoinIcon />
      case 'commodities':
        return <OilBarrelIcon />
      case 'economic calendar':
        return <EventIcon />
      case 'economic indicators':
        return <AssessmentIcon />
      case 'news':
        return <NewspaperIcon />
      case 'recipes':
        return <OutdoorGrillIcon />
      case 'volume leaders':
        return <BrightnessHighIcon />
      case 'market cap leaders':
        return <LeaderboardIcon />
      default:
        return <></>
    }
  }

  const { addRoute } = useRouteTracker()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    addRoute(props.path)
    setIsLoading(true)
    router.push(props.path)
  }
  return (
    <>
      {isLoading && <BackdropLoader />}

      <Button variant='text' onClick={handleClick} startIcon={renderIcon(props.name)} disabled={props.disabled}>
        <Typography variant={props.variant ?? 'h5'}>{props.name}</Typography>
      </Button>
    </>
  )
}

export default NavigationButton
