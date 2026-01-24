import JobEditDisplay from './JobEditDisplay'

export default async function JobEditPage({ id }: { id: string }) {
  return (
    <>
      <JobEditDisplay id={id} />
    </>
  )
}
