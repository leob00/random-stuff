import type { GetStaticProps, NextPage } from 'next'
import HomeMenu from 'components/Organizms/HomeMenu'
import Header from 'next/head'
import axios, { AxiosRequestConfig } from 'axios'
import https from 'https'

const getSiteHtml = async (url: string) => {
  //var url = 'https://dog.ceo/api/breeds/image/random'
  let body = ''

  https
    .get(url, (res: any) => {
      res.on('data', (chunk: string) => {
        body += chunk
      })

      res.on('end', () => {
        try {
          //let result = JSON.parse(body)
          console.log(body)
        } catch (error: any) {
          console.error(error.message)
        }
      })
    })
    .on('error', (error: any) => {
      console.error(error.message)
    })
}

export const getStaticProps: GetStaticProps = async (context) => {
  //var data = await getYieldCurveData()
  //const resp = await axios.get('/api/prefetchUrl?id=/')

  //console.log(resp)
  /* let config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'text/html',
    },
  }
  const resp = await axios.post('https://random-stuff-seven.vercel.app/ssg/About', config)
  console.log(resp.data) */
  //await getSiteHtml('https://random-stuff-seven.vercel.app/ssg/About')
  return {
    props: {},
  }
}
const Home: NextPage = () => {
  return (
    <>
      <Header>
        <title>Random Stuff - Home</title>
        <meta property='og:title' content='Random Stuff' key='homeTitle' />
        <meta property='og:description' content='Random Stuff: this site is dedicated to random foolishness and inconsequential musings.' key='homeDescription' />
        <meta property='og:image' content='/images/logo-with-text-blue-small.png' key='homeLogo' />
      </Header>
      <HomeMenu />
    </>
  )
}

export default Home
