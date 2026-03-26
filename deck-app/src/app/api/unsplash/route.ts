import { NextRequest, NextResponse } from 'next/server'

// Unsplash API for fetching images
// Uses the free tier with attribution

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || 'abstract minimal'
  const perPage = parseInt(searchParams.get('per_page') || '6')

  // If no API key, return placeholder images
  if (!UNSPLASH_ACCESS_KEY) {
    return NextResponse.json({
      images: generatePlaceholders(query, perPage),
      source: 'placeholder',
    })
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`)
    }

    const data = await response.json()

    const images = data.results.map((img: UnsplashImage) => ({
      id: img.id,
      url: img.urls.regular,
      thumb: img.urls.thumb,
      alt: img.alt_description || query,
      credit: {
        name: img.user.name,
        link: img.user.links.html,
      },
      downloadUrl: img.links.download_location,
    }))

    return NextResponse.json({ images, source: 'unsplash' })
  } catch (error) {
    console.error('Unsplash error:', error)
    // Fall back to placeholders
    return NextResponse.json({
      images: generatePlaceholders(query, perPage),
      source: 'placeholder',
    })
  }
}

interface UnsplashImage {
  id: string
  urls: {
    regular: string
    thumb: string
  }
  alt_description: string | null
  user: {
    name: string
    links: {
      html: string
    }
  }
  links: {
    download_location: string
  }
}

// Generate placeholder images when no API key
function generatePlaceholders(query: string, count: number) {
  const colors = ['0d9488', '3b82f6', 'f97316', '8b5cf6', 'ec4899', '10b981']
  return Array.from({ length: count }, (_, i) => ({
    id: `placeholder-${i}`,
    url: `https://via.placeholder.com/1200x800/${colors[i % colors.length]}/ffffff?text=${encodeURIComponent(query)}`,
    thumb: `https://via.placeholder.com/300x200/${colors[i % colors.length]}/ffffff?text=${encodeURIComponent(query)}`,
    alt: query,
    credit: null,
    downloadUrl: null,
  }))
}

// Track download for Unsplash attribution requirements
export async function POST(request: NextRequest) {
  if (!UNSPLASH_ACCESS_KEY) {
    return NextResponse.json({ success: true })
  }

  try {
    const { downloadUrl } = await request.json()

    if (downloadUrl) {
      // Trigger download endpoint for Unsplash tracking
      await fetch(downloadUrl, {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Download tracking error:', error)
    return NextResponse.json({ success: false })
  }
}
