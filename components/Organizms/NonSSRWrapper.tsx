import dynamic from 'next/dynamic'
import React from 'react'
const NonSSRWrapper = (props: { children: boolean | React.JSX.Element | React.JSX.Element[] | React.ReactPortal | null | undefined }) => <>{props.children}</>
export default dynamic(() => Promise.resolve(NonSSRWrapper), {
  ssr: false,
})
