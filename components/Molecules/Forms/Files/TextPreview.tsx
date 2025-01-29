import { Box } from '@mui/material'
import HtmlView from 'components/Atoms/Boxes/HtmlView'
import JsonView from 'components/Atoms/Boxes/JsonView'
import CopyableText from 'components/Atoms/Text/CopyableText'
import { useSwrHelper } from 'hooks/useSwrHelper'

const TextPreview = ({ url }: { url: string }) => {
  const dataFn = async () => {
    const fetchUrl = `/api/file?url=${encodeURIComponent(url)}`
    const resp = await fetch(fetchUrl, { method: 'POST', body: JSON.stringify(url) })
    const b = await resp.blob()
    const result = await b.text()
    return result
  }
  const { data } = useSwrHelper(url, dataFn, { revalidateOnFocus: false })

  return (
    <Box>
      {data && (
        <Box>
          <Box display={'flex'} justifyContent={'flex-end'} pr={2}>
            <CopyableText label='copy:' value={data} showValue={false} />
          </Box>
          <HtmlView html={data} />
        </Box>
      )}
    </Box>
  )
}

export default TextPreview
