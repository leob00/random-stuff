import { weakEncrypt } from 'lib/backend/encryption/useEncryptor'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const enc = await request.json()
  const result = weakEncrypt(enc)

  return NextResponse.json(result)
}
