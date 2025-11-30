import puppeteer, { Browser } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { PortfolioData, CardStyle, CardSize, CARD_DIMENSIONS } from '../lib/types';
import { prepareTemplateData } from '../core/portfolioService';
const TEMPLATE_PATH = path.join(__dirname, '../templates/portfolioCard.html');

// Browser instance for reuse
let browserInstance: Browser | null = null;

/**
 * Get or create a browser instance
 */
async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.connected) {
    console.log('[Generator] Launching Puppeteer browser...');
    browserInstance = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--allow-file-access-from-files',
      ],
      timeout: 60000,
    });
  }
  return browserInstance;
}

/**
 * Close the browser instance (call on app shutdown)
 */
export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
    console.log('[Generator] Browser closed');
  }
}

/**
 * Simple template rendering using Mustache-like syntax
 */
function renderTemplate(template: string, data: Record<string, unknown>): string {
  let result = template;

  // Handle conditionals: {{#key}}...{{/key}} (show if truthy)
  result = result.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, key, content) => {
    const value = data[key];
    if (Array.isArray(value)) {
      // It's an array - iterate
      return value.map(item => renderTemplate(content, { ...data, ...item })).join('');
    }
    return value ? renderTemplate(content, data) : '';
  });

  // Handle negative conditionals: {{^key}}...{{/key}} (show if falsy)
  result = result.replace(/\{\{\^(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, key, content) => {
    return !data[key] ? renderTemplate(content, data) : '';
  });

  // Handle simple variables: {{key}}
  result = result.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = data[key];
    if (value === undefined || value === null) return '';
    return String(value);
  });

  return result;
}

/**
 * Generate a portfolio card image from portfolio data
 */
export async function generatePortfolioImage(
  portfolio: PortfolioData,
  style: CardStyle = 'dark',
  size: CardSize = 'landscape'
): Promise<Buffer> {
  const dimensions = CARD_DIMENSIONS[size];
  console.log(`[Generator] Generating ${style}/${size} image for ${portfolio.developer.name} (${dimensions.width}x${dimensions.height})`);
  const startTime = Date.now();

  // Read and render the template
  const templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
  const templateData = prepareTemplateData(portfolio, style);
  let renderedHtml = renderTemplate(templateHtml, templateData);
  
  // Build CSS classes for card
  const classes = ['card'];
  if (style !== 'dark') classes.push(style);
  if (size !== 'landscape') classes.push(size);
  
  renderedHtml = renderedHtml.replace('class="card"', `class="${classes.join(' ')}"`);

  // Get browser instance
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    // Set viewport to card dimensions
    await page.setViewport({
      width: dimensions.width,
      height: dimensions.height,
      deviceScaleFactor: 2, // 2x for retina quality
    });

    // Load the rendered HTML
    await page.setContent(renderedHtml, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Wait for all images to load
    await page.evaluate(() => {
      return new Promise<void>((resolveAll) => {
        const images = Array.from(document.querySelectorAll('img'));
        if (images.length === 0) {
          resolveAll();
          return;
        }
        
        let loadedCount = 0;
        const checkComplete = () => {
          loadedCount++;
          if (loadedCount >= images.length) {
            resolveAll();
          }
        };

        images.forEach((img) => {
          if (img.complete) {
            checkComplete();
          } else {
            img.onload = checkComplete;
            img.onerror = checkComplete; // Don't fail on broken images
            // Timeout after 5 seconds per image
            setTimeout(checkComplete, 5000);
          }
        });
      });
    });

    // Take screenshot of the card element
    const cardElement = await page.$('#card');
    if (!cardElement) {
      throw new Error('Card element not found in template');
    }

    const screenshot = await cardElement.screenshot({
      type: 'png',
      omitBackground: false,
    });

    const duration = Date.now() - startTime;
    console.log(`[Generator] Image generated in ${duration}ms`);

    return screenshot as Buffer;
  } finally {
    await page.close();
  }
}

/**
 * Generate and save image to file (for development/debugging)
 */
export async function generateAndSaveImage(
  portfolio: PortfolioData,
  outputPath: string,
  style: CardStyle = 'dark',
  size: CardSize = 'landscape'
): Promise<string> {
  const imageBuffer = await generatePortfolioImage(portfolio, style, size);
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, imageBuffer);
  console.log(`[Generator] Image saved to: ${outputPath}`);
  
  return outputPath;
}

/**
 * Generate a unique filename for the output image
 */
export function generateOutputFilename(developerId: string): string {
  const timestamp = Date.now();
  return `portfolio-${developerId}-${timestamp}.png`;
}

