import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

// This endpoint handles client-side uploads (bypasses serverless size limits)
export async function POST(request: NextRequest) {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Validate it's a PDF
        if (!pathname.endsWith('.pdf')) {
          throw new Error('Only PDF files are allowed')
        }
        return {
          allowedContentTypes: ['application/pdf'],
          maximumSizeInBytes: 20 * 1024 * 1024, // 20MB
        }
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('PDF uploaded:', blob.url)
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error('Upload error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to upload: ${message}` },
      { status: 500 }
    )
  }
}
