import { SectorDetailsModel } from './page'
import SectorLayout from './SectorLayout'

export default async function SectorsPage({ data }: { data: SectorDetailsModel }) {
  return <SectorLayout data={data} />
}
