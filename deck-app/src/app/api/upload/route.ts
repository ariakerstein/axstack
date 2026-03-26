import { NextRequest, NextResponse } from 'next/server'
import { supabase, getSessionId } from '@/lib/supabase'

// Max file size: 5MB
const MAX_SIZE = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const sessionId = formData.get('sessionId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'png'
    const fileName = `${sessionId || 'anon'}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    // Convert to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('deck-media')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('deck-media')
      .getPublicUrl(data.path)

    return NextResponse.json({
      url: publicUrl,
      path: data.path,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

// List uploaded media for a session
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')

  if (!sessionId) {
    return NextResponse.json({ files: [] })
  }

  try {
    const { data, error } = await supabase.storage
      .from('deck-media')
      .list(sessionId, {
        limit: 50,
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (error) {
      console.error('List error:', error)
      return NextResponse.json({ files: [] })
    }

    const files = data.map((file) => {
      const { data: { publicUrl } } = supabase.storage
        .from('deck-media')
        .getPublicUrl(`${sessionId}/${file.name}`)
      return {
        name: file.name,
        url: publicUrl,
        createdAt: file.created_at,
      }
    })

    return NextResponse.json({ files })
  } catch (error) {
    console.error('List error:', error)
    return NextResponse.json({ files: [] })
  }
}
