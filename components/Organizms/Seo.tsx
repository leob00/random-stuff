import React from 'react'
import Header from 'next/head'

const Seo = ({ pageTitle }: { pageTitle: string }) => {
  return (
    <Header>
      <title>{`Random Stuff - ${pageTitle}`}</title>
      <meta name='description' content='Find recipes, create goals and notes, track stocks and view random pictures. Happy browsing!' />
      {/* Facebook */}
      <meta property='og:url' content='https://random-stuff-seven.vercel.app' />
      <meta property='og:title' content={`Random Stuff - ${pageTitle}`} />
      <meta property='og:type' content='website' />
      <meta property='og:description' content='Find recipes, create goals and notes, track stocks and view random pictures. Happy browsing!' />
      <meta property='og:image' content='https://random-stuff-seven.vercel.app/images/logo-with-text-blue-small-social.png' />
      {/* Google */}
      <meta itemProp='name' content={`Random Stuff - ${pageTitle}`} />
      <meta itemProp='description' content={`Find recipes, create goals and notes, track stocks and view random pictures. Happy browsing!`} />
      <meta itemProp='image' content={`https://random-stuff-seven.vercel.app/images/logo-with-text-blue-small-social.png`} />
      {/* Twitter */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta property='twitter:title' content='Random Stuff' key='twitter-homeTitle' />
      <meta property='twitter:domain' content='random-stuff-seven.vercel.app' />
      <meta property='twitter:url' content='https://random-stuff-seven.vercel.app' />
      <meta name='twitter:title' content='Random Stuff' />
      <meta property='twitter:description' content='Find recipes, create goals and notes, track stocks and view random pictures. Happy browsing!' />
    </Header>
  )
}

export default Seo
