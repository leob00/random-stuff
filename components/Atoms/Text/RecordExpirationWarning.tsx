import { getExpirationText } from 'lib/util/dateUtil'
import AlertWithHeader from './AlertWithHeader'

const RecordExpirationWarning = ({ expirationDate, precise = false }: { expirationDate: string; precise?: boolean }) => {
  let message = getExpirationText(expirationDate, precise)

  return <AlertWithHeader severity='warning' text={message} />
}

export default RecordExpirationWarning
