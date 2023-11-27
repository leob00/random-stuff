import { NextApiRequest, NextApiResponse } from 'next'
import { getUserSSRApi } from 'lib/backend/server-side/serverSideAuth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const user = await getUserSSRApi(req)
  if (!user) {
    console.log('no user')
    NextResponse.json({ message: 'no user' })
  }
  if (user) {
    const data = await req.formData()
    const file: File | null = data.get('file') as unknown as File
    if (!file) {
      console.log('file not found')
      return NextResponse.json({ message: 'file not found' })
    }

    //const bytes = await file.arrayBuffer()
    //const buffer = Buffer.from(bytes)

    const path = `/${user.id}/${file.name}`
    console.log(`file uploaded: ${path}`)
    return NextResponse.json({ message: `file uploaded: ${path}` })
  }

  return NextResponse.json({ message: user })
}
