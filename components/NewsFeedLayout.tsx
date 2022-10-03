import { Box, Typography, Container, Link, Divider, Grid, FormControlLabel, Switch, LinearProgress } from '@mui/material'
import { NewsItem } from 'lib/backend/api/qln/qlnApi'
import React from 'react'
import NLink from 'next/link'
import { getPagedItems, Page } from 'lib/util/collections'
import { findLast, map, uniq } from 'lodash'
import Pager from './Atoms/Pager'
import { DarkMode } from './themes/DarkMode'
import { DarkBlue, DarkBlueTransparent, LightBlue, VeryLightBlue } from './themes/mainTheme'

type sourceTypes = 'Google Business' | 'BBC World' | undefined
type categoryTypes = 'Financial' | 'World'

export interface Model {
  sourceTypes: sourceTypes[]
  categoryTypes: categoryTypes[]
  allItems: NewsItem[]
  pagedItems: NewsItem[]
  currentPageNum: number
  allPages: Page[]
  isAutoPlayRunning: boolean
}

type ActionTypes = { type: 'reset' } | { type: 'set-page-index'; payload: { num: number; displayedItems: NewsItem[] } } | { type: 'start-stop-autoplay'; payload: { isRunning: boolean } }

function reducer(state: Model, action: ActionTypes) {
  switch (action.type) {
    case 'reset':
      return { ...state }
    case 'set-page-index':
      return { ...state, currentPageNum: action.payload.num, pagedItems: action.payload.displayedItems }
    case 'start-stop-autoplay':
      return { ...state, isAutoPlayRunning: action.payload.isRunning }
  }
}

const NewsFeedLayout = ({ articles }: { articles: NewsItem[] }) => {
  const itemsPerPage = 1
  const paged = getPagedItems<NewsItem>(articles, itemsPerPage)

  //const [currentPageIndex, setCurrentPageIndex] = React.useState(1)
  const pagedItems = paged.pages[0].items as NewsItem[]

  //const [displayedItems, setDisplayedItems] = React.useState(pagedItems)
  const initialState: Model = {
    sourceTypes: uniq(
      map(articles, (e) => {
        return e.Source as sourceTypes
      }),
    ),
    categoryTypes: [],
    allItems: articles,
    pagedItems: pagedItems,
    currentPageNum: 1,
    allPages: paged.pages,
    isAutoPlayRunning: false,
  }
  const [model, dispatch] = React.useReducer(reducer, initialState)

  const handlePaged = (pageNum: number) => {
    let page = findLast(model.allPages, (p) => {
      return p.index === pageNum
    })

    if (page) {
      dispatch({ type: 'set-page-index', payload: { num: pageNum, displayedItems: page.items as NewsItem[] } })
    } else {
      dispatch({ type: 'set-page-index', payload: { num: 1, displayedItems: model.allPages[0].items as NewsItem[] } })
    }
  }
  const handleStartStopAutoPlay = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    dispatch({ type: 'start-stop-autoplay', payload: { isRunning: checked } })
    if (checked === true) {
      handlePaged(model.currentPageNum + 1)
    }
  }
  const handleAutoPlay = (pageNum: number) => {
    if (!model.isAutoPlayRunning) {
      dispatch({ type: 'start-stop-autoplay', payload: { isRunning: false } })
    }
    let page = findLast(model.allPages, (p) => {
      return p.index === pageNum
    })

    if (page) {
      dispatch({ type: 'set-page-index', payload: { num: pageNum, displayedItems: page.items as NewsItem[] } })
    } else {
      dispatch({ type: 'set-page-index', payload: { num: 1, displayedItems: model.allPages[0].items as NewsItem[] } })
    }
  }

  React.useEffect(() => {
    setTimeout(() => {
      if (model.isAutoPlayRunning) {
        //let pageNum = model.currentPageNum + 1
        handleAutoPlay(model.currentPageNum + 1)
      }
    }, 6000)
  }, [model.isAutoPlayRunning, model.currentPageNum]) /* eslint-disable-line react-hooks/exhaustive-deps */ /* this is needed for some reason */

  return (
    <>
      <Container>
        <Box sx={{ textAlign: 'right', my: 2 }} justifyContent='end'>
          <FormControlLabel control={<Switch size='small' onChange={handleStartStopAutoPlay} />} label='auto play' />
        </Box>
        <Divider />
        {model.pagedItems.length > 0 &&
          model.pagedItems.map((item) => (
            <Box key={item.HeadlineRecordHash} sx={{ minHeight: 280, backgroundColor: DarkBlue, borderRadius: 4 }}>
              <Box>
                <Grid container spacing={1}>
                  <Grid item xs={0} md={1}></Grid>
                  <Grid item xs={12} md={10}>
                    <DarkMode>
                      <Box sx={{ display: 'flex', alignItems: 'center', padding: 3, marginTop: 5 }}>
                        <Typography variant='h4' sx={{}}>
                          <NLink passHref href={item.Link!}>
                            <Link sx={{ textDecoration: 'none', color: VeryLightBlue, ':hover': 'white' }} target={'_blanks'}>
                              {item.Headline}
                            </Link>
                          </NLink>
                        </Typography>
                      </Box>
                    </DarkMode>
                  </Grid>
                  <Grid item xs={0} md={1}></Grid>
                </Grid>
              </Box>
            </Box>
          ))}
        {model.isAutoPlayRunning && (
          <Box sx={{ my: 4 }}>
            <LinearProgress variant='determinate' value={Math.floor((model.currentPageNum * 100) / model.allPages.length)} />
            <Typography variant='body2' sx={{ textAlign: 'center', my: 2 }}>{`${model.currentPageNum} of ${model.allItems.length}`}</Typography>
          </Box>
        )}
        {!model.isAutoPlayRunning && (
          <Box sx={{ my: 4 }}>
            <Pager pageCount={paged.pages.length} itemCount={articles.length} itemsPerPage={itemsPerPage} onPaged={(pageNum: number) => handlePaged(pageNum)} defaultPageIndex={model.currentPageNum}></Pager>
          </Box>
        )}
      </Container>
    </>
  )
}

export default NewsFeedLayout
