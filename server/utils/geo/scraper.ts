import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeWebsite(url: string): Promise<string> {
  let websiteContent = '';
  try {
    const { data } = await axios.get(url, { timeout: 8000 });
    const $ = cheerio.load(data);
    // Clean up scripts, styles, etc.
    $('script, style, nav, footer, iframe, img').remove();
    websiteContent = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 3000); // Take first 3000 chars
  } catch (e: any) {
    console.warn(`Scraping warning for ${url}: ${e.message}`);
    // Instead of completely failing or throwing, we return a fallback string
    // This string will be parsed by the LLM later
    websiteContent = `Could not access the website content directly due to network restrictions or timeout. Please rely heavily on your internal knowledge base regarding the brand/URL: ${url}`;
  }
  return websiteContent;
}