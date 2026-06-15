import { scrapeWebsite } from '../utils/geo/scraper';
import { generateScoring } from '../utils/geo/scoring';
import { generateDiagnostics } from '../utils/geo/diagnostics';
import { generateActionPlan } from '../utils/geo/actionPlan';

// We'll still keep a cache, but now it caches the final full result.
// For SSE, if it's cached, we can just blast all events immediately.
const analysisCache = new Map<string, any>();

export default defineEventHandler(async (event) => {
  // Use SSE streaming
  setHeader(event, 'Content-Type', 'text/event-stream');
  setHeader(event, 'Cache-Control', 'no-cache');
  setHeader(event, 'Connection', 'keep-alive');

  const sendEvent = (step: string, data: any) => {
    event.node.res.write(`data: ${JSON.stringify({ step, data })}\n\n`);
  };

  try {
    const body = await readBody(event);
    
    if (!body?.url) {
      sendEvent('error', { message: 'URL is required' });
      event.node.res.end();
      return;
    }

    const competitorUrl = body.competitor || '';
    const keywords = body.keywords || 'Brand Profile';
    const cacheKey = `${body.url}|${keywords}|${competitorUrl}`;

    // If cached, send everything instantly
    if (analysisCache.has(cacheKey)) {
      const cachedData = analysisCache.get(cacheKey);
      sendEvent('scraping', { message: 'Loaded from cache' });
      sendEvent('scoring', cachedData);
      sendEvent('diagnostics', cachedData);
      sendEvent('action', cachedData);
      sendEvent('complete', { message: 'Done' });
      event.node.res.end();
      return;
    }

    // --- STEP 1: Scraping ---
    sendEvent('scraping', { message: '正在抓取官网并提取核心语料...' });
    const websiteContent = await scrapeWebsite(body.url);
    
    // --- STEP 2: Scoring ---
    sendEvent('scoring_start', { message: '正在连接大模型进行初始打分评估...' });
    const scoringResult = await generateScoring(body.url, keywords, competitorUrl, websiteContent);
    sendEvent('scoring', scoringResult);

    // --- STEP 3: Diagnostics & Content Gaps ---
    sendEvent('diagnostics_start', { message: '正在进行深度病灶诊断与内容缺口分析...' });
    const diagnosticsResult = await generateDiagnostics(body.url, keywords, websiteContent, scoringResult);
    sendEvent('diagnostics', diagnosticsResult);

    // --- STEP 4: Simulation & Action Plan ---
    sendEvent('action_start', { message: '正在模拟真实问答场景并生成行动处方...' });
    const actionPlanResult = await generateActionPlan(body.url, keywords, websiteContent, scoringResult);
    sendEvent('action', actionPlanResult);

    // Combine results for cache
    const finalResult = {
      ...scoringResult,
      ...diagnosticsResult,
      ...actionPlanResult
    };
    analysisCache.set(cacheKey, finalResult);

    // Done
    sendEvent('complete', { message: '分析完成' });
    event.node.res.end();

  } catch (error: any) {
    console.error('Analysis error:', error);
    sendEvent('error', { message: error.message || 'Unknown error occurred during analysis' });
    event.node.res.end();
  }
});