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
    
    if (!body?.brandOrUrl) {
      sendEvent('error', { message: '品牌名称或URL是必填项 (brandOrUrl is required)' });
      event.node.res.end();
      return;
    }

    const competitors = body.competitors || [];
    const keywords = body.keywords || 'Brand Profile';
    const brandOrUrl = body.brandOrUrl || '';
    const cacheKey = `${brandOrUrl}|${keywords}|${competitors.join(',')}`;

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

    // --- STEP 1: Scraping (Conditional) ---
    sendEvent('scraping', { message: '正在分析品牌标识并提取关联知识...' });
    
    let websiteContent = '';
    const isUrl = brandOrUrl.startsWith('http://') || brandOrUrl.startsWith('https://');
    
    if (isUrl) {
      websiteContent = await scrapeWebsite(brandOrUrl);
    } else {
      websiteContent = `The target brand is "${brandOrUrl}". Rely on your internal knowledge base to evaluate this brand's market presence and reputation.`;
    }
    
    // --- STEP 2: Scoring ---
    sendEvent('scoring_start', { message: '正在连接大模型进行初始打分评估...' });
    const scoringResult = await generateScoring(brandOrUrl, keywords, competitors, websiteContent);
    sendEvent('scoring', scoringResult);

    // --- STEP 3: Diagnostics & Content Gaps ---
    sendEvent('diagnostics_start', { message: '正在进行深度病灶诊断与内容缺口分析...' });
    const diagnosticsResult = await generateDiagnostics(brandOrUrl, keywords, websiteContent, scoringResult);
    sendEvent('diagnostics', diagnosticsResult);

    // --- STEP 4: Simulation & Action Plan ---
    sendEvent('action_start', { message: '正在模拟真实问答场景并生成行动处方...' });
    const actionPlanResult = await generateActionPlan(brandOrUrl, keywords, websiteContent, scoringResult);
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