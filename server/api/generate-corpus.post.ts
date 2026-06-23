import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const MAX_GENERATIONS_PER_LEAD = 3

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const leadId = getCookie(event, 'lead_id') || body.leadId

  if (!leadId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized. Please unlock the report first.',
    })
  }

  if (!body.taskContext || !body.websiteUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Task context and website URL are required',
    })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
  const openaiApiKey = process.env.OPENAI_API_KEY

  if (!supabaseUrl || !supabaseServiceKey || !openaiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error',
    })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // 1. Validate Lead and Check Quota
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('id, generation_count')
    .eq('id', leadId)
    .single()

  if (leadError || !lead) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid lead ID',
    })
  }

  if (lead.generation_count >= MAX_GENERATIONS_PER_LEAD) {
    throw createError({
      statusCode: 429,
      statusMessage: `You have reached the maximum limit of ${MAX_GENERATIONS_PER_LEAD} generations. Please contact support for more.`,
    })
  }

  // 2. Generate Content using OpenAI
  const openai = new OpenAI({ apiKey: openaiApiKey })

  const systemPrompt = `You are an expert SEO and Content Marketing Strategist specializing in Generative Engine Optimization (GEO).
Your goal is to write a highly optimized, EEAT-compliant (Experience, Expertise, Authoritativeness, Trustworthiness) article or content piece based on the user's task.
The content should be structured with clear headings, bullet points, and actionable insights. It MUST be written in Markdown format.`

  const userPrompt = `Please generate content for the following task.
Website: ${body.websiteUrl}
Task Title: ${body.taskContext.title}
Task Context/Reason: ${body.taskContext.reason}

Ensure the output is a complete, ready-to-publish Markdown article that directly addresses this task and improves the brand's visibility in AI search engines.`

  try {
    // We'll use streaming for the response if possible, but for MVP, let's just return the full text first, or set up a streaming response.
    // To keep it simple and robust for now, we'll do a blocking call, but ideally, this should be streamed to the client.
    // Setting up streaming in Nuxt 3 API routes:
    
    setResponseHeader(event, 'Content-Type', 'text/event-stream')
    setResponseHeader(event, 'Cache-Control', 'no-cache')
    setResponseHeader(event, 'Connection', 'keep-alive')

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      stream: true,
      temperature: 0.7,
    })

    // Increment generation count in the background
    await supabase
      .from('leads')
      .update({ generation_count: lead.generation_count + 1 })
      .eq('id', leadId)

    // Return the stream
    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text: content })}\n\n`))
            }
          }
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
          controller.close()
        } catch (e) {
          controller.error(e)
        }
      }
    })

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate content: ' + error.message,
    })
  }
})