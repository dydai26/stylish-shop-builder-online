import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const slug = url.searchParams.get('slug')

    console.log('OG Image request for slug:', slug)

    if (!slug) {
      console.log('Missing slug parameter')
      return new Response('Missing slug parameter', { status: 400 })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('title, content, excerpt, image, slug')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    console.log('Query result:', { post, error })

    if (error || !post) {
      console.log('Post not found for slug:', slug)
      return new Response('Post not found', { status: 404 })
    }

    const baseUrl = 'https://www.ecovluu.com'
    const articleUrl = `${baseUrl}/blog/${post.slug}`
    const imageUrl = post.image.startsWith('http') ? post.image : `${baseUrl}${post.image}`
    const description = post.excerpt || post.content.slice(0, 160).replace(/<[^>]*>/g, '')

    console.log('Generating OG HTML with:', { title: post.title, imageUrl, articleUrl })

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title} | ECOVLUU Blog</title>
  <meta name="description" content="${description}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${post.title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="${articleUrl}">
  <meta property="og:site_name" content="ECOVLUU">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${post.title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  
  <link rel="canonical" href="${articleUrl}">
  
  <!-- Redirect to actual page -->
  <meta http-equiv="refresh" content="0;url=${articleUrl}">
</head>
<body>
  <p>Redirecting to <a href="${articleUrl}">${post.title}</a>...</p>
</body>
</html>`

    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('Error in og-image function:', error)
    return new Response('Internal server error', { status: 500 })
  }
})