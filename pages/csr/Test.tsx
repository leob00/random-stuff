import React from 'react'
import { DrupalJsonApiParams } from 'drupal-jsonapi-params'

const Test = () => {
  React.useEffect(() => {
    //debugger
    const apiParams = new DrupalJsonApiParams()
    apiParams.addFilter('title', 'Rule%20G', 'STARTS_WITH')
    apiParams.addFields('node--article', ['id', 'title'])
    let drupalSite = 'https://dev-devtest00.pantheonsite.io/jsonapi/'
    let url = `${drupalSite}node/article/?${apiParams.getQueryString({ encode: false })}`
    console.log(url)
  }, [])
  return <div>Test</div>
}

export default Test
