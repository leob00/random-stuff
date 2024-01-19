import { Box, Button, Divider, Stack, Typography, Link } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Download from '@mui/icons-material/Download'
import RemoteImage from './Atoms/RemoteImage'
import loader from '../public/images/loaders/black-white-spinner.gif'
import NImage from 'next/image'
import HorizontalDivider from './Atoms/Dividers/HorizontalDivider'
import { BasicArticle } from 'lib/backend/api/aws/models/apiGatewayModels'

const RandomAnimalLayout = ({
  data,
  onRefresh,
  showNext = true,
  articles,
}: {
  data: BasicArticle
  onRefresh?: () => void
  showNext?: boolean
  articles?: BasicArticle[]
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)
  let router = useRouter()
  const handleNextClick = () => {
    if (onRefresh) {
      setIsImageLoading(true)
      onRefresh()
    }
  }
  const handleImageLoaded = () => {
    setIsImageLoading(false)
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <Box>loading...</Box>
  }

  return (
    <>
      {articles && (
        <>
          <Box>
            <Button
              variant='text'
              onClick={() => {
                router.push('/')
              }}
            >
              &#8592; back
            </Button>
            <Typography variant='h5' sx={{ my: 2 }}>
              {articles[0].title}
            </Typography>
            <HorizontalDivider />
          </Box>
          {articles.map((item) => (
            <Stack direction='row' justifyContent='center' my={2} key={item.imagePath}>
              <RemoteImage url={item.imagePath} title={item.title} />
            </Stack>
          ))}
        </>
      )}
      <Box>
        <Button
          variant='text'
          onClick={() => {
            router.push('/')
          }}
        >
          &#8592; back
        </Button>
        <Typography variant='h5'>{data.title}</Typography>
        <Divider />
      </Box>
      <Stack direction='row' justifyContent='center' my={2}>
        <RemoteImage url={data.imagePath} title={data.title} onLoaded={handleImageLoaded} />
      </Stack>
      {showNext && isMounted && (
        <Box sx={{ textAlign: 'center' }}>
          {!isImageLoading ? (
            <Button variant='outlined' onClick={handleNextClick}>
              Next
            </Button>
          ) : (
            <Button variant='outlined' onClick={handleNextClick} disabled={true}>
              <>
                <NImage src={loader} alt='loading' height={30} width={30} style={{ padding: 2 }} />
              </>
            </Button>
          )}
        </Box>
      )}
      <Stack direction='row' justifyContent='center' my={3}>
        <Link href={data.imagePath} target='_blank' download={data.title}>
          <Download />
        </Link>
      </Stack>
    </>
  )
}

export default RandomAnimalLayout
