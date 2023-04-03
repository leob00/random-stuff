import React from 'react'
import Header from 'next/head'

const Seo = ({ pageTitle }: { pageTitle: string }) => {
  return (
    <Header>
      <title>{`Random Stuff - ${pageTitle}`}</title>
      <meta name='twitter:card' content='summary_large_image'></meta>
      <meta property='og:title' content='Random Stuff: this site is dedicated to random foolishness and inconsequential musings.' key='homeTitle' />
      <meta
        property='twitter:title'
        content='Random Stuff: this site is dedicated to random foolishness and inconsequential musings.'
        key='twitter-homeTitle'
      />
      <meta property='og:description' content='Find recipes, create notes, and view random pictures. Happy browsing!' key='homeDescription' />
      <meta property='twitter:description' content='Find recipes, create notes, and view random pictures. Happy browsing!' key='twitter-homeDescription' />
      <meta property='og:image' content='https://random-stuff-seven.vercel.app/images/logo-with-text-blue-small-social.png' key='homeLogo' />
    </Header>
  )
}

export default Seo
