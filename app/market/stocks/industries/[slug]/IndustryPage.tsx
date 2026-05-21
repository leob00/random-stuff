import { SectorDetailsModel } from '../../sectors/[slug]/page'
import SectorLayout from '../../sectors/[slug]/SectorLayout'

export default async function SectorsPage({ data }: { data: SectorDetailsModel }) {
  return <SectorLayout data={data} />
}
