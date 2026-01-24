import SingleNoteDisplay from '../SingleNoteDisplay'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <>
      <SingleNoteDisplay noteId={slug} edit={true} />
    </>
  )
}
