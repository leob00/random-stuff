import Header from 'next/head'
const imageUrl = 'https://random-stuff-seven.vercel.app/images/logo-with-text-blue-small1200X630.png'
const Seo = ({ pageTitle }: { pageTitle: string }) => {
  return (
    <Header key={pageTitle}>
      <title>{`${pageTitle}`}</title>
      <meta name='description' content='Find recipes, create goals and notes, track stocks and view random pictures.' />
      {/* Facebook */}
      <meta property='og:url' content='https://random-stuff-seven.vercel.app' />
      <meta property='og:title' content={`${pageTitle}`} />
      <meta property='og:type' content='website' />
      <meta property='og:description' content='Find recipes, create goals and notes, track stocks and view random pictures.' />
      <meta property='og:image' content={imageUrl} />
      {/* Google */}
      <meta itemProp='name' content={`${pageTitle}`} />
      <meta itemProp='description' content={`Find recipes, create goals and notes, track stocks and view random pictures.`} />
      <meta itemProp='image' content={imageUrl} />
      {/* Twitter */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta property='twitter:title' content='Random Stuff' key='twitter-homeTitle' />
      <meta property='twitter:domain' content='random-stuff-seven.vercel.app' />
      <meta property='twitter:url' content='https://random-stuff-seven.vercel.app' />
      <meta name='twitter:title' content={pageTitle} />
      <meta property='twitter:description' content='Find recipes, create goals and notes, track stocks and view random pictures.' />
      <meta name='twitter:image' content={imageUrl} />
    </Header>
  )
}

export default Seo
