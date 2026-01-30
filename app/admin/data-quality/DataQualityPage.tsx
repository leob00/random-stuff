import DataQualityStart from 'components/Organizms/admin/data-quality/DataQualityStart'
import RequireClaim from 'components/Organizms/user/RequireClaim'

export default async function DataQualityPage() {
  return (
    <>
      <RequireClaim claimType='rs-admin'>
        <DataQualityStart />
      </RequireClaim>
    </>
  )
}
