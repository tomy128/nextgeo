import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  if (!body.email || !body.websiteUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and Website URL are required',
    })
  }

  // Use service key to bypass RLS if needed, or anon key since we allowed anonymous inserts
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase credentials are not configured',
    })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data, error } = await supabase
    .from('leads')
    .insert([
      { email: body.email, website_url: body.websiteUrl }
    ])
    .select('id, email, website_url, generation_count')
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save lead: ' + error.message,
    })
  }

  return { 
    success: true, 
    data: {
      id: data.id,
      email: data.email,
      websiteUrl: data.website_url,
      generationCount: data.generation_count
    } 
  }
})