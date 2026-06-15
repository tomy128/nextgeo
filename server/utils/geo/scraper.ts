import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeWebsite(url: string): Promise<string> {
  let websiteContent = '';
  try {
    const { data } = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(data);
    // Clean up scripts, styles, etc.
    $('script, style, nav, footer, iframe, img').remove();
    websiteContent = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 3000); // Take first 3000 chars
  } catch (e) {
    console.error('Scraping error:', e);
    websiteContent = `Unable to fetch website content for ${url}. Please assume it's a standard B2B website lacking clear differentiation.`;
  }
  return websiteContent;
}