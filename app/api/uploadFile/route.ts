import { NextApiRequest, NextApiResponse } from 'next'
import { getUserSSRApi } from 'lib/backend/server-side/serverSideAuth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const user = await getUserSSRApi(req)
  if (!user) {
    NextResponse.json({ message: 'no user' })
  }
  if (user) {
    const data = await req.formData()
    const file: File | null = data.get('file') as unknown as File
    if (!file) {
      return NextResponse.json({ message: 'file not found' })
    }

    const path = `/${user.id}/${file.name}`
    return NextResponse.json({ message: `file uploaded: ${path}` })
  }

  return NextResponse.json({ message: user })
}
